const User = require("../models/userModel");
const Role = require("../models/roleModel");
const DeliveryPartner=require("../models/DeliveryPartner")
const mongoose=require("mongoose")
const addDeliveryPartner = async (req, res) => {
    try {
        const {
            user,
            vehicleType,
            vehicleNumber,
            drivingLicenseNumber,
        } = req.body;

        // VALIDATION
        if (!user || !vehicleType || !vehicleNumber || !drivingLicenseNumber) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        // CHECK USER
        const existingUser = await User.findById(user);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // CHECK DUPLICATE PARTNER
        const existingPartner = await DeliveryPartner.findOne({ user });

        if (existingPartner) {
            return res.status(409).json({
                success: false,
                message: "This user is already registered as a delivery partner",
            });
        }

        // CHECK VEHICLE NUMBER
        const formattedVehicleNumber = vehicleNumber.trim().toUpperCase();

        const existingVehicle = await DeliveryPartner.findOne({
            vehicleNumber: formattedVehicleNumber,
        });

        if (existingVehicle) {
            return res.status(409).json({
                success: false,
                message: "Vehicle number is already registered",
            });
        }

        // CHECK LICENSE NUMBER
        const formattedLicenseNumber = drivingLicenseNumber.trim().toUpperCase();

        const existingLicense = await DeliveryPartner.findOne({
            drivingLicenseNumber: formattedLicenseNumber,
        });

        if (existingLicense) {
            return res.status(409).json({
                success: false,
                message: "Driving license number is already registered",
            });
        }

        // CREATE DELIVERY PARTNER
        const deliveryPartner = await DeliveryPartner.create({
            user,
            vehicleType,
            vehicleNumber: formattedVehicleNumber,
            drivingLicenseNumber: formattedLicenseNumber,
        });

        // POPULATE USER DETAILS
        const populatedPartner = await DeliveryPartner.findById(
            deliveryPartner._id
        ).populate("user", "firstName lastName email phone");

        return res.status(201).json({
            success: true,
            message: "Delivery partner added successfully",
            deliveryPartner: populatedPartner,
        });

    } catch (error) {
        console.error("Add Delivery Partner Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to add delivery partner",
        });
    }
};

const getAllDeliveryPartnerUsers = async (req, res) => {
    try {
        const role = await Role.findOne({ name: "delivery_partner" });

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Delivery partner role not found",
            });
        }

        const users = await User.find({
            role: role._id,
        })
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: users.length,
            users,
        });

    } catch (error) {
        console.log("Get Delivery Partner Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch delivery partner users",
        });
    }
};


const getAllDeliveryPartners = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const search = req.query.search?.trim() || "";
        const status = req.query.status || "";

        const skip = (page - 1) * limit;

        const query = {};

        // STATUS FILTER
        if (status && ["active", "inactive", "blocked"].includes(status)) {
            query.status = status;
        }

        // SEARCH
        if (search) {
            const regex = new RegExp(
                search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "i"
            );

            const matchingUsers = await User.find({
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                    { email: regex },
                    { phone: regex },
                ],
            }).select("_id");

            const userIds = matchingUsers.map((item) => item._id);

            query.$or = [
                { vehicleType: regex },
                { vehicleNumber: regex },
                { drivingLicenseNumber: regex },
                { user: { $in: userIds } },
            ];
        }

        // GET DELIVERY PARTNERS
        const [
            deliveryPartners,
            totalPartners,
            activePartners,
            inactivePartners,
            blockedPartners,
            onlinePartners,
            availablePartners,
            filteredTotal,
        ] = await Promise.all([
            DeliveryPartner.find(query)
                .populate("user", "firstName lastName email phone")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            DeliveryPartner.countDocuments(),

            DeliveryPartner.countDocuments({ status: "active" }),

            DeliveryPartner.countDocuments({ status: "inactive" }),

            DeliveryPartner.countDocuments({ status: "blocked" }),

            DeliveryPartner.countDocuments({
                status: "active",
                isOnline: true,
            }),

            DeliveryPartner.countDocuments({
                status: "active",
                isOnline: true,
                isAvailable: true,
            }),

            DeliveryPartner.countDocuments(query),
        ]);

        return res.status(200).json({
            success: true,
            message: "Delivery partners fetched successfully",

            deliveryPartners,

            totalPartners,
            activePartners,
            inactivePartners,
            blockedPartners,
            onlinePartners,
            availablePartners,

            filteredTotal,
            currentPage: page,
            totalPages: Math.ceil(filteredTotal / limit),
            limit,
        });

    } catch (error) {
        console.error("Get Delivery Partners Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch delivery partners",
        });
    }
};

const getMyDeliveryPartnerProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const deliveryPartner = await DeliveryPartner.findOne({
            user: userId
        }).populate("user", "firstName lastName email phone");

        if (!deliveryPartner) {
            return res.status(404).json({
                success: false,
                message: "Delivery partner profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            deliveryPartner,
        });

    } catch (error) {
        console.error("Get My Delivery Partner Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch delivery partner profile",
        });
    }
};
const getAvailableDeliveryPartners = async (req, res) => {

    try {
        const deliveryPartners = await DeliveryPartner.find({
            status: "active",
            isOnline: true,
            isAvailable: true,
        })
            .populate("user", "firstName lastName email phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Available delivery partners fetched successfully",
            total: deliveryPartners.length,
            deliveryPartners,
        });

    } catch (error) {
        console.error("Get Available Delivery Partners Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch delivery partners",
        });
    }
};
const toggleDeliveryPartnerStatus = async (req, res) => {
    try {
        const deliveryPartner = await DeliveryPartner.findOne({
            user: req.user.id
        });

        if (!deliveryPartner) {
            return res.status(404).json({
                success: false,
                message: "Delivery partner not found"
            });
        }

        if (deliveryPartner.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Your account is not active"
            });
        }

        deliveryPartner.isOnline = !deliveryPartner.isOnline;

        if (!deliveryPartner.isOnline) {
            deliveryPartner.isAvailable = false;
        } else {
            deliveryPartner.isAvailable = true;
        }

        await deliveryPartner.save();

        return res.status(200).json({
            success: true,
            message: deliveryPartner.isOnline
                ? "You are now online"
                : "You are now offline",
            isOnline: deliveryPartner.isOnline,
            isAvailable: deliveryPartner.isAvailable
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateDeliveryPartnerLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
         console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required"
            });
        }

        if (
            !Number.isFinite(Number(latitude)) ||
            !Number.isFinite(Number(longitude)) ||
            Number(latitude) < -90 ||
            Number(latitude) > 90 ||
            Number(longitude) < -180 ||
            Number(longitude) > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid latitude or longitude"
            });
        }

        const deliveryPartner = await DeliveryPartner.findOne({
            user: req.user.id
        });

        if (!deliveryPartner) {
            return res.status(404).json({
                success: false,
                message: "Delivery partner not found"
            });
        }

        deliveryPartner.currentLocation = {
            type: "Point",
            coordinates: [
                Number(longitude),
                Number(latitude)
            ]
        };

        await deliveryPartner.save();

        return res.status(200).json({
            success: true,
            message: "Location updated successfully",
            currentLocation: deliveryPartner.currentLocation
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



module.exports={addDeliveryPartner,getAllDeliveryPartnerUsers,getAllDeliveryPartners,getMyDeliveryPartnerProfile,getAvailableDeliveryPartners,toggleDeliveryPartnerStatus,updateDeliveryPartnerLocation}