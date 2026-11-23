const express = require("express");
const router = express.Router();
const {addToWishlist,getWishlist,removeFromWishlist}=require("../controller/wishlistController")

const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

router.post("/add",auth,addToWishlist)
router.get("/get", auth, getWishlist);
router.delete("/remove/:id", auth, removeFromWishlist);
module.exports = router;