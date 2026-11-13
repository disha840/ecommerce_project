const mongoose = require("mongoose");
const Cart=require("../models/cartModal");
const CartItem=require("../models/cartItemModal") 
const ProductVariant=require("../models/productVariant")
const addToCart = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { product, variant, quantity = 1 } = req.body;

        const userId = req.user.id;

        // Validate store ID
        if (!mongoose.isValidObjectId(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid store ID"
            });
        }

        // Validate product and variant
        if (!product || !variant) {
            return res.status(400).json({
                success: false,
                message: "Product and variant are required"
            });
        }

        if (
            !mongoose.isValidObjectId(product) ||
            !mongoose.isValidObjectId(variant)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid product or variant ID"
            });
        }

        // Validate quantity
        const productQuantity = Number(quantity);

        if (
            !Number.isSafeInteger(productQuantity) ||
            productQuantity < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            });
        }

        // Find active product variant
        const productVariant = await ProductVariant.findOne({
            _id: variant,
            product: product,
            status: "ACTIVE"
        });

        if (!productVariant) {
            return res.status(404).json({
                success: false,
                message: "Active product variant not found"
            });
        }

        // Get price from database
        const price = Number(productVariant.sellingPrice);

        if (!Number.isFinite(price) || price < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid product price"
            });
        }

        // Find user's cart for this store
        let cart = await Cart.findOne({
            user: userId,
            store: storeId
        });

        // Create cart if it does not exist
        if (!cart) {
            cart = await Cart.create({
                user: userId,
                store: storeId,
                subtotal: 0,
                discount: 0,
                deliveryFee: 0,
                tax: 0,
                totalAmount: 0
            });
        }

        // Check whether item already exists
        let cartItem = await CartItem.findOne({
            cart: cart._id,
            product: product,
            variant: variant
        });

        if (cartItem) {
            cartItem.quantity += productQuantity;
            cartItem.price = price;
            cartItem.totalPrice = cartItem.quantity * price;

            await cartItem.save();

        } else {
            await CartItem.create({
                cart: cart._id,
                product: product,
                variant: variant,
                quantity: productQuantity,
                price: price,
                totalPrice: productQuantity * price
            });
        }

        // Calculate cart subtotal
        const cartItems = await CartItem.find({
            cart: cart._id
        });

        const subtotal = cartItems.reduce(
            (total, item) => total + item.totalPrice,
            0
        );

        cart.subtotal = subtotal;

        cart.totalAmount =
            subtotal -
            cart.discount +
            cart.deliveryFee +
            cart.tax;

        await cart.save();

        // Get updated cart items
        const updatedItems = await CartItem.find({
            cart: cart._id
        })
            .populate("product")
            .populate("variant");

        return res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: cart,
            items: updatedItems
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { storeId } = req.params;

        if (!mongoose.isValidObjectId(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid store ID"
            });
        }

        // Find user's cart for selected store
        const cart = await Cart.findOne({
            user: userId,
            store: storeId
        });

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Cart is empty",
                cart: null,
                items: []
            });
        }

        const items = await CartItem.find({
            cart: cart._id
        })
            .populate("product")
            .populate("variant");

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart,
            items
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { quantity, storeId } = req.body;
        const cartItemId = req.params.id;

        // Store ID validation
        if (!storeId) {
            return res.status(400).json({
                success: false,
                message: "Store ID is required"
            });
        }

        // Quantity validation
        if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        // User aur store ka cart find karo
        const cart = await Cart.findOne({
            user: userId,
            store: storeId
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Cart item find karo
        const cartItem = await CartItem.findOne({
            _id: cartItemId,
            cart: cart._id
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        // Quantity update karo
        cartItem.quantity = Number(quantity);
        cartItem.totalPrice = cartItem.price * cartItem.quantity;

        await cartItem.save();

        // Saare cart items fetch karo
        const items = await CartItem.find({
            cart: cart._id
        });

        // Subtotal calculate karo
        let subtotal = 0;

        items.forEach((item) => {
            subtotal = subtotal + item.totalPrice;
        });

        // Cart total update karo
        cart.subtotal = subtotal;

        cart.totalAmount =
            subtotal -
            cart.discount +
            cart.deliveryFee +
            cart.tax;

        await cart.save();

        // Updated items fetch karo
        const updatedItems = await CartItem.find({
            cart: cart._id
        })
            .populate("product")
            .populate("variant");

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
            cart,
            items: updatedItems
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { storeId } = req.body;
        const cartItemId = req.params.id;

        // Store ID validation
        if (!storeId) {
            return res.status(400).json({
                success: false,
                message: "Store ID is required"
            });
        }

        // User aur store ka cart find karo
        const cart = await Cart.findOne({
            user: userId,
            store: storeId
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Cart item find karo
        const cartItem = await CartItem.findOne({
            _id: cartItemId,
            cart: cart._id
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        // Cart item delete karo
        await CartItem.findByIdAndDelete(cartItemId);

        // Remaining items fetch karo
        const items = await CartItem.find({
            cart: cart._id
        });

        // Subtotal calculate karo
        let subtotal = 0;

        items.forEach((item) => {
            subtotal = subtotal + item.totalPrice;
        });

        // Cart total update karo
        cart.subtotal = subtotal;

        cart.totalAmount =
            subtotal -
            cart.discount +
            cart.deliveryFee +
            cart.tax;

        await cart.save();

        // Updated items fetch karo
        const updatedItems = await CartItem.find({
            cart: cart._id
        })
            .populate("product")
            .populate("variant");

        return res.status(200).json({
            success: true,
            message: "Item removed successfully",
            cart,
            items: updatedItems
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports={addToCart,getCart,updateCartQuantity,removeCartItem}
