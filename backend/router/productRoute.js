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
    getSearchSuggestions,
     changeProductStatus
} = require("../controller/productController");

router.post(
    "/createproduct",
    auth,
    checkPermission("products", "create"),
    createProduct
);

router.get(
    "/showproducts",
    auth,
    checkPermission("products", "read"),
    showProducts
);

router.put(
    "/updateproduct/:id",
    auth,
    checkPermission("products", "update"),
    updateProduct
);

router.get(
    "/viewproduct/:id",
    auth,
    checkPermission("products", "read"),
    viewProduct
);

router.delete(
    "/deleteproduct/:id",
    auth,
    checkPermission("products", "delete"),
    deleteProduct
);

router.get(
    "/showsubcategory/:subcategoryId",
    auth,
    checkPermission("products", "read"),
    showProductsBySubcategory
);

router.get(
    "/featured",
    auth,
    checkPermission("products", "read"),
    showFeaturedProducts
);
router.patch(
  "/change-status/:id",
  auth,
  checkPermission("product", "update"),
  changeProductStatus
);

module.exports = router;
