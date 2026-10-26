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

router.use(auth);

router.post(
  "/createbrand",
  checkPermission("brand","create"),
  createBrand
);

router.get(
  "/showbrand",
  checkPermission("brand","read"),
  showBrand
);

router.get(
  "/viewbrand/:id",
  checkPermission("brand","read"),
  viewBrand
);

router.delete(
  "/deletebrand/:id",
  checkPermission("brand","delete"),
  deleteBrand
);

module.exports = router;