const express=require("express");
const { createSubcategory,ShowSubCategory, updateSubcategory } = require("../controller/subCatController");
const router=express.Router();

router.post("/createsubcategory",createSubcategory)
router.get("/showsubcategories",ShowSubCategory)
router.put("/updatesubcategory/:id",updateSubcategory)
module.exports=router;