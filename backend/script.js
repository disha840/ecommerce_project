const express=require("express");
require("dotenv").config()
const fileUpload=require("express-fileupload")
const mongoose=require("./database/db")
const cors=require("cors");
const userRoute=require("./router/userRoute")
const adminRoute=require("./router/adminRoute")
const cookieParser=require("cookie-parser")
const categoryRoute=require("./router/categoryRoute")
const roleRoute=require("./router/rolesRoute")
const brandRoute=require("./router/brandRoute")
const app=express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.use(fileUpload({ useTempFiles: true }))

app.use("/api",userRoute)
app.use("/admin",adminRoute)
app.use("/category",categoryRoute)
app.use("/brands",brandRoute)
app.use("/role",roleRoute)
app.listen(3000,()=>{
    console.log("server is running");
})