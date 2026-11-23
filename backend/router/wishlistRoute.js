const express = require("express");
const router = express.Router();
const {addToWishlist}=require("../controller/wishlistController")

const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

router.post("/add",auth,addToWishlist)

module.exports = router;