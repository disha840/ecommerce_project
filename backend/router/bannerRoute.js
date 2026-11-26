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
const { analyticshub } = require("googleapis/build/src/apis/analyticshub");

// Create Banner
router.post("/add",auth, createBanner);

// Get All Banners
router.get("/get",auth, getBanners);

// Get Single Banner
router.get("/get/:id",auth, getBanner);

// Update Banner
router.put("/update/:id",auth, updateBanner);

// Delete Banner
router.delete("/delete/:id",auth, deleteBanner);



module.exports = router;