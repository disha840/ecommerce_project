const express=require("express")
const router=express.Router();
const { signup,login,changePassword,generateotp, resendOtop, verifyotp, getdata,logout } = require("../controller/adminController");
require("dotenv").config()

router.post("/signup",signup)
router.post("/login",login)
router.post("/generateotp",generateotp)

router.post("/resendotp",resendOtop)
   
router.post("/verifyotp",verifyotp)
router.post("/changepassword",changePassword)
router.post("/logout",logout)

router.get("/getdata",getdata)
module.exports=router