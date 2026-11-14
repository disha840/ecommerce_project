
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

        // Create delivery record
        await createOrderDelivery(
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
        const orders = await Order.find()
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

const verifyPayment=  (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.Test_Key_Secret)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    // TODO: Update database to mark order as paid
    res.json({ status: 'success', message: 'Payment verified successfully', paymentId: razorpay_payment_id });
  } else {
    res.status(400).json({ status: 'failure', message: 'Invalid signature!' });
  }
};


// --------------------------------------------------
// EXPORT CONTROLLERS
// --------------------------------------------------


const placeOnlineOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const userId = req.user.id;

        const {
            addressId,
            storeId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !addressId ||
            !storeId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Required details are missing",
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

        // Verify Razorpay signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.Test_Key_Secret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }

        // Fetch Razorpay order
        const razorpayOrder = await rozarpay.orders.fetch(
            razorpay_order_id
        );

        console.log("Razorpay Amount:", razorpayOrder.amount);
        console.log("Razorpay Currency:", razorpayOrder.currency);

        session.startTransaction();

        // Find address
        const address = await Address.findOne({
            _id: addressId,
            user: userId,
        }).session(session);

        if (!address) {
            throw new Error("Address not found");
        }

        // Find selected store cart
        const cart = await Cart.findOne({
            user: userId,
            store: storeId,
        }).session(session);

        if (!cart) {
            throw new Error("Cart not found for selected store");
        }

        // Get cart items
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

            // Check inventory
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
                    `${product.name} is not available or stock is insufficient`
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

        // Check payment amount
        console.log("Backend Total Amount:", totalAmount);
        console.log(
            "Backend Amount in Paise:",
            Math.round(totalAmount * 100)
        );

        if (
            razorpayOrder.amount !== Math.round(totalAmount * 100) ||
            razorpayOrder.currency !== "INR"
        ) {
            throw new Error("Payment amount does not match order amount");
        }

        // Create order
        const orderNumber = `ORD-${Date.now()}-${Math.floor(
            1000 + Math.random() * 9000
        )}`;

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
                    paymentMethod: "ONLINE",
                    status: "Paid",
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

        // Create payment record
        await Payment.create(
            [
                {
                    order: createdOrder._id,
                    user: userId,
                    paymentGateway: "razorpay",
                    transactionId: razorpay_payment_id,
                    amount: totalAmount,
                    currency: "INR",
                    method: "other",
                    status: "success",
                    paidAt: new Date(),
                },
            ],
            { session }
        );

        // Create delivery
        await createOrderDelivery(
            createdOrder,
            address,
            session
        );

        // Clear cart
        await CartItem.deleteMany(
            { cart: cart._id },
            { session }
        );

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Online order placed successfully",
            order: createdOrder,
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.log("PLACE ONLINE ORDER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Unable to place online order",
        });

    } finally {
        await session.endSession();
    }
};


module.exports = {
    placeOrder,
    getAllOrders,
    getMyOrders,
    createOrder,
    verifyPayment,
    placeOnlineOrder
};
