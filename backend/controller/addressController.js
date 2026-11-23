const mongoose = require("mongoose");
const Address=require("../models/userAddressModel")
// const {geocodeAddress}=require("./utils/geocodeAddress")

const geocodeAddress = async (address, landmark = "") => {
    const addressParts = address
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

    const areaAndCity = addressParts.slice(-3).join(", ");
    const cityAndState = addressParts.slice(-2).join(", ");

    const queries = [
        address,
        landmark ? `${address}, ${landmark}` : "",
        landmark ? `${landmark}, ${areaAndCity}` : "",
        areaAndCity,
        cityAndState
    ];

    const uniqueQueries = [
        ...new Set(
            queries
                .filter(Boolean)
                .map((query) => `${query}, India`)
        )
    ];

    for (const query of uniqueQueries) {
        try {
            console.log("Photon Searching:", query);

            const url = new URL("https://photon.komoot.io/api/");

            url.searchParams.set("q", query);
            url.searchParams.set("limit", "5");
            url.searchParams.set("lang", "en");

            const response = await fetch(url, {
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                console.log("Photon Response Error:", response.status);
                continue;
            }

            const data = await response.json();

            console.log(
                "PHOTON FEATURES:",
                data.features?.map((item) => ({
                    coordinates: item.geometry?.coordinates,
                    properties: item.properties
                }))
            );

            if (!data.features || data.features.length === 0) {
                continue;
            }

            const feature = data.features.find((item) => {
                const coordinates = item.geometry?.coordinates;

                const longitude = coordinates?.[0];
                const latitude = coordinates?.[1];

                const countryCode =
                    item.properties?.countrycode?.toUpperCase();

                return (
                    Number.isFinite(longitude) &&
                    Number.isFinite(latitude) &&
                    longitude >= 68 &&
                    longitude <= 98 &&
                    latitude >= 6 &&
                    latitude <= 38 &&
                    !(longitude === 0 && latitude === 0) &&
                    (!countryCode || countryCode === "IN")
                );
            });

            if (feature) {
                const [longitude, latitude] =
                    feature.geometry.coordinates;

                console.log("Location Found:", {
                    query,
                    latitude,
                    longitude
                });

                return {
                    latitude,
                    longitude
                };
            }

            console.log("No valid Indian location found:", query);

        } catch (error) {
            console.log("Photon Error:", error.message);
        }
    }

    return null;
};

const addAddress = async (req, res) => {
    try {
        const {
            type,
            name,
            phone,
            houseNumber,
            street,
            landmark,
            city,
            state,
            country,
            pincode,
            isDefault,
        } = req.body;

        // REQUIRED FIELD VALIDATION
        const requiredFields = {
            type,
            houseNumber,
            street,
            city,
            state,
            country,
            pincode,
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value || !String(value).trim())
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
                missingFields,
            });
        }

        const userId = req.user.id;


        const fullAddress = [
                   houseNumber,
    street,
    city,
    state,
    pincode,
    country,
].filter(Boolean).join(", ");


// GENERATE LOCATION USING PHOTON
const locationData = await geocodeAddress(fullAddress, landmark);

        if (!locationData) {
            return res.status(400).json({
                success: false,
                message: "Unable to find location for this address. Please check your address.",
            });
        }
        console.log("FULL ADDRESS:", fullAddress);
console.log("LOCATION DATA:", locationData);

        // CHECK EXISTING ADDRESSES
        const existingAddress = await Address.findOne({
            user: userId,
        });

        const makeDefault =
            isDefault === true ||
            isDefault === "true" ||
            !existingAddress;

        // REMOVE PREVIOUS DEFAULT ADDRESS
        if (makeDefault) {
            await Address.updateMany(
                { user: userId },
                { $set: { isDefault: false } }
            );
        }
        console.log("SAVING COORDINATES:", [
    locationData.longitude,
    locationData.latitude
]);
;

        // SAVE ADDRESS
        const address = await Address.create({
            user: userId,
            type,
            name,
            phone,
            houseNumber,
            street,
            landmark,
            city,
            state,
            country,
            pincode,

            location: {
                type: "Point",
                coordinates: [
                    locationData.longitude,
                    locationData.latitude,
                ],
            },

            isDefault: makeDefault,
        });

 console.log("CUSTOMER LOCATION:", address.location);
console.log("CUSTOMER COORDINATES:", address.location.coordinates)
        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            address,
        });

    } catch (error) {
        console.log("Add Address Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;

        const addresses = await Address.find({
            user: userId,
        }).sort({
            isDefault: -1,
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            message: "Addresses fetched successfully",
            addresses,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        console.log(userId)

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid address ID",
            });
        }

        const address = await Address.findOne({
            _id: id,
            user: userId,
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        const wasDefault = address.isDefault;

        await Address.deleteOne({
            _id: id,
            user: userId,
        });

        // If deleted address was default, assign another default
        if (wasDefault) {
            const nextAddress = await Address.findOne({
                user: userId,
            }).sort({
                createdAt: -1,
            });

            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
        });

    } catch (error) {
        console.log(error);
    return res.status(500).json({
        success: false,
        message: error.message
    });
    }
};
const setDefaultAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check valid ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid address ID",
            });
        }

        // Find address of logged-in user
        const address = await Address.findOne({
            _id: id,
            user: userId,
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        // Remove default from all addresses
        await Address.updateMany(
            { user: userId },
            { $set: { isDefault: false } }
        );

        // Set selected address as default
        address.isDefault = true;
        await address.save();

        return res.status(200).json({
            success: true,
            message: "Default address updated successfully",
            address,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const editAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid address ID",
            });
        }

        const {
            type,
            name,
            phone,
            houseNumber,
            street,
            landmark,
            city,
            state,
            country,
            pincode,
        } = req.body;

        const address = await Address.findOne({
            _id: id,
            user: userId,
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        const fullAddress = [
            houseNumber ?? address.houseNumber,
            street ?? address.street,
            city ?? address.city,
            state ?? address.state,
            pincode ?? address.pincode,
            country ?? address.country,
        ].filter(Boolean).join(", ");

        // Generate updated location
        const locationData = await geocodeAddress(
            fullAddress,
            landmark ?? address.landmark
        );

        if (!locationData) {
            return res.status(400).json({
                success: false,
                message: "Unable to find location for this address. Please check your address.",
            });
        }

        // Update address fields
        address.type = type ?? address.type;
        address.name = name ?? address.name;
        address.phone = phone ?? address.phone;
        address.houseNumber = houseNumber ?? address.houseNumber;
        address.street = street ?? address.street;
        address.landmark = landmark ?? address.landmark;
        address.city = city ?? address.city;
        address.state = state ?? address.state;
        address.country = country ?? address.country;
        address.pincode = pincode ?? address.pincode;

        // Update coordinates
        address.location = {
            type: "Point",
            coordinates: [
                locationData.longitude,
                locationData.latitude,
            ],
        };

        await address.save();

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address,
        });

    } catch (error) {
        console.log("Edit Address Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports={addAddress,getAddresses,deleteAddress,setDefaultAddress,editAddress}