const express = require("express");
const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const router = express.Router();

const {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
  toggleStatus,
  viewRole,
  searchRole
} = require("../controller/roleController");

router.use(auth);


router.post(
  "/createrole",
  createRole
);

router.get(
  "/showroles",

  getRoles
);
router.patch(
  "/toggle-status/:id",

  toggleStatus
);
router.get("/searched", searchRole);

router.put(
  "/updaterole/:id",
  updateRole
);

router.delete(
  "/deleterole/:id",
  deleteRole
);

router.get(
  "/viewrole/:id",
  viewRole
);

module.exports = router;