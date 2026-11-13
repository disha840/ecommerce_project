const mongoose = require("mongoose");
const Store=require("../models/storeModel.js");
const User=require("../models/userModel.js")
// CREATE STORE

// GET STORE MANAGERS
 const getStoreManagers = async (req, res) => {
  try {
    const managers = await User.find()
      .populate("role");

    const storeManagers = managers.filter(
      (user) => user.role?.name === "store_manager"
    );

    res.status(200).json({
      success: true,
      managers: storeManagers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// GET LATITUDE AND LONGITUDE FROM ADDRESS

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


// CREATE STORE
const createStore = async (req, res) => {
    try {

        const {
            name,
            code,
            manager,
            phone,
            address,
            landmark,
            serviceRadius,
            status
        } = req.body;

        // ADDRESS VALIDATION
        if (!address || !address.trim()) {
            return res.status(400).json({
                success: false,
                message: "Store address is required"
            });
        }

        // GET COORDINATES FROM ADDRESS
        const locationData = await geocodeAddress(
            address.trim(),
            landmark?.trim() || ""
        );

        // LOCATION NOT FOUND
        if (!locationData) {
            return res.status(400).json({
                success: false,
                message: "Unable to find location. Please enter a more complete address or landmark."
            });
        }

        // CREATE STORE
        const store = await Store.create({
            name,
            code,
            manager,
            phone,
            address,
            landmark: landmark || "",
            serviceRadius,
            status,

            // GEOJSON LOCATION
            location: {
                type: "Point",
                coordinates: [
                    locationData.longitude,
                    locationData.latitude
                ]
            }
        });

        return res.status(201).json({
            success: true,
            message: "Store created successfully",
            store
        });

    } catch (error) {

        console.log("Create Store Error:", error.message);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createStore
};

const getStores = async (req, res) => {
  try {
    const stores = await Store.find()
      .populate("manager", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Stores fetched successfully",
      stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByIdAndDelete(id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Store deleted successfully"
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};




const getNearestStore = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        // VALIDATE COORDINATES
        if (
            latitude === undefined ||
            longitude === undefined ||
            !Number.isFinite(Number(latitude)) ||
            !Number.isFinite(Number(longitude)) ||
            Number(latitude) < -90 ||
            Number(latitude) > 90 ||
            Number(longitude) < -180 ||
            Number(longitude) > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid latitude and longitude are required",
            });
        }

        const customerLatitude = Number(latitude);
        const customerLongitude = Number(longitude);

        console.log("Customer Location:", {
            latitude: customerLatitude,
            longitude: customerLongitude,
        });

        // FIND NEAREST STORE USING GEO NEAR
        const stores = await Store.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [
                            customerLongitude,
                            customerLatitude,
                        ],
                    },
                    distanceField: "distance",
                    spherical: true,
                    key: "location",
                    query: {
                        status: "ACTIVE",
                    },
                },
            },

            // CHECK STORE SERVICE RADIUS
            {
                $match: {
                    $expr: {
                        $lte: [
                            "$distance",
                            {
                                $multiply: [
                                    "$serviceRadius",
                                    1000,
                                ],
                            },
                        ],
                    },
                },
            },

            // GET NEAREST STORE
            {
                $limit: 1,
            },
        ]);

        if (stores.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Sorry, no store delivers to your location",
            });
        }

        const nearestStore = stores[0];

        console.log("Nearest Store:", nearestStore.name);

        return res.status(200).json({
            success: true,
            message: "Nearest store found successfully",
            store: {
                ...nearestStore,
                distance: Number(
                    (nearestStore.distance / 1000).toFixed(2)
                ),
                distanceInKm: Number(
                    (nearestStore.distance / 1000).toFixed(2)
                ),
            },
        });

    } catch (error) {
        console.log("Nearest Store Error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const updateStore = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            code,
            manager,
            phone,
            address,
            landmark,
            serviceRadius,
            status,
        } = req.body;

        // Validate Store ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid store ID",
            });
        }

        // Find Store
        const store = await Store.findById(id);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        // Check duplicate store code
        if (code && code.trim() !== store.code) {
            const existingStore = await Store.findOne({
                code: code.trim(),
                _id: { $ne: id },
            });

            if (existingStore) {
                return res.status(400).json({
                    success: false,
                    message: "Store code already exists",
                });
            }
        }

        // Check whether address or landmark changed
        const addressChanged =
            (address !== undefined && address.trim() !== store.address) ||
            (landmark !== undefined &&
                landmark.trim() !== store.landmark);

        let updatedLocation = store.location;

        // Geocode only when address or landmark changes
        if (addressChanged) {
            const newAddress =
                address !== undefined ? address.trim() : store.address;

            const newLandmark =
                landmark !== undefined ? landmark.trim() : store.landmark;

            const locationData = await geocodeAddress(
                newAddress,
                newLandmark
            );

            if (!locationData) {
                return res.status(400).json({
                    success: false,
                    message: "Unable to find location for this address",
                });
            }

            updatedLocation = {
                type: "Point",
                coordinates: [
                    locationData.longitude,
                    locationData.latitude,
                ],
            };
        }

        // Update Store
        store.name = name !== undefined ? name.trim() : store.name;
        store.code = code !== undefined ? code.trim() : store.code;
        store.manager = manager !== undefined ? manager : store.manager;
        store.phone = phone !== undefined ? phone.trim() : store.phone;
        store.address = address !== undefined ? address.trim() : store.address;
        store.landmark = landmark !== undefined
            ? landmark.trim()
            : store.landmark;

        store.serviceRadius = serviceRadius !== undefined
            ? Number(serviceRadius)
            : store.serviceRadius;

        store.status = status !== undefined ? status : store.status;
        store.location = updatedLocation;

        await store.save();

        res.status(200).json({
            success: true,
            message: "Store updated successfully",
            store,
        });

    } catch (error) {
        console.error("Update Store Error:", error);

        res.status(500).json({
            success: false,
            message: error.code === 11000
                ? "Store code already exists"
                : error.message,
        });
    }
};

module.exports = { updateStore };




module.exports={createStore,getStoreManagers,getStores,deleteStore,getNearestStore,updateStore}