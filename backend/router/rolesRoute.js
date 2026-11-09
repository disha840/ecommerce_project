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
  viewRole
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
router.put(
  "/toggle-status/:id",

  toggleStatus
);

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