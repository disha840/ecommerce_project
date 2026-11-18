const express = require("express");
const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const {
  createProductVariant,
  getProductVariants,
  deleteProductVariant,
  getVariants,
  getOneVariant,
  updateProductVariant,
  viewVariant,
  getAllVariants
} = require("../controller/variantController");

const router = express.Router();

router.post(
  "/createvariant",
  auth,
  checkPermission("variants", "create"),
  createProductVariant
);

router.get(
  "/getproductvariants",
  auth,
  checkPermission("variants", "read"),
  getProductVariants
);

router.delete(
  "/deletevariant/:id",
  auth,
  checkPermission("variants", "delete"),
  deleteProductVariant
);

router.get(
  "/getvariants/:slug",
  auth,
  checkPermission("variants", "read"),
  getVariants
);

router.get(
  "/getallvariants/:id",
  auth,
  checkPermission("variants", "read"),
  getAllVariants
);

router.put(
  "/updatevariant/:id",
  auth,
  checkPermission("variants", "update"),
  updateProductVariant
);

router.get(
  "/getonevariant/:slug",
  auth,
  checkPermission("variants", "read"),
  getOneVariant
);

router.get(
  "/viewvariant/:id",
  auth,
  checkPermission("variants", "read"),
  viewVariant
);

module.exports = router;