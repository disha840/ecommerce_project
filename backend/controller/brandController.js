const cloudinary = require("../cloudinary");
const Brand = require("../models/brandModel");

async function createBrand(req, res) {
  try {
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
        { folder: "brands" }
      );

      image = result.secure_url;
    }

    const brand = await Brand.create({
      name,
      slug,
      description,
      status,
      image,
    });

    res.status(201).json({
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
async function showBrand(req,res){
try{
      const brand=await Brand.find();
      res.status(200).send({brand:brand,message:"fetch all brand sucessfully"})
  }
  catch(error){
     res.status(500).send({message:"internal server error"})
  }
}
const deleteBrand=async(req,res)=>{
  try{
    const id=req.params.id;
    const brand=await Brand.findOneAndDelete({_id:id});
    if(!brand){
      return res.status(404).send({message:"brand not found"})
      
    }

    res.status(200).send({message:"brand deleted sucessfully"})
  }
  catch(error){
    res.status(500).send({message:"internal server error"})
  }
}

module.exports = { createBrand ,showBrand,deleteBrand};