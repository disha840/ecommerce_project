
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Subcategory = require("../models/subcategoryModel");
const Brand = require("../models/brandModel");
const cloudinary = require("../cloudinary");
const mongoose = require("../database/db");

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

    if (!name?.trim() || !category || !brand) {
      return res.status(400).json({
        message: "Name, category and brand are required",
      });
    }

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

    if (subcategory) {
      const subcategoryExists = await Subcategory.findById(subcategory);

      if (!subcategoryExists) {
        return res.status(404).json({
          message: "Subcategory not found",
        });
      }
    }

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

    let tags = [];

    if (req.body.tags) {
      tags = JSON.parse(req.body.tags);
    }

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

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

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

    // Get existing images
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

      // Convert URL strings into objects using old product image data
      imagesToKeep = imagesToKeep.map((image) => {
        if (typeof image === "string") {
          const oldImage = product.images.find(
            (item) => item.url === image
          );

          return oldImage
            ? {
                url: oldImage.url,
                public_id: oldImage.public_id,
              }
            : null;
        }

        return image;
      }).filter(Boolean);
    }

    // Upload new images
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
          public_id: result.public_id,
        });
      }
    }

    // Find removed images
    const removedImages = product.images.filter((oldImage) => {
      return !imagesToKeep.some(
        (image) => image.public_id === oldImage.public_id
      );
    });

    // Delete removed images from Cloudinary
    for (const image of removedImages) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
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
};

const viewProduct = async (req, res) => {
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
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    for (const image of product.images) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

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

const showProductsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    const products = await Product.find({
      subcategory: subcategoryId,
      isActive: true,
    })
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Subcategory products fetched successfully",
      products,
    });

  } catch (error) {
    console.log("Show subcategory products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
const showFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true,
    })
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Featured products fetched successfully",
      products,
    });

  } catch (error) {
    console.log("Show featured products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  showProducts,
  updateProduct,
  viewProduct,
  deleteProduct,
  showProductsBySubcategory,
  showFeaturedProducts
};
