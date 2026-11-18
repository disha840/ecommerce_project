
const mongoose = require("mongoose");
const crypto = require("crypto");
// const DeliveryPartner=require("../models/DeliveryPartner")
const Order = require("../models/orderModal");
const OrderItem = require("../models/orderItemModal");
const Cart = require("../models/cartModal");
const CartItem = require("../models/cartItemModal");
const Address = require("../models/userAddressModel");
const Payment = require("../models/Payment");
const Delivery = require("../models/DeliveryModel");
const StoreInventory = require("../models/inventoryModel");
const Store=require("../models/storeModel")
const DeliveryPartner = require("../models/DeliveryPartner");
const DeliveryPayout = require("../models/DeliveryPayout");
const calculateDeliveryEarning=require("./utils/deliveryEarning")
const calculateRoadDistance=require("./utils/routeDistance")


const calculateDeliveryFee = require("./utils/deliveryFee");

const rozarpay =  require("../database/rasorpay")


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

    if (!deliveryAddress) {
        throw new Error("Delivery address is required");
    }

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
        deliveryStatus: "assigned",
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

        const selectedPaymentMethod = paymentMethod.toUpperCase();

        if (selectedPaymentMethod !== "COD") {
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

        console.log("SELECTED ADDRESS:", address);
        console.log("ADDRESS LOCATION:", address?.location);
        console.log("ADDRESS COORDINATES:", address?.location?.coordinates);

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
            const product = item.product;

            if (!variant || !product) {
                throw new Error("Product or variant not found");
            }

            const quantity = Number(item.quantity);
            const price = Number(variant.sellingPrice);

            if (
                !Number.isInteger(quantity) ||
                quantity <= 0 ||
                !Number.isFinite(price) ||
                price <= 0
            ) {
                throw new Error("Invalid product price or quantity");
            }

            const itemTotal = Number(
                (price * quantity).toFixed(2)
            );

            subtotal += itemTotal;

            orderItemsData.push({
                product: product._id,
                variant: variant._id,
                productName: product.name,
                variantName: variant.name,
                sku: variant.sku,
                quantity,
                price,
                totalPrice: itemTotal,
            });

            // Check and decrease available inventory
            const inventory = await StoreInventory.findOne({
                store: storeId,
                product: product._id,
                variant: variant._id,
                status: "active",
                availableQuantity: {
                    $gte: quantity,
                },
            }).session(session);

            if (!inventory) {
                throw new Error(
                    `${product.name} is not available in this store or stock is insufficient`
                );
            }

            inventory.availableQuantity -= quantity;

            await inventory.save({ session });
        }

        subtotal = Number(subtotal.toFixed(2));

        const deliveryFee = calculateDeliveryFee(subtotal);

        const totalAmount = Number(
            (subtotal + deliveryFee).toFixed(2)
        );

        const orderNumber = `ORD-${Date.now()}-${Math.floor(
            1000 + Math.random() * 9000
        )}`;

        // Create order
        const [createdOrder] = await Order.create(
            [
                {
                    orderNumber,
                    user: userId,
                    store: storeId,
                    address: addressId,
                    subtotal,
                    discount: 0,
                    deliveryFee,
                    tax: 0,
                    totalAmount,
                    paymentMethod: "COD",
                    paymentStatus: "Pending",
                    orderStatus: "Placed",
                },
            ],
            { session }
        );

        // Create order items
        const orderItems = orderItemsData.map((item) => ({
            ...item,
            order: createdOrder._id,
        }));

        await OrderItem.insertMany(orderItems, { session });

        // Create COD payment record
        await Payment.create(
            [
                {
                    order: createdOrder._id,
                    user: userId,
                    paymentGateway: "cod",
                    paymentMethod: "COD",
                    amount: totalAmount,
                    currency: "INR",
                    status: "pending",
                },
            ],
            { session }
        );

        // Create delivery record and get OTP
        const delivery = await createOrderDelivery(
            createdOrder,
            address,
            session
        );

        // Clear selected store cart items
        await CartItem.deleteMany(
            { cart: cart._id },
            { session }
        );

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: createdOrder,
            deliveryOtp: delivery.deliveryOtp,
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
        await session.endSession();
    }
};



// --------------------------------------------------
// GET ALL ORDERS (ADMIN)
// --------------------------------------------------


