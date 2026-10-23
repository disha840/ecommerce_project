const User=require("../models/userModel")
const bcrypt = require("bcrypt")
const mailer=require("../mailer")
const jwt = require("jsonwebtoken")
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password,role } = req.body;
      console.log(req.body)
    if (!firstName) {
      return res.send({
        message: "first name is required"
      });
    }

    if (!lastName) {
      return res.send({
        message: "last name is required"
      });
    }

    if (!email) {
      return res.send({
        message: "email is required"
      });
    }

    if ((!email.includes("@")) || (!email.includes("."))) {
      return res.send({
        message: "invalid email"
      });
    }

    if (!password) {
      return res.send({
        message: "password is required"
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.send({
        message: "user already exist"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const u = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role:role
    });

    console.log(u);

    return res.status(201).send({
      message: "user created successfully"
    });

  } catch (err) {

    console.log(err);

    return res.status(500).send({
      message: "internal server error"
    });

  }
}

const login = async (req, res) => {
  try {

    const { email, password } = req.body;
    console.log(email)
    // return

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
// console.log(user)
// return
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

    const token = jwt.sign(
      {
        id: user._id,
        role:user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).send({
      message: "login successful",status:true
    });

  } catch (error) {

    console.log(error);

    return res.status(500).send({
      message: "internal server error"
    });
  }
};

const generateotp=async(req,res)=>{
    try{
        const {email}=req.body;
    if(!email){
        return res.status(400).send({message:"email is required"})
    }
    if((!email.includes("@"))||(!email.includes("."))){
        return res.status(400).send({message:"invalid email"})
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).send({message:"user not found"});
    }

    const otp=Math.ceil((Math.random()*9000)+1000);
   
    const u=await User.updateOne({email:email},{$set:{otp:otp}})
     const mail=await mailer(email,"otp verify",otp);
    if(!mail){
        return res.status(400).send({message:"otp not sent"});
    }
    
    res.status(200).send({email:email,message:"otp sent sucessfully"})
    }
    catch(error){
        res.status(500).send({message:"failed to sent otp"})
    }}
    
 const resendOtop=async(req,res)=>{
    try{
        const {email}=req.body;
    if(!email){
        return res.status(400).send({message:"email is required"})
    }
    if((!email.includes("@"))||(!email.includes("."))){
        return res.status(400).send({message:"invalid email"})
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).send({message:"user not found"});
    }

    const otp=Math.ceil((Math.random()*9000)+1000);
    const mail=await mailer(email,"otp verify","otp",otp);
    if(!mail){
        return res.status(400).send({message:"otp not sent"});
    }
    const u=await User.updateOne({email:email},{$set:{otp:otp}})
    
    res.status(200).send({email:email,message:"otp sent sucessfully"})
    }
    catch(error){
        res.status(500).send({message:"failed to sent otp"})
    }} 
    
    
    const verifyotp=async(req,res)=>{
    const {email,otp}=req.body;
    console.log(email,otp)
    try{
        if(!email){
        return res.status(400).send({message:"email is required"})
    }
    if((!email.includes("@"))||(!email.includes("."))){
        return res.status(400).send({message:"invalid email"})
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).send({message:"user not found"});
    }
    if(otp!=user.otp){
        return res.status(400).send("invalid otp")
    }
    res.status(200).send({email:email,message:"otp match sucessfully"})
    }
    catch(error){
        res.send({message:"internal server error"})
    }
   
}

const changePassword=async(req,res)=>{
    const {email,password}=req.body;
   
    try{
        if(!email){
        return res.status(400).send({message:"email is required"})
    }
    if((!email.includes("@"))||(!email.includes("."))){
        return res.status(400).send({message:"invalid email"})
    }
    if(!password){
        return res.status(400).send({message:"password is require"})
    }
    const user = await User.findOne({email});
    if(!user){
       return res.status(400).send({message:"user not found"})
    }
    const hassedPassword = await bcrypt.hash(password,8);

     user.password = hassedPassword;

    await user.save();
    console.log(user)
    res.status(200).send({email:email,message:"password change sucessfully"});
    }
    catch(error){
         res.status(500).send({message:"failed to change password"})
    }
}

const getdata=(req,res)=>{
    const token=req.cookies.token;
    if (!token) {
    return res.status(200).json({
        message: "Token not provided"
    });
}
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    console.log("decoded",decoded)
  
    if(!decoded){
     return  res.status(401).send({message:"access denied"})
    }
    
   return res.send({decoded:decoded,status:true})
}

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

module.exports={signup,login,generateotp,resendOtop,verifyotp,changePassword,getdata,logout}