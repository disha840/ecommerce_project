const express=require("express");
const router=express.Router();
const {createRole, getRoles, updateRole, deleteRole, viewRole}=require("../controller/roleController")
router.post("/createrole",createRole)
router.get("/showroles",getRoles)
router.put("/updaterole/:id",updateRole)
router.delete("/deleterole/:id",deleteRole);
router.get("/viewrole/:id",viewRole)
module.exports=router
