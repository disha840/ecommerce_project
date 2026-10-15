const express=require("express");
const router=express.Router()
const {createCategory, showCategory, deleteCategory,viewCategory,searchCategory,updateCategory,toggleStatus}=require("../controller/categoryController");



router.post("/createcategory",createCategory)
router.get("/showcategories",showCategory)
router.get("/viewcategory/:id",viewCategory)
router.get("/searched",searchCategory)
router.delete("/deletecategory/:id",deleteCategory)
router.put("/updatecategory/:id",updateCategory)
router.put("/toggle-status/:id",toggleStatus)
module.exports=router
