const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");
const {createInventory,getInventories,getAvailableStoreInventory}=require("../controller/inventoryController")
router.post(
  "/createinventory",
  createInventory
);
router.get("/getinventories",getInventories)
router.get("/store/:storeId", getAvailableStoreInventory);

module.exports = router;