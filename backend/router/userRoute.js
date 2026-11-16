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
  toggleStatus,
  customerSignup,
  customerLogin,
  checkUserAuth,
  logout,
  updateProfile
} = require("../controller/userController");

require("dotenv").config();

// Admin user routes

router.post(
  "/createuser",
  auth,
  checkPermission("users", "create"),
  createUser
);

router.patch(
  "/toggle-status/:id",
  auth,
  checkPermission("users", "update"),
  toggleStatus
);

router.get(
  "/allusers",
  auth,
  checkPermission("users", "read"),
  getAllUser
);

router.get(
  "/viewuser/:id",
  auth,
  checkPermission("users", "read"),
  viewUser
);

router.get(
  "/searched",
  auth,
  checkPermission("users", "read"),
  searchUser
);

router.put(
  "/updateuser/:id",
  auth,
  checkPermission("users", "update"),
  updateUser
);

router.delete(
  "/deleteuser/:id",
  auth,
  checkPermission("users", "delete"),
  deleteUser
);

router.get(
  "/getrole",
  auth,
  checkPermission("users", "read"),
  getRole
);

// Customer routes

router.post("/signup", customerSignup);
router.post("/login", customerLogin);
router.get("/checkauth", checkUserAuth);
router.post("/logout", logout);

router.put("/update-profile", auth, updateProfile);

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
