const cloudinary = require("../cloudinary");
const Brand = require("../models/brandModel");

async function createBrand(req, res) {
  try {
    const { name, description, status } = req.body;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    let image = {
      url: "",
      public_id: ""
    };

    if (req.files?.image) {
      const file = req.files.image;

      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        { folder: "brands" }
      );

      image = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    const brand = await Brand.create({
      name,
      slug,
      description,
      status,
      image
    });

    return res.status(201).json({
      message: "Brand created successfully",
      brand
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
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

const deleteBrand = async (req, res) => {
  try {
    const id = req.params.id;

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).send({
        message: "Brand not found"
      });
    }

    // Delete image from Cloudinary
    if (brand.image?.public_id) {
      const result = await cloudinary.uploader.destroy(
        brand.image.public_id
      );

      if (
        result.result !== "ok" &&
        result.result !== "not found"
      ) {
        throw new Error("Failed to delete brand image from Cloudinary");
      }
    }

    // Delete brand from MongoDB
    await Brand.findByIdAndDelete(id);

    return res.status(200).send({
      message: "Brand deleted successfully"
    });
  } catch (error) {
    console.error("Delete brand error:", error);

    return res.status(500).send({
      message: error.message || "Internal server error"
    });
  }
};

const viewBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "brand not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "brand fetched successfully",
      brand,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({

      success: false,
      message: error.message,
    });
  }
};

module.exports = { createBrand ,showBrand,deleteBrand,viewBrand};