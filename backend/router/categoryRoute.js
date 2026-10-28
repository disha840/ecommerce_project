const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const {
  createCategory,
  showCategory,
  deleteCategory,
  viewCategory,
  searchCategory,
  updateCategory,
  toggleStatus
} = require("../controller/categoryController");

// router.use(auth);

router.post(
  "/createcategory",
  checkPermission("categories","create"),
  createCategory
);

router.get(
  "/showcategories",
  showCategory
);

router.get(
  "/viewcategory/:id",
  viewCategory
);

router.get(
  "/searched",
  checkPermission("categories","read"),
  searchCategory
);

router.delete(
  "/deletecategory/:id",
  checkPermission("categories","delete"),
  deleteCategory
);

router.put(
  "/updatecategory/:id",
  checkPermission("categories","update"),
  updateCategory
);

router.put(
  "/toggle-status/:id",
  checkPermission("categories","update"),
  toggleStatus
);

module.exports = router;
