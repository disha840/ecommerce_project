const express = require("express");
const router = express.Router();
const { placeOrder ,getAllOrders ,getMyOrders,createOrder,verifyPayment ,placeOnlineOrder} =require("../controller/orderController")
const auth = require("../middleware/authMiddleware");

router.post("/place",auth, placeOrder);
router.get("/all", getAllOrders);
router.get("/my-orders", auth, getMyOrders);
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/place-online-order",auth,placeOnlineOrder);

module.exports = router;