const getAllOrders = async (req, res) => {
    try {
        let filter = {};
        let revenueSummary = null;

        // Store manager ko sirf apne store ke orders dikhaye jayenge
        if (req.user.role === "store_manager") {
            const assignedStores = await Store.find({
                manager: req.user.id
            }).distinct("_id");

            filter.store = { $in: assignedStores };
        }

        // Delivery partner ke assigned orders aur earnings
        if (req.user.role === "delivery_partner") {
            const deliveryPartner = await DeliveryPartner.findOne({
                user: req.user.id
            }).select("_id");

            if (!deliveryPartner) {
                return res.status(200).json({
                    success: true,
                    message: "No delivery partner found",
                    orders: [],
                    totalOrders: 0,
                    revenueSummary: {
                        totalEarnings: 0,
                        payableAmount: 0,
                        paidAmount: 0,
                        pendingAmount: 0,
                        completedDeliveries: 0,
                    },
                });
            }

            filter.deliveryPartner = deliveryPartner._id;

            // Get delivery partner payout summary
            const payouts = await DeliveryPayout.find({
                deliveryPartner: deliveryPartner._id,
            }).lean();

            const revenue = payouts.reduce(
                (summary, payout) => {
                    const earning = Number(payout.totalEarning) || 0;

                    if (payout.payoutStatus === "paid") {
                        summary.paidAmount += earning;
                        summary.totalEarnings += earning;
                        summary.completedDeliveries += 1;
                    } else if (payout.payoutStatus === "pending") {
                        summary.pendingAmount += earning;
                        summary.payableAmount += earning;
                    }

                    return summary;
                },
                {
                    totalEarnings: 0,
                    payableAmount: 0,
                    paidAmount: 0,
                    pendingAmount: 0,
                    completedDeliveries: 0,
                }
            );

            revenueSummary = {
                totalEarnings: Number(revenue.totalEarnings.toFixed(2)),
                payableAmount: Number(revenue.payableAmount.toFixed(2)),
                paidAmount: Number(revenue.paidAmount.toFixed(2)),
                pendingAmount: Number(revenue.pendingAmount.toFixed(2)),
                completedDeliveries: revenue.completedDeliveries,
            };
        }

        const orders = await Order.find(filter)
            .populate("user", "firstName lastName email phone")
            .populate("store", "name")
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
                totalOrders: 0,
                ...(revenueSummary && { revenueSummary }),
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
            totalOrders: formattedOrders.length,
            orders: formattedOrders,
            ...(revenueSummary && { revenueSummary }),
        });

    } catch (error) {
        console.log("Get all orders error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch orders",
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
            .populate("store", "name")
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

        // Fetch delivery OTPs
        const deliveries = await Delivery.find({
            order: { $in: orderIds },
        })
            .select("+deliveryOtp order")
            .lean();

        const deliveryOtpMap = {};

        deliveries.forEach((delivery) => {
            deliveryOtpMap[delivery.order.toString()] =
                delivery.deliveryOtp;
        });

        // Fetch order items
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
            deliveryOtp:
                order.orderStatus === "Delivered"
                    ? null
                    : deliveryOtpMap[order._id.toString()] || null,
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
            message: error.message ||
                "Something went wrong while fetching orders",
        });
    }
};


const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await rozarpay.orders.create(options);
    if (!order) return res.status(500).send('Some error occurred.');

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 2. Verify Payment Route





// --------------------------------------------------
// EXPORT CONTROLLERS
// --------------------------------------------------








// const assignDeliveryPartner = async (req, res) => {
//     let reservedPartner = null;
//     let assignmentCompleted = false;

//     try {
//         const { orderId, deliveryPartnerId } = req.body;

//         // Validate IDs
//         if (
//             !mongoose.Types.ObjectId.isValid(orderId) ||
//             !mongoose.Types.ObjectId.isValid(deliveryPartnerId)
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid order or delivery partner ID",
//             });
//         }

//         // Find order
//         const order = await Order.findById(orderId);

//         if (!order) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Order not found",
//             });
//         }

//         if (
//             ["Delivered", "Cancelled"].includes(order.orderStatus)
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Cannot assign delivery partner to this order",
//             });
//         }

//         // Find delivery record
//         const delivery = await Delivery.findOne({
//             order: orderId,
//         });

//         if (!delivery) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Delivery record not found",
//             });
//         }

