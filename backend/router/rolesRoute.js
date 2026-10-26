const express = require("express");
const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const router = express.Router();

const {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
  viewRole
} = require("../controller/roleController");

router.use(auth);

router.post(
  "/createrole",
  checkPermission("roles","create"),
  createRole
);

router.get(
  "/showroles",
  checkPermission("roles","read"),
  getRoles
);

router.put(
  "/updaterole/:id",
  checkPermission("roles","update"),
  updateRole
);

router.delete(
  "/deleterole/:id",
  checkPermission("roles","delete"),
  deleteRole
);

router.get(
  "/viewrole/:id",
  checkPermission("roles","read"),
  viewRole
);

module.exports = router;