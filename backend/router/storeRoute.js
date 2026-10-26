const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const {
  getStoreManagers,
  createStore,
  getStores
} = require("../controller/storeController");

router.use(auth);

router.get(
  "/managers",
  checkPermission("store","read"),
  getStoreManagers
);

router.post(
  "/createStore",
  checkPermission("store","create"),
  createStore
);

router.get(
  "/getstores",
  checkPermission("store","read"),
  getStores
);

module.exports = router;