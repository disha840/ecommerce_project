const Store=require("../models/storeModel.js");
const User=require("../models/userModel.js")

// CREATE STORE

// GET STORE MANAGERS
 const getStoreManagers = async (req, res) => {
  try {
    const managers = await User.find()
      .populate("role");

    const storeManagers = managers.filter(
      (user) => user.role?.name === "store_manager"
    );

    res.status(200).json({
      success: true,
      managers: storeManagers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createStore = async (req, res) => {
  try {
    const {
      name,
      code,
      manager,
      phone,
      address,
      location,
      serviceRadius,
      status,
    } = req.body;

    const store = await Store.create({
      name,
      code,
      manager,
      phone,
      address,
      location,
      serviceRadius,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getStores = async (req, res) => {
  try {
    const stores = await Store.find()
      .populate("manager", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Stores fetched successfully",
      stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByIdAndDelete(id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Store deleted successfully"
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
module.exports={createStore,getStoreManagers,getStores,deleteStore}