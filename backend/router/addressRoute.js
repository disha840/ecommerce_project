const express=require("express")
const {addAddress,getAddresses,deleteAddress,setDefaultAddress} =require("../controller/addressController")
const router=express.Router();
const auth = require("../middleware/authMiddleware");

router.post("/add",auth,addAddress)
router.get("/get",auth,getAddresses)
router.delete("/delete/:id",auth,deleteAddress)
router.patch("/set-default/:id", auth, setDefaultAddress);
module.exports=router