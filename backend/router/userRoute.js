

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
  checkUserAuth

} = require("../controller/userController");

require("dotenv").config();

// router.use(auth);

router.post(
  "/createuser",
  createUser
);

router.put(
  "/toggle-status/:id",
  toggleStatus
);

router.get(
  "/allusers",
  getAllUser
);

router.get(
  "/viewuser/:id",
  viewUser
);

router.get(
  "/searched",

  searchUser
);

router.put(
  "/updateuser/:id",
  updateUser
);

router.delete(
  "/deleteuser/:id",
  deleteUser
);

router.get(
  "/getrole",
  getRole
);
router.post("/signup", customerSignup);
router.post("/login", customerLogin);

router.get("/checkauth",checkUserAuth)

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
