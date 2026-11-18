
const express = require("express");
const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const {
  createSubcategory,
  ShowSubCategory,
  updateSubcategory,
  viewSubCategory,
  deleteSubCategory,
  ShowSubCategoryByCategory
} = require("../controller/subCatController");

const router = express.Router();

router.post(
  "/createsubcategory",
  auth,
  checkPermission("subcategories", "create"),
  createSubcategory
);

router.get(
  "/showsubcategories",
  auth,
  checkPermission("subcategories", "read"),
  ShowSubCategory
);

router.put(
  "/updatesubcategory/:id",
  auth,
  checkPermission("subcategories", "update"),
  updateSubcategory
);

router.get(
  "/viewsubcategory/:id",
  auth,
  checkPermission("subcategories", "read"),
  viewSubCategory
);

router.delete(
  "/deletesubcategory/:id",
  auth,
  checkPermission("subcategories", "delete"),
  deleteSubCategory
);

router.get(
  "/showsubcategories/:categoryId",
  auth,
  checkPermission("subcategories", "read"),
  ShowSubCategoryByCategory
);

module.exports = router;
