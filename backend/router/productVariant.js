const express = require("express");
const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const { createProductVariant,getProductVariants } = require("../controller/variantController");

const router = express.Router();

router.use(auth);

router.post(
  "/createvariant",
  checkPermission("product-variant","create"),
  createProductVariant
);
router.get("/getproductvariants",checkPermission("product-variant","read"),getProductVariants)

module.exports = router;