//         // Find store
//         const store = await Store.findById(order.store);

//         if (!store) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Store not found",
//             });
//         }

//         // Check existing payout
//         const existingPayout = await DeliveryPayout.findOne({
//             order: orderId,
//         });

//         if (
//             existingPayout &&
//             existingPayout.payoutStatus !== "pending"
//         ) {
//             return res.status(409).json({
//                 success: false,
//                 message: "Delivery payout is already processed",
//             });
//         }

//         // Find selected delivery partner
//         const selectedPartner = await DeliveryPartner.findById(
//             deliveryPartnerId
//         ).populate("user", "firstName lastName email phone");

//         if (!selectedPartner || !selectedPartner.user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Delivery partner not found",
//             });
//         }

//         // Check if already assigned
//         if (
//             order.deliveryPartner &&
//             order.deliveryPartner.toString() ===
//             deliveryPartnerId.toString()
//         ) {
//             return res.status(200).json({
//                 success: true,
//                 message: "This delivery partner is already assigned",
//             });
//         }

//         // Reserve partner
//         reservedPartner = await DeliveryPartner.findOneAndUpdate(
//             {
//                 _id: deliveryPartnerId,
//                 status: "active",
//                 isOnline: true,
//                 isAvailable: true,
//             },
//             {
//                 $set: {
//                     isAvailable: false,
//                 },
//             },
//             {
//                 new: true,
//             }
//         ).populate("user", "firstName lastName email phone");

//         if (!reservedPartner) {
//             return res.status(409).json({
//                 success: false,
//                 message: "Delivery partner is not available",
//             });
//         }


//         console.log( "storelocation",store.location)
//         console.log("custormerlocation",delivery.customerLocation)

//         // Calculate delivery distance
//         const route = await calculateRoadDistance(
//             store.location,
//             delivery.customerLocation
//         );

//         // Calculate delivery earning
//         const earning = calculateDeliveryEarning(
//             route.distanceMeters / 1000
//         );

//         const totalEarning = Number(earning.totalEarning);

//         if (
//             !Number.isFinite(totalEarning) ||
//             !Number.isFinite(route.distanceMeters)
//         ) {
//             throw new Error("Invalid delivery earning calculation");
//         }

//         // Save previous partner ID
//         const previousPartnerId = order.deliveryPartner;

//         // Assign partner to order
//         order.deliveryPartner = reservedPartner._id;
//         await order.save();

//         // Assign partner to delivery
//         delivery.deliveryPartner = reservedPartner._id;
//         await delivery.save();

//         // Create or update payout
//         const payout = await DeliveryPayout.findOneAndUpdate(
//             {
//                 order: order._id,
//             },
//             {
//                 $set: {
//                     order: order._id,
//                     delivery: delivery._id,
//                     deliveryPartner: reservedPartner._id,
//                     store: store._id,

//                     distanceMeters: route.distanceMeters,
//                     distanceKm: route.distanceKm,
//                     durationSeconds: route.durationSeconds,

//                     baseEarning: totalEarning,
//                     extraKm: 0,
//                     extraKmRate: 0,
//                     extraDistanceEarning: 0,
//                     incentive: 0,
//                     deduction: 0,
//                     totalEarning,

//                     payoutStatus: "pending",
//                 },
//             },
//             {
//                 new: true,
//                 upsert: true,
//                 runValidators: true,
//                 setDefaultsOnInsert: true,
//             }
//         );

//         // Release previous partner
//         if (
//             previousPartnerId &&
//             previousPartnerId.toString() !==
//             reservedPartner._id.toString()
//         ) {
//             await DeliveryPartner.updateOne(
//                 {
//                     _id: previousPartnerId,
//                 },
//                 {
//                     $set: {
//                         isAvailable: true,
//                     },
//                 }
//             );
//         }

//         assignmentCompleted = true;

//         // Get updated order
//         const updatedOrder = await Order.findById(orderId)
//             .populate("user", "firstName lastName email phone")
//             .populate("address")
//             .populate("store", "name code")
//             .populate({
//                 path: "deliveryPartner",
//                 populate: {
//                     path: "user",
//                     select: "firstName lastName email phone",
//                 },
//             });

//         return res.status(200).json({
//             success: true,
//             message: "Delivery partner assigned successfully",

