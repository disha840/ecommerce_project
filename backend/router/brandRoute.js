const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const {
    createBrand,
    showBrand,
    deleteBrand,
    viewBrand,
    changeBrandStatus
} = require("../controller/brandController");

router.post(
    "/createbrand",
    auth,
    checkPermission("brand", "create"),
    createBrand
);

router.get(
    "/showbrand",
    auth,
    checkPermission("brand", "read"),
    showBrand
);

router.get(
    "/viewbrand/:id",
    auth,
    checkPermission("brand", "read"),
    viewBrand
);

router.delete(
    "/deletebrand/:id",
    auth,
    checkPermission("brand", "delete"),
    deleteBrand
);

router.patch(
  "/change-status/:id",
  auth,
  checkPermission("brands", "update"),
  changeBrandStatus
);

module.exports = router;