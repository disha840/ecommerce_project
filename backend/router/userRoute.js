

const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissions");

const {
  createUser,
  getAllUser,
  viewUser,
  updateUser,
  deleteUser,
  searchUser,
  getRole,
  toggleStatus
} = require("../controller/userController");

require("dotenv").config();

router.use(auth);

router.post(
  "/createuser",
  checkPermission("users", "create"),
  createUser
);

router.put(
  "/toggle-status/:id",
  checkPermission("users", "update"),
  toggleStatus
);

router.get(
  "/allusers",
  checkPermission("users", "read"),
  getAllUser
);

router.get(
  "/viewuser/:id",
  checkPermission("users", "read"),
  viewUser
);

router.get(
  "/searched",
  checkPermission("users", "read"),
  searchUser
);

router.put(
  "/updateuser/:id",
  checkPermission("users", "update"),
  updateUser
);

router.delete(
  "/deleteuser/:id",
  checkPermission("users", "delete"),
  deleteUser
);

router.get(
  "/getrole",
  checkPermission("users", "read"),
  getRole
);

module.exports = router;

















// const express=require("express")
// const permissions=require("../middleware/permissions")
// const router=express.Router();
// const middleware=require("../middleware/authMiddleware")
// const { createUser, getAllUser ,viewUser, updateUser, deleteUser, searchUser,getRole ,toggleStatus} = require("../controller/userController");
// require("dotenv").config()
// router.use(middleware)



// router.post("/createuser",createUser );

// router.put("/toggle-status/:id",toggleStatus)

// router.get("/allusers",getAllUser)
// router.get("/viewuser/:id",viewUser)
// router.get("/searched",searchUser)
// router.put("/updateuser/:id",updateUser)
// router.delete("/deleteuser/:id",deleteUser)
// router.get("/getrole",getRole)
// module.exports=router
