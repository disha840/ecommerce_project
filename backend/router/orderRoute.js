const express = require("express");
const router = express.Router();
const { placeOrder ,getAllOrders ,getMyOrders } =require("../controller/orderController")
const auth = require("../middleware/authMiddleware");

router.post("/place",auth, placeOrder);
router.get("/all", getAllOrders);
router.get("/my-orders", auth, getMyOrders);
module.exports = router;