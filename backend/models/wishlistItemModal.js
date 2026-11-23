const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema(
    {
        wishlist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wishlist",
            required: true
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductVariant",
            required: true
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

wishlistItemSchema.index(
    { wishlist: 1, product: 1, variant: 1 },
    { unique: true }
);

module.exports = mongoose.model("Wishlist_items", wishlistItemSchema);