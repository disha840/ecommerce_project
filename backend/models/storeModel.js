
const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        landmark: {
            type: String,
            trim: true,
            default: "",
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
                default: "Point",
            },

            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: function (coordinates) {
                        return (
                            coordinates.length === 2 &&
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

        serviceRadius: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE",
        },
    },
    { timestamps: true }
);

// GEO NEAR INDEX
storeSchema.index({ location: "2dsphere" });

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
