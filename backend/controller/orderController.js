
const mongoose = require("mongoose");
const crypto = require("crypto");

const Order = require("../models/orderModal");
const OrderItem = require("../models/orderItemModal");
const Cart = require("../models/cartModal");
const CartItem = require("../models/cartItemModal");
const Address = require("../models/userAddressModel");
const Payment = require("../models/Payment");
const Delivery = require("../models/DeliveryModel");
const StoreInventory = require("../models/inventoryModel");



const calculateDeliveryFee = require("./utils/deliveryFee");


// --------------------------------------------------
// CALCULATE ORDER TOTALS
// --------------------------------------------------

const calculateOrderTotals = (cartItems) => {
    if (!Array.isArray(cartItems) || !cartItems.length) {
        throw new Error("Your cart is empty");
    }

    const subtotal = Number(
        cartItems.reduce((sum, item) => {
            const itemTotal = Number(item.totalPrice);

            if (!Number.isFinite(itemTotal) || itemTotal < 0) {
                throw new Error("Invalid cart item price");
            }

            return sum + itemTotal;
        }, 0).toFixed(2)
    );

    const deliveryFee = calculateDeliveryFee(subtotal);

    const totalAmount = Number(
        (subtotal + deliveryFee).toFixed(2)
    );

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
        throw new Error("Invalid order amount");
    }

    return {
        subtotal,
        discount: 0,
        deliveryFee,
        tax: 0,
        totalAmount,
        coupon: null,
    };
};


// --------------------------------------------------
// RESERVE AVAILABLE INVENTORY
// --------------------------------------------------

const reserveAvailableInventory = async (
    storeId,
    cartItems,
    session
) => {
    for (const item of cartItems) {
        const productId = item.product?._id || item.product;
        const variantId = item.variant?._id || item.variant;
        const orderQuantity = Number(item.quantity);

        if (!productId || !variantId) {
            throw new Error(
                "Product or variant information is missing from cart"
            );
        }

        if (!Number.isInteger(orderQuantity) || orderQuantity <= 0) {
            throw new Error("Invalid product quantity in cart");
        }

        const inventoryUpdate = await StoreInventory.updateOne(
            {
                store: storeId,
                product: productId,
                variant: variantId,
                status: "active",
                availableQuantity: {
                    $gte: orderQuantity,
                },
            },
            {
                $inc: {
                    availableQuantity: -orderQuantity,
                },
            },
            { session }
        );

        if (inventoryUpdate.modifiedCount !== 1) {
            throw new Error(
                `Insufficient available stock for ${
                    item.product?.name || "a product"
                }`
            );
        }
    }
};


// --------------------------------------------------
// CREATE ORDER DELIVERY
// --------------------------------------------------

const createOrderDelivery = async (
    order,
    address,
    session = null
) => {
    const deliveryOtp = crypto.randomInt(1000, 10000).toString();

    const coordinates = address.location?.coordinates;

    if (
        !Array.isArray(coordinates) ||
        coordinates.length !== 2 ||
        !coordinates.every(Number.isFinite)
    ) {
        throw new Error("Customer delivery location is invalid");
    }

    const deliveryAddress = [
        address.houseNumber,
        address.street,
        address.landmark,
        address.city,
        address.state,
        address.country,
        address.pincode,
    ]
        .filter(Boolean)
        .join(", ");

    const deliveryData = {
        order: order._id,
        deliveryPartner: null,
        store: order.store,
        deliveryOtp,
        deliveryAddress,
        customerLocation: {
            type: "Point",
            coordinates,
        },
        notes: "",
    };

    const [delivery] = await Delivery.create(
        [deliveryData],
        session ? { session } : {}
    );

    return delivery;
};


// --------------------------------------------------
// PLACE COD ORDER
// --------------------------------------------------

const placeOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const userId = req.user.id;
        const { addressId, paymentMethod, storeId } = req.body;

        console.log("ORDER REQUEST BODY:", req.body);

        if (!addressId || !paymentMethod || !storeId) {
            return res.status(400).json({
                success: false,
                message: "Address, payment method and store are required",
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(addressId) ||
            !mongoose.Types.ObjectId.isValid(storeId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid addressId or storeId",
            });
        }

        const selectedPaymentMethod = paymentMethod.toLowerCase();

        if (selectedPaymentMethod !== "cod") {
            return res.status(400).json({
                success: false,
                message: "Currently only COD payment is supported",
            });
        }

        session.startTransaction();

        const address = await Address.findOne({
            _id: addressId,
            user: userId,
        }).session(session);

        if (!address) {
            throw new Error("Address not found");
        }

        const cart = await Cart.findOne({
            user: userId,
            store: storeId,
        }).session(session);

        if (!cart) {
            throw new Error("Cart not found for selected store");
        }

        const cartItems = await CartItem.find({
            cart: cart._id,
        })
            .populate("product")
            .populate("variant")
            .session(session);

        if (!cartItems.length) {
            throw new Error("Your cart is empty");
        }

        let subtotal = 0;
        const orderItemsData = [];

        for (const item of cartItems) {
            const variant = item.variant;

            if (!variant) {
                throw new Error("Product variant not found");
            }

            const quantity = item.quantity;
            const price = variant.sellingPrice;

            if (price == null || quantity <= 0) {
                throw new Error("Invalid product price or quantity");
            }

            const itemTotal = price * quantity;
            subtotal += itemTotal;

            orderItemsData.push({
                product: item.product._id,
                variant: variant._id,
                quantity,
                price,
                total: itemTotal,
            });

            const inventory = await StoreInventory.findOne({
                store: storeId,
                product: item.product._id,
                variant: variant._id,
            }).session(session);

            if (!inventory) {
                throw new Error(
                    `${item.product.name} is not available in this store`
                );
            }

            if (inventory.stock < quantity) {
                throw new Error(
                    `Insufficient stock for ${item.product.name}`
                );
            }

            inventory.stock -= quantity;
            await inventory.save({ session });
        }

        const deliveryFee = await calculateDeliveryFee(address, subtotal);
        const totalAmount = subtotal + deliveryFee;

        const [createdOrder] = await Order.create(
            [
                {
                    user: userId,
                    store: storeId,
                    address: addressId,
                    subtotal,
                    deliveryFee,
                    totalAmount,
                    paymentMethod: selectedPaymentMethod,
                    paymentStatus: "PENDING",
                    orderStatus: "PLACED",
                },
            ],
            { session }
        );

        const orderItems = orderItemsData.map((item) => ({
            ...item,
            order: createdOrder._id,
        }));

        await OrderItem.insertMany(orderItems, { session });

        await Payment.create(
            [
                {
                    order: createdOrder._id,
                    user: userId,
                    paymentGateway: "cod",
                    paymentMethod: "COD",
                    amount: totalAmount,
                    status: "PENDING",
                },
            ],
            { session }
        );

        const otp = crypto.randomInt(100000, 1000000).toString();

        await Delivery.create(
            [
                {
                    order: createdOrder._id,
                    user: userId,
                    otp,
                    status: "PENDING",
                },
            ],
            { session }
        );

        await CartItem.deleteMany(
            { cart: cart._id },
            { session }
        );

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: createdOrder,
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.log("PLACE ORDER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Unable to place order",
        });

    } finally {
        session.endSession();
    }
};


// --------------------------------------------------
// GET ALL ORDERS (ADMIN)
// --------------------------------------------------

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


// --------------------------------------------------
// GET MY ORDERS (CUSTOMER)
// --------------------------------------------------

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

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

        const orderIds = orders.map((order) => order._id);

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
