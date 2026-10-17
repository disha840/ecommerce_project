const express=require("express");
const { createSubcategory,ShowSubCategory, updateSubcategory, viewSubCategory, deleteSubCategory } = require("../controller/subCatController");
const router=express.Router();

router.post("/createsubcategory",createSubcategory)
router.get("/showsubcategories",ShowSubCategory)
router.put("/updatesubcategory/:id",updateSubcategory)
router.get("/viewsubcategory/:id",viewSubCategory)
router.delete("/deletesubcategory/:id",deleteSubCategory)
module.exports=router;
