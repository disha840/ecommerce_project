const mongoose = require("mongoose");

const Order = require("../models/orderModal");
const OrderItem = require("../models/orderItemModal");
const Cart = require("../models/cartModal");
const CartItem = require("../models/cartItemModal");
const Address = require("../models/userAddressModel");


// PLACE ORDER
const placeOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const userId = req.user.id;
        const { addressId, paymentMethod } = req.body;

        if (!addressId || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Address and payment method are required",
            });
        }

        const selectedPaymentMethod = paymentMethod.toUpperCase();

        if (!["COD", "ONLINE"].includes(selectedPaymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method",
            });
        }

        let createdOrder;

        await session.withTransaction(async () => {

            // Find user's cart
            const cart = await Cart.findOne({
                user: userId,
            }).session(session);

            if (!cart) {
                throw new Error("Cart not found");
            }

            // Find cart items
            const cartItems = await CartItem.find({
                cart: cart._id,
            })
                .populate("product")
                .populate("variant")
                .session(session);

            if (cartItems.length === 0) {
                throw new Error("Your cart is empty");
            }

            // Verify address
            const address = await Address.findOne({
                _id: addressId,
                user: userId,
            }).session(session);

            if (!address) {
                throw new Error("Address not found");
            }

            // Calculate subtotal
            let subtotal = 0;
            const orderItemsData = [];

            for (const item of cartItems) {

                if (!item.product || !item.variant) {
                    throw new Error("Product or variant not found");
                }

                const price = item.variant.sellingPrice;
                const quantity = item.quantity;

                if (price === undefined || price < 0) {
                    throw new Error("Invalid product price");
                }

                const totalPrice = price * quantity;
                subtotal += totalPrice;

                orderItemsData.push({
                    product: item.product._id,
                    variant: item.variant._id,
                    productName: item.product.name,
                    variantName: item.variant.name,
                    sku: item.variant.sku,
                    quantity,
                    price,
                    discount: 0,
                    tax: 0,
                    totalPrice,
                });
            }

            // Calculate total amount
            const discount = cart.discount || 0;
            const deliveryFee = cart.deliveryFee || 0;
            const tax = cart.tax || 0;

            const totalAmount =
                subtotal - discount + deliveryFee + tax;

            if (totalAmount < 0) {
                throw new Error("Invalid order amount");
            }

            // Create order
            const order = await Order.create(
                [
                    {
                        orderNumber: `ORD-${Date.now()}`,
                        user: userId,
                        store: null,
                        address: address._id,
                        subtotal,
                        discount,
                        deliveryFee,
                        tax,
                        totalAmount,
                        coupon: cart.coupon || null,
                        paymentMethod: selectedPaymentMethod,
                        paymentStatus: "Pending",
                        orderStatus: "Placed",
                    },
                ],
                { session }
            );

            createdOrder = order[0];

            // Create order items
            const finalOrderItems = orderItemsData.map((item) => ({
                ...item,
                order: createdOrder._id,
            }));

            await OrderItem.insertMany(finalOrderItems, {
                session,
            });

            // Empty cart items after order placement
            await CartItem.deleteMany({
                cart: cart._id,
            }).session(session);

            // Reset cart amounts
            cart.subtotal = 0;
            cart.discount = 0;
            cart.deliveryFee = 0;
            cart.tax = 0;
            cart.totalAmount = 0;
            cart.coupon = null;

            await cart.save({ session });
        });

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: createdOrder,
        });

    } catch (error) {
        console.log("Place Order Error:", error);

        return res.status(400).json({
            success: false,
            message: error.message || "Failed to place order",
        });

    } finally {
        await session.endSession();
    }
};


// GET ALL ORDERS (ADMIN)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "firstName lastName email phone")
            .populate("store", "name")
            .populate({
                path: "address",
                model: "UserAddress",
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders,
        });

    } catch (error) {
        console.log("Get all orders error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
};


// GET MY ORDERS (CUSTOMER)
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch logged-in user's orders
        const orders = await Order.find({
            user: userId,
        })
            .populate({
                path: "address",
                model: "UserAddress",
            })
            .sort({ createdAt: -1 })
            .lean();

        if (!orders.length) {
            return res.status(200).json({
                success: true,
                message: "No orders found",
                orders: [],
            });
        }

        // Get all order IDs
        const orderIds = orders.map((order) => order._id);

        // Fetch all order items
        const orderItems = await OrderItem.find({
            order: { $in: orderIds },
        })
            .populate({
                path: "product",
                select: "name image",
            })
            .populate({
                path: "variant",
                select: "name variantName sku",
            })
            .lean();

        // Group order items
        const itemsMap = {};

        orderItems.forEach((item) => {
            const orderId = item.order.toString();

            if (!itemsMap[orderId]) {
                itemsMap[orderId] = [];
            }

            itemsMap[orderId].push({
                ...item,

                productName:
                    item.productName ||
                    item.product?.name ||
                    "Product",

                variantName:
                    item.variantName ||
                    item.variant?.variantName ||
                    item.variant?.name ||
                    "",

                sku:
                    item.sku ||
                    item.variant?.sku ||
                    "",
            });
        });

        // Attach items to orders
        const formattedOrders = orders.map((order) => ({
            ...order,
            items: itemsMap[order._id.toString()] || [],
        }));

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders: formattedOrders,
        });

    } catch (error) {
        console.error("Get My Orders Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching orders",
        });
    }
};


module.exports = {
    placeOrder,
    getAllOrders,
    getMyOrders,
};