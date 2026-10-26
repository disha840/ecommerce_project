const express = require("express");
const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const {
  createSubcategory,
  ShowSubCategory,
  updateSubcategory,
  viewSubCategory,
  deleteSubCategory
} = require("../controller/subCatController");

const router = express.Router();

router.use(auth);

router.post(
  "/createsubcategory",
  checkPermission("subcategories","create"),
  createSubcategory
);

router.get(
  "/showsubcategories",
  checkPermission("subcategories","read"),
  ShowSubCategory
);

router.put(
  "/updatesubcategory/:id",
  checkPermission("subcategories","update"),
  updateSubcategory
);

router.get(
  "/viewsubcategory/:id",
  checkPermission("subcategories","read"),
  viewSubCategory
);

router.delete(
  "/deletesubcategory/:id",
  checkPermission("subcategories","delete"),
  deleteSubCategory
);

module.exports = router;