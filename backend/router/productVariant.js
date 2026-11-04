const express = require("express");
const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const { createProductVariant,getProductVariants,deleteProductVariant,getVariants ,getOneVariant,updateProductVariant, viewVariant} = require("../controller/variantController");

const router = express.Router();

// router.use(auth);

router.post(
  "/createvariant",
  createProductVariant
);
router.get("/getproductvariants",getProductVariants)
router.delete("/deletevariant/:id", deleteProductVariant)
router.get("/getvariants/:slug",getVariants)
router.put("/updatevariant/:id", updateProductVariant);
router.get("/getonevariant/:slug",getOneVariant)
router.get("/viewvariant/:id", viewVariant);
module.exports = router;