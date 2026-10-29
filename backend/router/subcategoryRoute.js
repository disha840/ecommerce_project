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

// router.use(auth);

router.post(
  "/createsubcategory",
  createSubcategory
);

router.get(
  "/showsubcategories",
  ShowSubCategory
);

router.put(
  "/updatesubcategory/:id",
  updateSubcategory
);

router.get(
  "/viewsubcategory/:id"
,
  viewSubCategory
);

router.delete(
  "/deletesubcategory/:id",
  deleteSubCategory
);

module.exports = router;