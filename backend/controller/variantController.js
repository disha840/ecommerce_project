const ProductVariant = require("../models/productVariant");
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

    // 1. Required fields check karo
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Please select a product.",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Variant name is required.",
      });
    }

    if (!sku || !sku.trim()) {
      return res.status(400).json({
        success: false,
        message: "SKU is required. Please enter a SKU.",
      });
    }

    if (unitValue === undefined || unitValue === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter unit value.",
      });
    }

    if (!unit) {
      return res.status(400).json({
        success: false,
        message: "Please select a unit.",
      });
    }

    if (mrp === undefined || mrp === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter MRP.",
      });
    }

    if (sellingPrice === undefined || sellingPrice === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter selling price.",
      });
    }

    // 2. Number fields validate karo
    if (
      !Number.isFinite(Number(unitValue)) ||
      Number(unitValue) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Unit value must be greater than 0.",
      });
    }

    if (
      !Number.isFinite(Number(mrp)) ||
      Number(mrp) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "MRP must be a valid number greater than 0.",
      });
    }

    if (
      !Number.isFinite(Number(sellingPrice)) ||
      Number(sellingPrice) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Selling price must be 0 or greater.",
      });
    }

    if (Number(sellingPrice) > Number(mrp)) {
      return res.status(400).json({
        success: false,
        message: "Selling price cannot be greater than MRP.",
      });
    }

    if (
      discountPercentage !== undefined &&
      discountPercentage !== "" &&
      (
        !Number.isFinite(Number(discountPercentage)) ||
        Number(discountPercentage) < 0 ||
        Number(discountPercentage) > 100
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount percentage must be between 0 and 100.",
      });
    }

    // 3. Product exist karta hai ya nahi
    const Product = require("../models/productModel");
    const existingProduct = await Product.findById(product);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Selected product was not found. Please select another product.",
      });
    }

    // 4. SKU pehle se use toh nahi ho raha
    const existingSku = await ProductVariant.findOne({
      sku: sku.trim(),
    });

    if (existingSku) {
      return res.status(409).json({
        success: false,
        message: "This SKU already exists. Please enter a different SKU.",
      });
    }

    // 5. Images upload karo
    let images = [];

    if (req.files && req.files.images) {
      let uploadedImages = req.files.images;

      if (!Array.isArray(uploadedImages)) {
        uploadedImages = [uploadedImages];
      }

      for (let i = 0; i < uploadedImages.length; i++) {
        const image = uploadedImages[i];

        if (!image.mimetype.startsWith("image/")) {
          return res.status(400).json({
            success: false,
            message: "Only image files are allowed.",
          });
        }

        const result = await cloudinary.uploader.upload(
          image.tempFilePath,
          {
            folder: "productVariants",
          }
        );

        images.push(result.secure_url);
      }
    }

    // 6. Variant create karo
    const variant = await ProductVariant.create({
      product,
      name: name.trim(),
      sku: sku.trim(),
      barcode,
      unitValue: Number(unitValue),
      unit,
      mrp: Number(mrp),
      sellingPrice: Number(sellingPrice),
      discountPercentage:
        discountPercentage === "" ||
        discountPercentage === undefined
          ? 0
          : Number(discountPercentage),
      weight: weight === "" || weight === undefined
        ? 0
        : Number(weight),
      dimensions: {
        length: length || 0,
        width: width || 0,
        height: height || 0,
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
    console.log("Create Product Variant Error:", error);

    // Duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This SKU already exists. Please use a unique SKU.",
      });
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (item) => item.message
      );

      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    // Invalid MongoDB ID
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product or variant data. Please check your inputs.",
      });
    }

    // Cloudinary error
    if (
      error.message &&
      (
        error.message.toLowerCase().includes("cloudinary") ||
        error.message.toLowerCase().includes("upload")
      )
    ) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed. Please try uploading the image again.",
      });
    }

    // Other errors
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

module.exports = { createProductVariant };
