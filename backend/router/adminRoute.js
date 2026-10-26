const express=require("express")
const auth=require("../middleware/authMiddleware")
const router=express.Router();
const { signup,login,changePassword,generateotp, resendOtop, verifyotp, checkAuth,logout } = require("../controller/adminController");
require("dotenv").config()


router.post("/signup",signup)
router.post("/login",login)
// router.use(auth)
router.post("/generateotp",generateotp)

router.post("/resendotp",resendOtop)
   
router.post("/verifyotp",verifyotp)
router.post("/changepassword",changePassword)
router.post("/logout",logout)

router.get("/checkauth",checkAuth)
module.exports=router