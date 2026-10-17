const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "Active"
    }
  },
  { timestamps: true }
);


const Category = mongoose.model("Category", categorySchema);
module.exports = Category;