//             order: updatedOrder,
//             deliveryPartner: reservedPartner,

//             route: {
//                 distanceMeters: route.distanceMeters,
//                 distanceKm: route.distanceKm,
//                 durationSeconds: route.durationSeconds,
//                 durationMinutes: route.durationMinutes,
//             },

//             earning: {
//                 baseEarning: payout.baseEarning,
//                 totalEarning: payout.totalEarning,
//                 payoutStatus: payout.payoutStatus,
//             },
//         });

//     } catch (error) {
//         // Release reserved partner if assignment fails
//         if (reservedPartner && !assignmentCompleted) {
//             await DeliveryPartner.updateOne(
//                 {
//                     _id: reservedPartner._id,
//                 },
//                 {
//                     $set: {
//                         isAvailable: true,
//                     },
//                 }
//             ).catch((releaseError) => {
//                 console.log("Partner Release Error:", releaseError);
//             });
//         }

//         console.log("ASSIGN DELIVERY PARTNER ERROR:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message || "Failed to assign delivery partner",
//         });
//     }
// };

const assignDeliveryPartner = async (req, res) => {
    let reservedPartner = null;
    let assignmentCompleted = false;

    try {
        const { orderId, deliveryPartnerId } = req.body;

        // Validate IDs
        if (
            !mongoose.Types.ObjectId.isValid(orderId) ||
            !mongoose.Types.ObjectId.isValid(deliveryPartnerId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order or delivery partner ID",
            });
        }

        // Find order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (["Delivered", "Cancelled"].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Cannot assign delivery partner to this order",
            });
        }

        // Find delivery record
        const delivery = await Delivery.findOne({
            order: orderId,
        });

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Delivery record not found",
            });
        }

        // Find store
        const store = await Store.findById(order.store);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found",
            });
        }

        // Check existing payout
        const existingPayout = await DeliveryPayout.findOne({
            order: orderId,
        });

        if (
            existingPayout &&
            existingPayout.payoutStatus !== "pending"
        ) {
            return res.status(409).json({
                success: false,
                message: "Delivery payout is already processed",
            });
        }

        // Find selected delivery partner
        const selectedPartner = await DeliveryPartner.findById(
            deliveryPartnerId
        ).populate("user", "firstName lastName email phone");

        if (!selectedPartner || !selectedPartner.user) {
            return res.status(404).json({
                success: false,
                message: "Delivery partner not found",
            });
        }

        // Check if already assigned
        if (
            order.deliveryPartner &&
            order.deliveryPartner.toString() ===
            deliveryPartnerId.toString()
        ) {
            return res.status(200).json({
                success: true,
                message: "This delivery partner is already assigned",
            });
        }

        // Reserve partner
        reservedPartner = await DeliveryPartner.findOneAndUpdate(
            {
                _id: deliveryPartnerId,
                status: "active",
                isOnline: true,
                isAvailable: true,
            },
            {
                $set: {
                    isAvailable: false,
                },
            },
            {
                new: true,
            }
        ).populate("user", "firstName lastName email phone");

        if (!reservedPartner) {
            return res.status(409).json({
                success: false,
                message: "Delivery partner is not available",
            });
        }

        console.log("storelocation", store.location);
        console.log("custormerlocation", delivery.customerLocation);

        // Calculate delivery distance
        const route = await calculateRoadDistance(
            store.location,
            delivery.customerLocation
        );

        // Calculate earning at ₹40 per km
        const ratePerKm = 40;
        const distanceKm = Number(route.distanceMeters) / 1000;

        if (
            !Number.isFinite(distanceKm) ||
            distanceKm < 0 ||
            !Number.isFinite(route.distanceMeters) ||
            !Number.isFinite(route.durationSeconds)
        ) {
            throw new Error("Invalid delivery distance calculation");
        }

        const totalEarning = Number(
            (distanceKm * ratePerKm).toFixed(2)
        );

        // Save previous partner ID
        const previousPartnerId = order.deliveryPartner;

        // Assign partner to order
        order.deliveryPartner = reservedPartner._id;
        await order.save();

        // Assign partner to delivery
        delivery.deliveryPartner = reservedPartner._id;
        await delivery.save();

        // Create or update payout
        const payout = await DeliveryPayout.findOneAndUpdate(
            {
                order: order._id,
            },
            {
                $set: {
                    order: order._id,
                    delivery: delivery._id,
                    deliveryPartner: reservedPartner._id,
                    store: store._id,

                    distanceMeters: route.distanceMeters,
                    distanceKm: distanceKm,
                    durationSeconds: route.durationSeconds,

                    baseEarning: totalEarning,
                    totalEarning: totalEarning,

                    payoutStatus: "pending",
                    payableAt: null,
                    paidAt: null,
                    paymentReference: null,
                    settlementNote: "",
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        // Release previous partner
        if (
            previousPartnerId &&
            previousPartnerId.toString() !==
            reservedPartner._id.toString()
        ) {
            await DeliveryPartner.updateOne(
                {
                    _id: previousPartnerId,
                },
                {
                    $set: {
                        isAvailable: true,
                    },
                }
            );
        }

        assignmentCompleted = true;

        // Get updated order
        const updatedOrder = await Order.findById(orderId)
            .populate("user", "firstName lastName email phone")
            .populate("address")
            .populate("store", "name code")
            .populate({
                path: "deliveryPartner",
                populate: {
                    path: "user",
                    select: "firstName lastName email phone",
                },
            });

        return res.status(200).json({
            success: true,
            message: "Delivery partner assigned successfully",

            order: updatedOrder,
            deliveryPartner: reservedPartner,

            route: {
                distanceMeters: route.distanceMeters,
                distanceKm: distanceKm,
                durationSeconds: route.durationSeconds,
                durationMinutes: route.durationMinutes,
            },

            earning: {
                ratePerKm: ratePerKm,
                baseEarning: payout.baseEarning,
                totalEarning: payout.totalEarning,
                payoutStatus: payout.payoutStatus,
            },
        });

    } catch (error) {
        // Release reserved partner if assignment fails
        if (reservedPartner && !assignmentCompleted) {
            await DeliveryPartner.updateOne(
                {
                    _id: reservedPartner._id,
                },
                {
                    $set: {
                        isAvailable: true,
                    },
                }
            ).catch((releaseError) => {
                console.log("Partner Release Error:", releaseError);
            });
        }

        console.log("ASSIGN DELIVERY PARTNER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to assign delivery partner",
        });
    }
};





