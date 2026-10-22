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
const getRoles = async (req, res) => {
  try {
  
    const roles = await Role.find({name:{$ne:"super_admin"}}).sort({ createdAt: -1 });
    console.log("my roles",roles)

    return res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      roles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions, status } = req.body;

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    if (name !== undefined) role.name = name;
    if (permissions !== undefined) role.permissions = permissions;
    if (status !== undefined) role.status = status;

    await role.save();

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      role,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Role name already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const viewRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role fetched successfully",
      role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports={createRole,getRoles,updateRole,deleteRole,viewRole}