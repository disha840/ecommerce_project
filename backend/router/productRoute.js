const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const {
  createProduct,
  showProducts,
  updateProduct,
  viewProduct,
  deleteProduct
} = require("../controller/productController");

router.use(auth);

router.post(
  "/createproduct",
  checkPermission("products","create"),
  createProduct
);

router.get(
  "/showproducts",
  checkPermission("products","read"),
  showProducts
);

router.put(
  "/updateproduct/:id",
  checkPermission("products","update"),
  updateProduct
);

router.get(
  "/viewproduct/:id",
  checkPermission("products","read"),
  viewProduct
);

router.delete(
  "/deleteproduct/:id",
  checkPermission("products","delete"),
  deleteProduct
);

module.exports = router;