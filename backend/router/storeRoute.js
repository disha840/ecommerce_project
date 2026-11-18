
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const {
  getStoreManagers,
  createStore,
  getStores,
  deleteStore,
  getNearestStore,
  updateStore,
  searchStore,
  toggleStoreStatus,
  getAllStores
} = require("../controller/storeController");

// Public route
router.post("/nearest", getNearestStore);

// Protected routes
router.get(
  "/managers",
  auth,
  checkPermission("store", "read"),
  getStoreManagers
);

router.get(
  "/searched",
  auth,
  checkPermission("store", "read"),
  searchStore
);

router.post(
  "/createStore",
  auth,
  checkPermission("store", "create"),
  createStore
);

router.get(
  "/getstores",
  auth,
  checkPermission("store", "read"),
  getStores
);

router.get(
  "/allstores",
  auth,
  checkPermission("store", "read"),
  getAllStores
);

router.delete(
  "/delete/:id",
  auth,
  checkPermission("store", "delete"),
  deleteStore
);

router.patch(
  "/toggle-status/:id",
  auth,
  checkPermission("store", "update"),
  toggleStoreStatus
);

router.put(
  "/updateStore/:id",
  auth,
  checkPermission("store", "update"),
  updateStore
);

module.exports = router;
