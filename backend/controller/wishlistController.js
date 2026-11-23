const Wishlist = require("../models/wishlistModal");
const WishlistItem = require("../models/wishlistItemModal");

// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { product, variant } = req.body;

        if (!product || !variant) {
            return res.status(400).json({
                success: false,
                message: "Product and variant are required"
            });
        }

        // FIND USER WISHLIST
        let wishlist = await Wishlist.findOne({ user: userId });

        // CREATE WISHLIST IF NOT EXISTS
        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: userId
            });
        }

        // CHECK DUPLICATE ITEM
        const existingItem = await WishlistItem.findOne({
            wishlist: wishlist._id,
            product,
            variant
        });

        if (existingItem) {
            return res.status(400).json({
                success: false,
                message: "Product already exists in wishlist"
            });
        }

        // ADD ITEM
        const wishlistItem = await WishlistItem.create({
            wishlist: wishlist._id,
            product,
            variant
        });

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist successfully",
            data: wishlistItem
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { addToWishlist };