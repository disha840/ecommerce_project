const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");
const {createInventory,getInventories,getAvailableStoreInventory,getStoreCategories,getStoreSubcategories,getStoreSubcategoryProducts,getSearchSuggestions,getInventoryById,updateInventory,deleteInventory}=require("../controller/inventoryController")

router.post("/createinventory",auth, checkPermission("inventory","create") ,createInventory);
router.get("/getinventories",auth,checkPermission("inventory","read"),getInventories)

router.get("/getinventory/:id",auth,checkPermission("inventory","read"), getInventoryById);

// UPDATE INVENTORY
router.put("/updateinventory/:id",auth,checkPermission("inventory","update"), updateInventory);

// DELETE INVENTORY
router.delete("/deleteinventory/:id",auth,checkPermission("inventory","delete"), deleteInventory);




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

router.get("/search-suggestions", getSearchSuggestions);

module.exports = router;