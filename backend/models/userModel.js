const mongoose=require("mongoose")
const userSchema=mongoose.Schema(
     {
    role: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Role",
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
    otp:{
        type:String
    }
  },
  {
    timestamps: true,
  }
     
);
const User=mongoose.model('User',userSchema);  

module.exports=User;