const verifyDeliveryOtp = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const userId = req.user.id;
        const { orderId, otp } = req.body;

        // Validate input
        if (
            !orderId ||
            !mongoose.Types.ObjectId.isValid(orderId) ||
            !/^\d{4}$/.test(String(otp || ""))
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid order ID and 4-digit OTP are required",
            });
        }

        // Find delivery partner
        const deliveryPartner = await DeliveryPartner.findOne({
            user: userId,
        }).select("_id");

        if (!deliveryPartner) {
            return res.status(403).json({
                success: false,
                message: "Delivery partner profile not found",
            });
        }

        let responseData = null;

        await session.withTransaction(async () => {

            // Find assigned delivery
            const delivery = await Delivery.findOne({
                order: orderId,
                deliveryPartner: deliveryPartner._id,
                deliveryStatus: "assigned",
            })
                .select("+deliveryOtp")
                .session(session);

            if (!delivery) {
                throw new Error(
                    "Assigned delivery not found or already completed"
                );
            }

            // Verify OTP
            const savedOtp = String(delivery.deliveryOtp || "");
            const enteredOtp = String(otp);

            const savedBuffer = Buffer.from(savedOtp);
            const enteredBuffer = Buffer.from(enteredOtp);

            const isOtpValid =
                savedBuffer.length === enteredBuffer.length &&
                crypto.timingSafeEqual(savedBuffer, enteredBuffer);

            if (!isOtpValid) {
                throw new Error("Invalid delivery OTP");
            }

            // Find order
            const order = await Order.findOne({
                _id: orderId,
                deliveryPartner: deliveryPartner._id,
            }).session(session);

            if (!order) {
                throw new Error("Order not found or not assigned to you");
            }

            if (
                ["delivered", "cancelled"].includes(
                    String(order.orderStatus).toLowerCase()
                )
            ) {
                throw new Error(
                    "This order is already completed or cancelled"
                );
            }

            // Find pending payout
            const payout = await DeliveryPayout.findOne({
                order: order._id,
                delivery: delivery._id,
                deliveryPartner: deliveryPartner._id,
                payoutStatus: "pending",
            }).session(session);

            if (!payout) {
                throw new Error(
                    "Pending delivery payout not found. Please contact admin."
                );
            }

            const deliveredAt = new Date();

            const paymentMethod = String(
                order.paymentMethod || ""
            ).toLowerCase();

            let updatedPayment = null;

            // Update delivery
            delivery.deliveryStatus = "delivered";
            delivery.deliveredAt = deliveredAt;
            delivery.deliveryOtp = undefined;

            await delivery.save({ session });

            // Update order
            order.orderStatus = "Delivered";
            order.deliveredAt = deliveredAt;

            // COD payment handling
            if (paymentMethod === "cod") {
                order.status = "Paid";

                updatedPayment = await Payment.findOneAndUpdate(
                    {
                        order: order._id,
                    },
                    {
                        $set: {
                            status: "success",
                            paidAt: deliveredAt,
                            paymentGateway: "cod",
                            method: "cod",
                            amount: order.totalAmount,
                        },
                        $setOnInsert: {
                            order: order._id,
                            user: order.user,
                            currency: "INR",
                        },
                    },
                    {
                        new: true,
                        upsert: true,
                        runValidators: true,
                        setDefaultsOnInsert: true,
                        session,
                    }
                );
            }

            await order.save({ session });

            // Calculate delivery partner earning
            const ratePerKm = 40;

            const distanceKm = Number(payout.distanceKm);

            if (!Number.isFinite(distanceKm) || distanceKm < 0) {
                throw new Error("Invalid delivery distance");
            }

            const totalEarning = Number(
                (distanceKm * ratePerKm).toFixed(2)
            );

            // Automatically settle payout
            const updatedPayout = await DeliveryPayout.findOneAndUpdate(
                {
                    _id: payout._id,
                    payoutStatus: "pending",
                },
                {
                    $set: {
                        baseEarning: totalEarning,
                        totalEarning: totalEarning,
                        payoutStatus: "paid",
                        payableAt: deliveredAt,
                        paidAt: deliveredAt,
                        paymentReference: "Automatic OTP Settlement",
                        settlementNote: "Automatically settled at ₹40 per km after successful delivery",
                    },
                },
                {
                    new: true,
                    runValidators: true,
                    session,
                }
            );

            if (!updatedPayout) {
                throw new Error("Payout already settled or unavailable");
            }

            // Update delivery partner earnings
            const updatedPartner = await DeliveryPartner.findOneAndUpdate(
                {
                    _id: deliveryPartner._id,
                },
                {
                    $set: {
                        isAvailable: true,
                    },
                    $inc: {
                        totalDeliveries: 1,
                        totalEarnings: totalEarning,
                    },
                },
                {
                    new: true,
                    session,
                }
            );

            if (!updatedPartner) {
                throw new Error("Unable to update delivery partner earnings");
            }

            // Prepare response
            responseData = {
                order: {
                    _id: order._id,
                    orderNumber: order.orderNumber,
                    orderStatus: order.orderStatus,
                    paymentMethod: order.paymentMethod,
                    paymentStatus: order.status,
                    deliveredAt: order.deliveredAt,
                },

                delivery: {
                    deliveryStatus: delivery.deliveryStatus,
                    deliveredAt: delivery.deliveredAt,
                },

                payment: updatedPayment
                    ? {
                        status: updatedPayment.status,
                        paidAt: updatedPayment.paidAt,
                        amount: updatedPayment.amount,
                    }
                    : null,

                payout: {
                    distanceKm: updatedPayout.distanceKm,
                    ratePerKm: ratePerKm,
                    totalEarning: updatedPayout.totalEarning,
                    payoutStatus: updatedPayout.payoutStatus,
                    payableAt: updatedPayout.payableAt,
                    paidAt: updatedPayout.paidAt,
                },

                partner: {
                    totalEarnings: updatedPartner.totalEarnings,
                    totalDeliveries: updatedPartner.totalDeliveries,
                },
            };
        });

        return res.status(200).json({
            success: true,
            message: "Delivery verified and payout settled successfully",
            ...responseData,
        });

    } catch (error) {
        console.error("Verify Delivery OTP Error:", error);

        let statusCode = 500;

        if (error.message === "Invalid delivery OTP") {
            statusCode = 400;
        } else if (
            error.message ===
            "Assigned delivery not found or already completed"
        ) {
            statusCode = 404;
        } else if (
            error.message ===
            "This order is already completed or cancelled"
        ) {
            statusCode = 409;
        } else if (
            error.message ===
            "Order not found or not assigned to you"
        ) {
            statusCode = 404;
        }

        return res.status(statusCode).json({
            success: false,
            message: error.message || "OTP verification failed",
        });

    } finally {
        await session.endSession();
    }
};






const PlaceOnlineOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const userId = req.user.id;
        const { addressId, storeId } = req.body;

        // Validate required fields
        if (!addressId || !storeId) {
            return res.status(400).json({
                success: false,
                message: "Address and store are required"
            });
        }

        // Find user's address
        const address = await Address.findOne({
            _id: addressId,
            user: userId
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // Find cart
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

        // Get cart items
        const cartItems = await CartItem.find({
            cart: cart._id
        })
            .populate("product")
            .populate("variant");

        if (!cartItems.length) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }

        // Calculate subtotal
        let subtotal = 0;

        for (const item of cartItems) {
            if (!item.product || !item.variant) {
                return res.status(400).json({
                    success: false,
                    message: "Product or variant not found"
                });
            }

            subtotal +=
                Number(item.variant.sellingPrice) *
                Number(item.quantity);
        }

        // Calculate delivery fee
        const deliveryFee = await calculateDeliveryFee(
            subtotal,
            storeId,
            address
        );

        const totalAmount = subtotal + deliveryFee;

        // Create Razorpay order
        const razorpayOrder = await rozarpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: `order_${Date.now()}`,
            notes: {
                userId: userId.toString(),
                storeId: storeId.toString()
            }
        });

        // Start database transaction
        session.startTransaction();

        // Reserve inventory
        await reserveAvailableInventory(
            storeId,
            cartItems,
            session
        );

        // Generate order number
        const orderNumber = `QK${Date.now()}`;

        // Create local order
        const [order] = await Order.create(
            [{
                user: userId,
                store: storeId,
                address: addressId,
                orderNumber,
                subtotal,
                deliveryFee,
                totalAmount,
                paymentMethod: "ONLINE",
                status: "Pending",
                orderStatus: "Placed"
            }],
            { session }
        );

        // Save Razorpay Order ID explicitly
        order.razorpayOrderId = razorpayOrder.id;

        await order.save({ session });

        console.log(
            "Saved Razorpay Order ID:",
            order.razorpayOrderId
        );

        // Create order items
        const orderItems = cartItems.map((item) => {
            const price = Number(item.variant.sellingPrice);
            const quantity = Number(item.quantity);

            return {
                order: order._id,
                product: item.product._id,
                variant: item.variant._id,

                productName: item.product.name,
                variantName: item.variant.name,
                sku: item.variant.sku,

                quantity,
                price,

                discount: Number(
                    item.variant.discountPercentage || 0
                ),

                tax: 0,

                totalPrice: price * quantity
            };
        });

        await OrderItem.insertMany(
            orderItems,
            { session }
        );

        // Create delivery
        await createOrderDelivery(
            order,
            address,
            session
        );

        // Commit transaction
        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Online order created successfully",
            order,
            razorpay: {
                keyId: process.env.Test_API_Key,
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency
            }
        });

    } catch (error) {

        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.log("CREATE ONLINE ORDER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create online order",
            error: error.message
        });

    } finally {
        session.endSession();
    }
};




