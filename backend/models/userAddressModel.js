
const mongoose = require("mongoose");

const userAddressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: ["HOME", "WORK", "OTHER"],
            default: "HOME",
        },

        name: {
            type: String,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        houseNumber: {
            type: String,
            trim: true,
        },

        street: {
            type: String,
            trim: true,
        },

        landmark: {
            type: String,
            trim: true,
        },

        city: {
            type: String,
            trim: true,
        },

        state: {
            type: String,
            trim: true,
        },

        country: {
            type: String,
            default: "India",
            trim: true,
        },

        pincode: {
            type: String,
            trim: true,
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
                required: true,
            },

            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: function (coordinates) {
                        return (
                            coordinates.length === 2 &&
                            Number.isFinite(coordinates[0]) &&
                            Number.isFinite(coordinates[1]) &&
                            coordinates[0] >= -180 &&
                            coordinates[0] <= 180 &&
                            coordinates[1] >= -90 &&
                            coordinates[1] <= 90
                        );
                    },
                    message: "Invalid longitude or latitude coordinates",
                },
            },
        },

        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

userAddressSchema.index({ location: "2dsphere" });

const UserAddress = mongoose.model("UserAddress", userAddressSchema);

module.exports = UserAddress;
