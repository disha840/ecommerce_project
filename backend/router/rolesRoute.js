const express=require("express");
const router=express.Router();
const {createRole}=require("../controller/roleController")
router.post("/createrole",createRole)
module.exports=router
