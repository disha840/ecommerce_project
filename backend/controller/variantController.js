const ProductVariant = require("../models/productVariant");

    const Product = require("../models/productModel");
const cloudinary = require("../cloudinary")


const createProductVariant = async (req, res) => {
  try {
    const {
      product,
      name,
      sku,
      barcode,
      unitValue,
      unit,
      mrp,
      sellingPrice,
      discountPercentage,
      weight,
      length,
      width,
      height,
      status,
    } = req.body;

    // Check required fields
    if (!product || !name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product and variant name are required.",
      });
    }

    // Check whether product exists
    const existingProduct = await Product.findById(product);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
      const existingVariant = await ProductVariant.findOne({
               product: product,
               name: name.trim()
                });

if (existingVariant) {
  return res.status(400).json({
    success: false,
    message: "This variant already exists."
  });
}

    // Upload images
    let images = [];

    if (req.files && req.files.images) {
      let uploadedImages = req.files.images;

      if (!Array.isArray(uploadedImages)) {
        uploadedImages = [uploadedImages];
      }

      for (let image of uploadedImages) {
        if (!image.mimetype.startsWith("image/")) {
          return res.status(400).json({
            success: false,
            message: "Only image files are allowed.",
          });
        }

        const uploadedImage = await cloudinary.uploader.upload(
          image.tempFilePath,
          {
            folder: "productVariants",
          }
        );

        images.push(uploadedImage.secure_url);
      }
    }
  

    // Create product variant
    const variant = await ProductVariant.create({
      product,
      name: name.trim(),
      sku,
      barcode,
      unitValue: Number(unitValue),
      unit,
      mrp: Number(mrp),
      sellingPrice: Number(sellingPrice),
      discountPercentage: Number(discountPercentage) || 0,
      weight: Number(weight) || 0,
      dimensions: {
        length: Number(length) || 0,
        width: Number(width) || 0,
        height: Number(height) || 0,
      },
      images,
      status: status || "ACTIVE",
    });

    return res.status(201).json({
      success: true,
      message: "Product variant created successfully.",
      variant,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create product variant.",
    });
  }
};
const getProductVariants = async (req, res) => {
  try {
    const variants = await ProductVariant.find()
      .populate("product", "name")
      .sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      variants
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get product variants."
    });
  }
};

module.exports = { createProductVariant,getProductVariants };