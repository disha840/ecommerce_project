const User=require("../models/userModel")
const crypto=require("crypto")
const mailer=require("../mailer")
const jwt = require("jsonwebtoken")
const bcrypt=require("bcrypt")
const Role=require("../models/roleModel")
const createUser=async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      status,
    } = req.body;


    if (!firstName) {
      return res.status(400).send({
        message: "first name is required"
      });
    }

    if (!email) {
      return res.status(400).send({
        message: "email is required"
      });
    }

    if ((!email.includes("@")) || (!email.includes("."))) {
      return res.status(400).send({
        message: "invalid email"
      });
    }


    if (!role) {
      return res.status(400).send({
        message: "role is required"
      });
    }

    
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).send({
        message: "user already exists"
      });
    }
  

 const passw=crypto.randomBytes(6).toString("hex")

const subject="your password for the mail"; 

const hashedPassword=await bcrypt.hash(passw,8);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
      status
    });
  
    const mail=await mailer(email,subject,`your password for the ${email}` ,passw); 

     if(!mail){ return res.status(400).send({message:"failed to send mail and password"}) } 

     const users=await User.find().sort({createdAt:-1})
    return res.status(201).send({users:users,
      message: "user created successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).send({
      message: "internal server error"
    });

  }
}

const getAllUser=async(req,res)=>{
  try{
      const super_admin = await Role.findOne({name:"super_admin"})
      const users=await User.find({role:{$ne:super_admin._id}}).sort({createdAt:-1}).populate("role","name");
      res.status(200).send({users:users,message:"fetch all users sucessfully"})
  }
  catch(error){
     res.status(500).send({message:"internal server error"})
  }
}

const viewUser=async(req,res)=>{
  try{
    const id=req.params.id;
    const user=await User.findOne({_id:id});
    if(!user){
      return res.send({message:"user not found"})
    }
    
    res.send({user:user})
  }
  catch(error){
  res.status(500).send({message:"internal server error"})
}
}

const updateUser=async(req,res)=>{
   try {
    const { firstName, lastName, email, phone, role, status } = req.body;
    if (!firstName) {
      return res.status(400).send({
        message: "first name is required"
      });
    }

    if (!email) {
      return res.status(400).send({
        message: "email is required"
      });
    }

    if ((!email.includes("@")) || (!email.includes("."))) {
      return res.status(400).send({
        message: "invalid email"
      });
    }


    if (!role) {
      return res.status(400).send({
        message: "role is required"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        phone,
        role,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

const deleteUser=async(req,res)=>{
  try{
    const id=req.params.id;
    const user=await User.findOneAndDelete({_id:id});
    if(!user){
      return res.status(404).send({message:"user not found"})
      
    }
    console.log(user)
    res.status(200).send({message:"user deleted sucessfully"})
  }
  catch(error){
    res.status(500).send({message:"internal server error"})
  }
}

const searchUser=async(req,res)=>{
  try{
   const search = req.query.search || "";

const super_admin = await Role.findOne({ name: "super_admin" });

const users = await User.find({
  ...(super_admin && { role: { $ne: super_admin._id } }),
  $or: [
    { firstName: { $regex: search, $options: "i" } },
    { lastName: { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } }
  ]
}).sort({ createdAt: -1 });

res.status(200).send({ users });
  }catch(error){
    res.status(500).send({message:"internal server error"})
  }
}

const getRole=async(req,res)=>{
  const getAllRole=await Role.find({name:{$ne:"super_admin"}});
  res.send({message:"get all role",status:true,getAllRole})
}


 async function toggleStatus(req,res){
   try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.status = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await user.save();

    res.status(200).send({
      message: "Status updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }

}

const customerSignup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
    } = req.body;

    // Check required fields
    if (!firstName || !email || !password) {
      return res.status(400).send({
        message: "First name, email and password are required",
      });
    }

    // Check email format
    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).send({
        message: "Invalid email",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).send({
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).send({
        message: "Email already registered",
      });
    }

    // Find customer role created manually from Admin Panel
    const customerRole = await Role.findOne({
      name: "customer",
    });

    if (!customerRole) {
      return res.status(404).send({
        message: "Customer role not found",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create customer
    const newCustomer = await User.create({
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : "",
      email: email.toLowerCase().trim(),
      phone,
      password: hashedPassword,
      role: customerRole._id,
      status: "ACTIVE",
    });

    return res.status(201).send({
      message: "Customer registered successfully",
      user: {
        id: newCustomer._id,
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        email: newCustomer.email,
      },
    });

  } catch (error) {
    console.log(error);

    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

const customerLogin = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({
        message: "email is required"
      });
    }

    if (!password) {
      return res.status(400).send({
        message: "password is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        message: "user not found"
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).send({
        message: "invalid password"
      });
    }

    const userRole = await User.findById(user._id).populate(
      "role",
      "name"
    );

    if (!userRole.role || userRole.role.name !== "customer") {
      return res.status(403).send({
        message: "only customers can login"
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).send({
        message: "your account is inactive"
      });
    }

    const clientToken = jwt.sign(
      {
        id: user._id,
        role: userRole.role.name
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.cookie("clientToken", clientToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).send({
      message: "login successful",
      status: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: userRole.role.name
      }
    });

  } catch (error) {

    console.log(error);

    return res.status(500).send({
      message: "internal server error"
    });
  }
};
const checkUserAuth = async (req, res) => {
  try {
    const token = req.cookies.clientToken;

    console.log(">>>>>>>>>token",token)

    if (!token) {
      console.log("hello")
      return res.status(200).json({
        user:null,message:"user not login"

      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded)
    if(!decoded){
     return  res.status(401).send({message:"access denied"})
    }
    // const user = await User.findById(decoded.id).select("-password");

      const user = await User.findById(decoded.id).populate(
      "role",
      "name"
    );

    

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("my user",user)

    return res.status(200).json({
      success: true,
      message: "User authenticated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name
      }
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports={createUser,getAllUser,viewUser,updateUser,deleteUser,searchUser,getRole,toggleStatus,customerSignup,customerLogin,checkUserAuth}
