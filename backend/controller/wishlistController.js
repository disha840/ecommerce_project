const Wishlist = require("../models/wishlistModal");
const WishlistItem = require("../models/wishlistItemModal");
const Inventory = require("../models/inventoryModel");
const user=require("../models/userModel")

// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
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

const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { storeId } = req.query;

        if (!storeId) {
            return res.status(400).json({
                success: false,
                message: "Store ID is required",
            });
        }

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(200).json({
                success: true,
                message: "Wishlist is empty",
                data: [],
            });
        }

        const wishlistItems = await WishlistItem.find({
            wishlist: wishlist._id,
        })
            .populate("product")
            .populate("variant");

        const updatedWishlist = await Promise.all(
            wishlistItems.map(async (item) => {

                if (!item.variant) {
                    return {
                        ...item.toObject(),
                        isAvailable: false,
                        availableQuantity: 0,
                    };
                }

                const inventory = await Inventory.findOne({
                    store: storeId,
                    variant: item.variant._id,
                    status: "active",
                });

                return {
                    ...item.toObject(),

                    isAvailable: inventory
                        ? inventory.availableQuantity > 0
                        : false,

                    availableQuantity: inventory
                        ? inventory.availableQuantity
                        : 0,
                };
            })
        );

        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            data: updatedWishlist,
        });

    } catch (error) {
        console.log("Get Wishlist Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = { addToWishlist,getWishlist };