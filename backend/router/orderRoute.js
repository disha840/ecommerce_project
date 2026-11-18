const express = require("express");
const router = express.Router();
const { placeOrder ,getAllOrders ,getMyOrders,createOrder,assignDeliveryPartner,verifyDeliveryOtp,verifyOnlinePayment,PlaceOnlineOrder,getSingleOrder} =require("../controller/orderController")
const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

router.get("/all",auth,checkPermission("orders", "read"),getAllOrders);

router.post("/place",auth, placeOrder);

router.get("/my-orders", auth, getMyOrders);
router.post("/create-order", createOrder);
// router.post("/verify-payment", verifyPayment);
// router.post("/place-online-order",auth,placeOnlineOrder);
router.post(
    "/create-online-order",
    auth,
    PlaceOnlineOrder
);
router.post(
    "/verify-online-payment",
    auth,
    verifyOnlinePayment
);

router.get("/single/:id", auth, getSingleOrder);
router.post("/verify-otp", auth, verifyDeliveryOtp);
router.post("/assign-delivery-partner",auth, assignDeliveryPartner);
module.exports = router;