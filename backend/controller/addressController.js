const mongoose = require("mongoose");
const Address=require("../models/userAddressModel")
const addAddress = async (req, res) => {
    try {
        const {
            type,
            houseNumber,
            street,
            landmark,
            city,
            state,
            country,
            pincode,
            location,
            longitude,
            latitude,
            isDefault,
        } = req.body;

        // Required field validation
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

        // Check existing addresses
        const existingAddress = await Address.findOne({ user: userId });

        // Prepare location
        const coordinates = location?.coordinates || [
            Number(longitude) || 0,
            Number(latitude) || 0,
        ];

        // If new address is default, remove default from previous addresses
        if (isDefault || !existingAddress) {
            await Address.updateMany(
                { user: userId },
                { $set: { isDefault: false } }
            );
        }

        const address = await Address.create({
            user: userId,
            type,
            houseNumber,
            street,
            landmark,
            city,
            state,
            country,
            pincode,
            location: {
                type: "Point",
                coordinates,
            },
            isDefault: isDefault || !existingAddress,
        });

        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            address,
        });

    } catch (error) {
        // return handleResponseError(error, res);
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