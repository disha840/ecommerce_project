const express=require("express");
const { createProductVariant } = require("../controller/variantController");
const router=express.Router();

router.post("/createvariant",createProductVariant)
module.exports=router;