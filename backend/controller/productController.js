const Product =require("../models/productModel")
const Category = require("../models/categoryModel");
const Subcategory = require("../models/subcategoryModel");
const Brand = require("../models/brandModel");
const cloudinary=require("../cloudinary")
const mongoose=require("../database/db")
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      brand,
      unit,
      isFeatured,
      isActive,
    } = req.body;

    // Validate required fields
    if (!name?.trim() || !category || !subcategory || !brand) {
      return res.status(400).json({
        success: false,
        message: "Name, category, subcategory and brand are required",
      });
    }

    // Validate MongoDB IDs
    const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);

    if (![category, subcategory, brand].every(isValidId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category, subcategory or brand ID",
      });
    }

    // Check that category, subcategory and brand exist
    const [categoryExists, subcategoryExists, brandExists] =
      await Promise.all([
        Category.findById(category),
        Subcategory.findById(subcategory),
        Brand.findById(brand),
      ]);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!subcategoryExists) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    if (!brandExists) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // Ensure subcategory belongs to selected category
    const parentCategoryId =
      subcategoryExists.parentCategory?._id?.toString() ||
      subcategoryExists.parentCategory?.toString();

    if (parentCategoryId !== category) {
      return res.status(400).json({
        success: false,
        message: "Subcategory does not belong to the selected category",
      });
    }

    // Handle multiple images
    let files = req.files?.images;

    if (!files) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one product image",
      });
    }

    // express-fileupload returns an object for one file
    // and an array for multiple files
    if (!Array.isArray(files)) {
      files = [files];
    }

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(
          file.tempFilePath,
          {
            folder: "products",
            resource_type: "image",
          }
        );

        return result.secure_url;
      })
    );

    // Parse tags
    let tags = [];

    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Tags must be a valid JSON array",
        });
      }
    }

    if (!Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: "Tags must be an array",
      });
    }

    // Generate slug from product name
    const baseSlug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (await Product.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Save product in MongoDB
    const product = await Product.create({
      name: name.trim(),
      slug,
      description,
      category,
      subcategory,
      brand,
      unit,
      images: uploadedImages,
      tags: tags.map((tag) => String(tag).trim()).filter(Boolean),
      isFeatured: req.body.isFeatured === "true",
      isActive: req.body.isActive === "true",
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};
const showProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.log("Show products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const updateProduct=async(req,res)=>{
 try {
    const { id } = req.params;

    // Check valid MongoDB ID
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid product ID",
    //   });
    // }

    // Find existing product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      unit,
      description,
      category,
      subcategory,
      brand,
      tags,
      isFeatured,
      isActive,
      existingImages,
    } = req.body;

    // Update normal fields
    if (name !== undefined) product.name = name;
    if (unit !== undefined) product.unit = unit;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (brand !== undefined) product.brand = brand;

    if (tags !== undefined) {
      product.tags =
        typeof tags === "string" ? JSON.parse(tags) : tags;
    }

    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    if (isActive !== undefined) {
      product.isActive = isActive === "true" || isActive === true;
    }

    // Preserve images that the user has kept
    let imagesToKeep = product.images || [];

    if (existingImages !== undefined) {
      imagesToKeep =
        typeof existingImages === "string"
          ? JSON.parse(existingImages)
          : existingImages;

      if (!Array.isArray(imagesToKeep)) {
        return res.status(400).json({
          success: false,
          message: "Invalid existing images",
        });
      }
    }


    let uploadedImages = [];

    if (req.files?.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      for (const file of files) {
        const result = await cloudinary.uploader.upload(
          file.tempFilePath,
          { folder: "products" }
        );

        uploadedImages.push(result.secure_url);
      }
    }

    // Keep old images + add new images
    product.images = [...imagesToKeep, ...uploadedImages];

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
}

const viewProduct=async(req,res)=>{
     try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("brand", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { createProduct ,showProducts,updateProduct,viewProduct,deleteProduct};