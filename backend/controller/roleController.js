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
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const filter = { name: { $ne: "super_admin" } };

    const totalRoles = await Role.countDocuments(filter);

    const roles = await Role.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      roles,
      currentPage: page,
      totalPages: Math.ceil(totalRoles / limit),
      totalRoles,
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

 async function toggleStatus(req,res){
   try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).send({ message: "role not found" });
    }

    role.status = role.status === "Active" ? "Inactive" : "Active";

    await role.save();

    res.status(200).send({
      message: "Status updated successfully",
      role,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }

}
const searchRole = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const filter = {
      name: {
        $ne: "super_admin",
        $regex: search,
        $options: "i",
      },
    };

    const totalRoles = await Role.countDocuments(filter);

    const roles = await Role.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      roles,
      currentPage: page,
      totalPages: Math.ceil(totalRoles / limit),
      totalRoles,
    });

  } catch (error) {
    console.log("Search roles error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports={createRole,getRoles,updateRole,deleteRole,viewRole,toggleStatus,searchRole}