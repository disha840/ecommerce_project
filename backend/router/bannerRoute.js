const express=require("express")
const auth=require("../middleware/authMiddleware")
const checkPermission = require("../middleware/permissions");
const router=express.Router();

const {
    createBanner,
    getBanners,
    getBanner,
    updateBanner,
    deleteBanner,
} = require("../controller/bannerController");

// Create Banner
router.post("/add", createBanner);

// Get All Banners
router.get("/get", getBanners);

// Get Single Banner
router.get("/get/:id", getBanner);

// Update Banner
router.put("/update/:id", updateBanner);

// Delete Banner
router.delete("/delete/:id", deleteBanner);



module.exports = router;