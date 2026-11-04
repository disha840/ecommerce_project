const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const {
  createProduct,
  showProducts,
  updateProduct,
  viewProduct,
  showFeaturedProducts,
  deleteProduct,
  showProductsBySubcategory,
} = require("../controller/productController");

// router.use(auth);

router.post(
  "/createproduct",
  createProduct
);

router.get(
  "/showproducts",
  showProducts
);

router.put(
  "/updateproduct/:id",
  updateProduct
);

router.get(
  "/viewproduct/:id",
  viewProduct
);

router.delete(
  "/deleteproduct/:id",
  deleteProduct
);
router.get("/showsubcategory/:subcategoryId", showProductsBySubcategory)
router.get("/featured", showFeaturedProducts);

module.exports = router;