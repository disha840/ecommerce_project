const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");
const {createInventory,getInventories,getAvailableStoreInventory,getStoreCategories,getStoreSubcategories,getStoreSubcategoryProducts}=require("../controller/inventoryController")

router.post("/createinventory",auth, checkPermission("inventory","create") ,createInventory);
router.get("/getinventories",auth,checkPermission("inventory","read"),getInventories)


router.get("/store/:storeId", getAvailableStoreInventory);

router.get("/store-categories/:storeId", getStoreCategories);
router.get(
    "/store-subcategories/:storeId/:categorySlug",
    getStoreSubcategories
);

router.get(
    "/store/:storeId/subcategory/:slug/products",
    getStoreSubcategoryProducts
);

module.exports = router;