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
  updateStore
} = require("../controller/storeController");

router.post("/nearest", getNearestStore);
// router.use(auth);

router.get(
  "/managers",
  getStoreManagers
);


router.post(
  "/createStore",

  createStore
);

router.get(
  "/getstores",
  getStores
);
router.delete("/delete/:id", deleteStore);

router.put("/updateStore/:id", updateStore);

module.exports = router;