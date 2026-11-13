const express = require("express");
const { addToCart,getCart ,updateCartQuantity,removeCartItem} = require("../controller/cartController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add/:storeId", auth, addToCart);
router.get("/get/:storeId",auth,getCart)
router.put("/update/:id", auth, updateCartQuantity);
router.delete("/remove/:id", auth, removeCartItem);

module.exports = router;