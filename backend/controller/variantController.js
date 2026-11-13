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
const slug = name
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

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

       images.push({
            url: uploadedImage.secure_url,
           public_id: uploadedImage.public_id
           });
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
      slug
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

const deleteProductVariant = async (req, res) => {
  try {
    const id = req.params.id;

    // Find variant
    const variant = await ProductVariant.findById(id);

    if (!variant) {
      return res.status(404).json({
        message: "Product variant not found",
      });
    }

    const publicIds = (variant.images || [])
      .map((image) => image.public_id)
      .filter((publicId) => publicId);

    // Delete all images from Cloudinary
    for (const publicId of publicIds) {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== "ok" && result.result !== "not found") {
        throw new Error(`Failed to delete Cloudinary image: ${publicId}`);
      }
    }

    // Delete variant from MongoDB
    await ProductVariant.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Product variant deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
async function getVariants(req,res){
try{
  const {slug}=req.params;
  const product=await Product.findOne({slug});
  if (!product) {
      return res.status(404).send({
        message: "Product not found"
      });
    }
    const variants=await ProductVariant.find({product:product._id});
    res.status(200).send({
       success: true,
      variants: variants
    });
}
catch(err){
  console.log(err)
  res.status(500).send({
      message: err.message
    });
}
}
async function getAllVariants(req, res) {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        }

        const variants = await ProductVariant.find({
            product: product._id
        });

        res.status(200).send({
            success: true,
            variants: variants
        });

    } catch (err) {
        console.log(err);

        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

const getOneVariant = async (req, res) => {
  try {
    const { slug } = req.params;

    const variant = await ProductVariant.findOne({ slug });

    if (!variant) {
      return res.status(404).send({
        message: "Variant not found",
      });
    }

    res.status(200).send({
      variant,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};


const updateProductVariant = async (req, res) => {
    try {
        const { id } = req.params;

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
            existingImages
        } = req.body;

        // Find variant
        const variant = await ProductVariant.findById(id);

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found"
            });
        }

        // Check product
        const parentProduct = await Product.findById(product);

        if (!parentProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check duplicate variant
        const duplicateVariant = await ProductVariant.findOne({
            product: product,
            name: name,
            _id: { $ne: id }
        });

        if (duplicateVariant) {
            return res.status(400).json({
                success: false,
                message: "Variant already exists for this product"
            });
        }

        // Existing images received from frontend
        let keptImageUrls = [];

        if (existingImages !== undefined) {
            keptImageUrls = JSON.parse(existingImages);
        } else {
            keptImageUrls = variant.images.map(image => image.url);
        }

        // Filter images which should remain
        const oldImages = variant.images.filter(image =>
            keptImageUrls.includes(image.url)
        );

        // New images upload
        let uploadedImages = [];

        if (req.files && req.files.images) {
            let images = req.files.images;

            if (!Array.isArray(images)) {
                images = [images];
            }

            for (let i = 0; i < images.length; i++) {

                const result = await cloudinary.uploader.upload(
                    images[i].tempFilePath,
                    {
                        folder: "productVariants"
                    }
                );

                uploadedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }

        // Find removed images
        const removedImages = variant.images.filter(image =>
            !keptImageUrls.includes(image.url)
        );

        // Update all fields
        variant.product = product;
        variant.name = name;
        variant.sku = sku;
        variant.barcode = barcode;
        variant.unitValue = unitValue;
        variant.unit = unit;
        variant.mrp = mrp;
        variant.sellingPrice = sellingPrice;
        variant.discountPercentage = discountPercentage;
        variant.weight = weight;
        variant.length = length;
        variant.width = width;
        variant.height = height;
        variant.status = status;

        // Old images + New images
        variant.images = [
            ...oldImages,
            ...uploadedImages
        ];

        await variant.save();

        // Delete removed images from Cloudinary
        for (let i = 0; i < removedImages.length; i++) {
            if (removedImages[i].public_id) {
                await cloudinary.uploader.destroy(
                    removedImages[i].public_id
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Variant updated successfully",
            variant
        });

    } catch (error) {
        console.log("Update variant error:", error);

        return res.status(500).json({
            success: false,
            message: "Error updating variant",
            error: error.message
        });
    }
};
const viewVariant = async (req, res) => {
  try {
    const { id } = req.params;

    const variant = await ProductVariant.findById(id)
      .populate("product", "name");

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    return res.status(200).json({
      success: true,
      variant,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = { createProductVariant,getProductVariants,deleteProductVariant,getVariants,getOneVariant,updateProductVariant ,viewVariant,getAllVariants};