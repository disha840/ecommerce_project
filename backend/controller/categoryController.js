
const cloudinary =require("../cloudinary")
const Category=require("../models/categoryModel")
async function createCategory(req,res){
    try{
         const { name, description, status } = req.body;
          const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");
      let image = "";
       if (req.files?.image) {
      const file = req.files.image;

      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        { folder: "categories" }
      );
      image = result.secure_url;
    }
    const category = await Category.create({
      name,
      slug,
      description,
      status,
      image,
    });
    res.status(201).json({
      message: "Category created successfully",
      category,
    });

    }
    catch(error){
         res.status(500).json({
      message: error.message,
    });
  }
}

async function showCategory(req,res){
try{
      const category=await Category.find().sort({createdAt:-1});
      res.status(200).send({category:category,message:"fetch all categories sucessfully"})
  }
  catch(error){
     res.status(500).send({message:"internal server error"})
  }
}

const deleteCategory=async(req,res)=>{
  try{
    const id=req.params.id;
    const category=await Category.findOneAndDelete({_id:id});
  
    if(!category){
      return res.status(404).send({message:"category not found"})
      
    }
    console.log(category)
    res.status(200).send({message:"category deleted sucessfully"})
  }
  catch(error){
    res.status(500).send({message:"internal server error"})
  }
}

const viewCategory=async(req,res)=>{
  try{
    const id=req.params.id;
    const category=await Category.findOne({_id:id});
    if(!category){
      return res.send({message:"category not found"})
    }
    res.send({category:category})
  }
  catch(error){
  res.status(500).send({message:"internal server error"})
}

}
const searchCategory=async(req,res)=>{
   try{
      const search=req.query.search||"";
      const users=await Category.find({
          name:{$regex:search,$options:"i"} 
      }).sort({createdAt: -1})
      res.status(200).send({users})
    }catch(error){
      res.status(500).send({message:"internal server error"})
    }
  }
  const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).send({
        message: "Category not found",
      });
    }

    if (req.files?.image) {
      const image = req.files.image;

      const result = await cloudinary.uploader.upload(
        image.tempFilePath,
        {
          folder: "categories",
        }
      );

      data.image = result.secure_url;
    }

    const c = await Category.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return res.status(200).send({
      message: "Category updated successfully",
      category: c,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

async function toggleStatus(req,res){
   try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send({ message: "category not found" });
    }

    category.status = category.status == "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await category.save();

    res.status(200).send({
      message: "Status updated successfully",
      category,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Internal server error" });
  }

}

module.exports={createCategory,showCategory,deleteCategory,viewCategory,searchCategory,updateCategory,toggleStatus}