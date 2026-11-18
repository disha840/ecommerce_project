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

router.post(
    "/createcategory",
    auth,
    checkPermission("categories", "create"),
    createCategory
);

router.get(
    "/showcategories",
    auth,
    checkPermission("categories", "read"),
    showCategory
);

router.get(
    "/viewcategory/:id",
    auth,
    checkPermission("categories", "read"),
    viewCategory
);

router.get(
    "/searched",
    auth,
    checkPermission("categories", "read"),
    searchCategory
);

router.delete(
    "/deletecategory/:id",
    auth,
    checkPermission("categories", "delete"),
    deleteCategory
);

router.put(
    "/updatecategory/:id",
    auth,
    checkPermission("categories", "update"),
    updateCategory
);

router.put(
    "/toggle-status/:id",
    auth,
    checkPermission("categories", "update"),
    toggleStatus
);

module.exports = router;