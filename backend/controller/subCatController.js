const cloudinary=require("../cloudinary");
const Subcategory=require("../models/subcategoryModel");
const Category = require("../models/categoryModel");

const createSubcategory = async (req, res) => {
  try {
    const { name, description, parentCategory } = req.body;

    // Validate required fields
    if (!name || !parentCategory || !req.files?.image) {
      return res.status(400).json({
        message: "Name, parent category and image are required",
      });
    }

    // Check parent category exists
    const category = await Category.findById(parentCategory);

    if (!category) {
      return res.status(404).json({
        message: "Parent category not found",
      });
    }

    // Generate slug
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check duplicate slug
    const existingSubcategory = await Subcategory.findOne({ slug });

    if (existingSubcategory) {
      return res.status(409).json({
        message: "Subcategory with this name already exists",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        folder: "subcategories",
      }
    );

    const subcategory = await Subcategory.create({
      name: name.trim(),
      slug,
      description,
      parentCategory,
      image: result.secure_url,
      public_id:result.public_id
    });

    return res.status(201).json({
      message: "Subcategory created successfully",
      subcategory,
    });
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Subcategory slug already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create subcategory",
      error: error.message,
    });
  }
};
const ShowSubCategory=async(req,res)=>{
    try{
          const subcategory=await Subcategory.find().sort({createdAt:-1}).populate("parentCategory", "name");
          res.status(200).send({subcategory:subcategory,message:"fetch all subcategories sucessfully"})
      }
      catch(error){
         res.status(500).send({message:"internal server error"})
      }
}
const updateSubcategory = async (req, res) => {
  try {
    const { name, description, parentCategory } = req.body;

    const subcategory = await Subcategory.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({
        message: "Subcategory not found",
      });
    }

    subcategory.name = name;
    subcategory.description = description;
    subcategory.parentCategory = parentCategory;

    // Update image only if a new image was uploaded
    if (req.files?.image) {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        { folder: "subcategories" }
      );

      subcategory.image = result.secure_url;
    }

    await subcategory.save();

    res.status(200).json({
      message: "Subcategory updated successfully",
      subcategory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

async function viewSubCategory(req,res){
  try{
      const id=req.params.id;
      const subcategory=await Subcategory.findOne({_id:id}).populate("parentCategory");
      if(!subcategory){
        return res.send({message:"subcategory not found"})
      }
      res.send({subcategory:subcategory})
    }
    catch(error){
      console.log(error)
    res.status(500).send({error:error})
  }

}
const deleteSubCategory=async(req,res)=>{
  try{
    const id=req.params.id;
    const subcategory=await Subcategory.findById(id);
  
    if(!subcategory){
      return res.status(404).send({message:"subcategory not found"})
      
    }
      if (subcategory.public_id) {
          await cloudinary.uploader.destroy(subcategory.public_id);
        }
        await Subcategory.findByIdAndDelete(id);
    console.log(subcategory)
    res.status(200).send({message:"subcategory deleted sucessfully"})
  }
  catch(error){
    res.status(500).send({message:"internal server error"})
  }
}


module.exports = {
  createSubcategory,ShowSubCategory,updateSubcategory,viewSubCategory,deleteSubCategory
};
