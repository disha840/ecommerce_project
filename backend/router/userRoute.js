const express=require("express")
const router=express.Router();
const { createUser, getAllUser ,viewUser, updateUser, deleteUser, searchUser,getRole ,toggleStatus} = require("../controller/userController");
require("dotenv").config()



router.post("/createuser",createUser );

router.put("/toggle-status/:id",toggleStatus)

router.get("/allusers",getAllUser)
router.get("/viewuser/:id",viewUser)
router.get("/searched",searchUser)
router.put("/updateuser/:id",updateUser)
router.delete("/deleteuser/:id",deleteUser)
router.get("/getrole",getRole)
module.exports=router
