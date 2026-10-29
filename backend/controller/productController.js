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
    } = req.body;

    // Validate required fields
    if (!name?.trim() || !category || !brand) {
      return res.status(400).json({
        message: "Name, category and brand are required",
      });
    }

    // Check category and brand
    const categoryExists = await Category.findById(category);
    const brandExists = await Brand.findById(brand);

    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (!brandExists) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    // Check subcategory only if provided
    if (subcategory) {
      const subcategoryExists = await Subcategory.findById(subcategory);

      if (!subcategoryExists) {
        return res.status(404).json({
          message: "Subcategory not found",
        });
      }
    }

    // Upload images
    let files = req.files?.images;

    if (!files) {
      return res.status(400).json({
        message: "Please upload at least one product image",
      });
    }

    if (!Array.isArray(files)) {
      files = [files];
    }

    const uploadedImages = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "products",
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    // Get tags
    let tags = [];

    if (req.body.tags) {
      tags = JSON.parse(req.body.tags);
    }

    // Generate slug
    const baseSlug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (await Product.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create product
    const product = await Product.create({
      name: name.trim(),
      slug,
      description,
      category,
      subcategory: subcategory || null,
      brand,
      unit,
      images: uploadedImages,
      tags: Array.isArray(tags) ? tags : [],
      isFeatured: req.body.isFeatured === "true",
      isActive: req.body.isActive === "true",
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.log("Create product error:", error);

    res.status(500).json({
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

        uploadedImages.push({
  url: result.secure_url,
  public_id: result.public_id
});
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
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      console.log("Public ID:", image.public_id);

      if (image.public_id) {
        const result = await cloudinary.uploader.destroy(
          image.public_id
        );

        console.log("Cloudinary result:", result);
      }
    }

    // Delete product from MongoDB
    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.log("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { createProduct ,showProducts,updateProduct,viewProduct,deleteProduct};