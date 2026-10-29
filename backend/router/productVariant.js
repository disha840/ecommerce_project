const express = require("express");
const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const { createProductVariant,getProductVariants,deleteProductVariant } = require("../controller/variantController");

const router = express.Router();

// router.use(auth);

router.post(
  "/createvariant",
  createProductVariant
);
router.get("/getproductvariants",getProductVariants)
router.delete("/deletevariant/:id", deleteProductVariant)
module.exports = router;