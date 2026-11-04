

const cloudinary = require("../cloudinary");
const Category = require("../models/categoryModel");

// CREATE CATEGORY
async function createCategory(req, res) {
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
        { folder: "categories" }
      );

      image = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    const category = await Category.create({
      name,
      slug,
      description,
      status,
      image
    });

    res.status(201).json({
      message: "Category created successfully",
      category
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}


// SHOW ALL CATEGORIES
async function showCategory(req, res) {
  try {
    const category = await Category.find().sort({
      createdAt: -1
    });

    res.status(200).send({
      category,
      message: "Fetch all categories successfully"
    });

  } catch (error) {
    res.status(500).send({
      message: "Internal server error"
    });
  }
}


// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).send({
        message: "Category not found"
      });
    }

    if (category.image?.public_id) {
      await cloudinary.uploader.destroy(
        category.image.public_id
      );
    }

    await Category.findByIdAndDelete(id);

    res.status(200).send({
      message: "Category deleted successfully"
    });

  } catch (error) {
    res.status(500).send({
      message: "Internal server error"
    });
  }
};


// VIEW SINGLE CATEGORY
const viewCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).send({
        message: "Category not found"
      });
    }

    res.status(200).send({
      category
    });

  } catch (error) {
    res.status(500).send({
      message: "Internal server error"
    });
  }
};


// SEARCH CATEGORY
const searchCategory = async (req, res) => {
  try {
    const search = req.query.search || "";

    const category = await Category.find({
      name: {
        $regex: search,
        $options: "i"
      }
    }).sort({
      createdAt: -1
    });

    res.status(200).send({
      category
    });

  } catch (error) {
    res.status(500).send({
      message: "Internal server error"
    });
  }
};


// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).send({
        message: "Category not found"
      });
    }

    if (req.files?.image) {
      const file = req.files.image;

      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        {
          folder: "categories"
        }
      );

      if (category.image?.public_id) {
        await cloudinary.uploader.destroy(
          category.image.public_id
        );
      }

      data.image = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    if (data.name) {
      data.slug = data.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).send({
      message: "Category updated successfully",
      category: updatedCategory
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Internal server error"
    });
  }
};


// TOGGLE CATEGORY STATUS
async function toggleStatus(req, res) {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send({
        message: "Category not found"
      });
    }

    category.status =
      category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await category.save();

    res.status(200).send({
      message: "Status updated successfully",
      category
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Internal server error"
    });
  }
}


module.exports = {
  createCategory,
  showCategory,
  deleteCategory,
  viewCategory,
  searchCategory,
  updateCategory,
  toggleStatus
};
