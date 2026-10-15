const mongoose=require("mongoose")
const userAddressSchema =mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["HOME", "WORK", "OTHER"],
      default: "HOME",
    },

    name: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    houseNumber: {
      type: String,
      trim: true,
    },

    street: {
      type: String,
      trim: true,
    },

    landmark: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    pincode: {
      type: String,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const UserAddress= mongoose.model("UserAddress", userAddressSchema);
module.exports=UserAddress;