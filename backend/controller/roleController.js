const Role=require("../models/roleModel")

const createRole=async(req,res)=>{
    try{
        const {name ,permissions,status}=req.body;
        if (!name) {
      return res.status(400).json({
        message: "Role name is required",
      });
    }
     const existingRole = await Role.findOne({ name });
      if (existingRole) {
      return res.status(400).json({
        message: "Role already exists",
      });
    }
    const role = await Role.create({
      name,
      permissions,
      status,
    });

    res.status(201).json({
      message: "Role created successfully",
      role,
    });
    
    }
    catch(error){
        res.status(500).json({
      message: error.message,
    });

    }
}
module.exports={createRole}