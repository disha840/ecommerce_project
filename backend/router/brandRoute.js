const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const {
  createBrand,
  showBrand,
  deleteBrand,
  viewBrand
} = require("../controller/brandController");

// router.use(auth);

router.post(
  "/createbrand",
  createBrand
);

router.get(
  "/showbrand",
  showBrand
);

router.get(
  "/viewbrand/:id",
  viewBrand
);

router.delete(
  "/deletebrand/:id",
  deleteBrand
);

module.exports = router;