const verifyOnlinePayment = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const userId = req.user.id;

        const {
            orderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Validate required fields
        if (
            !orderId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        // Find user's online order
        const order = await Order.findOne({
            _id: orderId,
            user: userId,
            paymentMethod: "ONLINE"
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Already paid - prevent duplicate processing
        if (order.status === "Paid") {
            return res.status(200).json({
                success: true,
                message: "Payment already verified",
                order
            });
        }
        console.log("DB Razorpay Order ID:", order.razorpayOrderId);
console.log("Frontend Razorpay Order ID:", razorpay_order_id);
console.log("Order ID:", order._id);

        // Check Razorpay order ID
        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid Razorpay order ID"
            });
        }

        // Validate signature format
        if (!/^[a-f0-9]{64}$/i.test(razorpay_signature)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // Generate expected signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.Test_Key_Secret)
            .update(body)
            .digest("hex");

        // Compare signatures safely
        const signatureBuffer = Buffer.from(razorpay_signature, "hex");
        const expectedBuffer = Buffer.from(expectedSignature, "hex");

        if (
            signatureBuffer.length !== expectedBuffer.length ||
            !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment signature verification failed"
            });
        }

        // Fetch payment details from Razorpay
        const razorpayPayment = await rozarpay.payments.fetch(
            razorpay_payment_id
        );

        // Verify Razorpay payment details
        if (
            razorpayPayment.order_id !== razorpay_order_id ||
            razorpayPayment.amount !== Math.round(order.totalAmount * 100) ||
            razorpayPayment.currency !== "INR" ||
            razorpayPayment.status !== "captured"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details do not match"
            });
        }

        // Get payment method
        const allowedMethods = [
            "upi",
            "card",
            "netbanking",
            "wallet",
            "emi"
        ];

        const paymentMethod = allowedMethods.includes(
            razorpayPayment.method
        )
            ? razorpayPayment.method
            : "other";

        // Start database transaction
        session.startTransaction();

        // Check existing payment
        let payment = await Payment.findOne({
            order: order._id,
            user: userId,
            paymentGateway: "razorpay"
        }).session(session);

        if (payment) {
            payment.transactionId = razorpay_payment_id;
            payment.amount = order.totalAmount;
            payment.currency = "INR";
            payment.method = paymentMethod;
            payment.status = "success";
            payment.gatewayResponse = {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                razorpay_status: razorpayPayment.status
            };
            payment.paidAt = new Date();

            await payment.save({ session });

        } else {
            const [newPayment] = await Payment.create(
                [
                    {
                        order: order._id,
                        user: userId,
                        paymentGateway: "razorpay",
                        transactionId: razorpay_payment_id,
                        amount: order.totalAmount,
                        currency: "INR",
                        method: paymentMethod,
                        status: "success",
                        gatewayResponse: {
                            razorpay_order_id,
                            razorpay_payment_id,
                            razorpay_signature,
                            razorpay_status: razorpayPayment.status
                        },
                        paidAt: new Date()
                    }
                ],
                { session }
            );

            payment = newPayment;
        }

        // Update order status
        order.status = "Paid";

        await order.save({ session });

        // Clear only this user's cart for this store
        const cart = await Cart.findOne({
            user: userId,
            store: order.store
        }).session(session);

        if (cart) {
            await CartItem.deleteMany(
                { cart: cart._id },
                { session }
            );
        }

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Payment verified and order confirmed successfully",
            order,
            payment
        });

    } catch (error) {

        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.log("VERIFY ONLINE PAYMENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message
        });

    } finally {
        session.endSession();
    }
};
// --------------------------------------------------
// GET SINGLE ORDER
// --------------------------------------------------



const getSingleOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        let order;

        // Customer apna order dekh sakta hai
        if (role === "customer") {
            order = await Order.findOne({
                _id: id,
                user: userId,
            });
        }

        // Delivery partner sirf assigned order dekh sakta hai
        else if (role === "delivery_partner") {
            const deliveryPartner = await DeliveryPartner.findOne({
                user: userId,
            });

            if (!deliveryPartner) {
                return res.status(404).json({
                    success: false,
                    message: "Delivery partner not found",
                });
            }

            order = await Order.findOne({
                _id: id,
                deliveryPartner: deliveryPartner._id,
            });
        }

        // Admin
        else {
            order = await Order.findById(id);
        }

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order = await Order.findById(order._id)
            .populate("user", "firstName lastName email phone")
            .populate("address")
            .populate("store", "name code")
            .populate("deliveryPartner")
            .lean();

        const orderItems = await OrderItem.find({
            order: order._id,
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

        const formattedItems = orderItems.map((item) => ({
            ...item,
            productName: item.productName || item.product?.name || "Product",
            variantName:
                item.variantName ||
                item.variant?.variantName ||
                item.variant?.name ||
                "",
            sku: item.sku || item.variant?.sku || "",
        }));

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order: {
                ...order,
                items: formattedItems,
            },
        });

    } catch (error) {
        console.error("Get Single Order Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};





module.exports = {
    placeOrder,
    getAllOrders,
    getMyOrders,
    createOrder,
    verifyDeliveryOtp,
    assignDeliveryPartner,
    PlaceOnlineOrder,
    verifyOnlinePayment,
    getSingleOrder
};

