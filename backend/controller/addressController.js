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

    // 5 FALLBACK ATTEMPTS

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

            const url = new URL(
                "https://photon.komoot.io/api/"
            );

            url.searchParams.set("q", query);
            url.searchParams.set("limit", "5");
            url.searchParams.set("lang", "en");
            url.searchParams.set("countrycode", "IN");

            const response = await fetch(url, {
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                continue;
            }

            const data = await response.json();

            if (!data.features || data.features.length === 0) {
                continue;
            }

            const feature = data.features.find((item) => {

                const coordinates = item.geometry?.coordinates;

                const longitude = coordinates?.[0];
                const latitude = coordinates?.[1];

                return (
                    Number.isFinite(longitude) &&
                    Number.isFinite(latitude) &&
                    longitude >= -180 &&
                    longitude <= 180 &&
                    latitude >= -90 &&
                    latitude <= 90 &&
                    item.properties?.countrycode?.toUpperCase() === "IN"
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

module.exports={addAddress,getAddresses,deleteAddress,setDefaultAddress}