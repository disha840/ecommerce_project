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

router.post("/nearest", getNearestStore);
// router.use(auth);

router.get(
  "/managers",
  getStoreManagers
);

router.get("/searched", searchStore);

router.post(
  "/createStore",

  createStore
);

router.get(
  "/getstores",
  getStores
);
router.get("/allstores", getAllStores);
router.delete("/delete/:id", deleteStore);
router.patch("/toggle-status/:id", toggleStoreStatus);

router.put("/updateStore/:id", updateStore);

module.exports = router;