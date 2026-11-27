const express=require("express");
require("dotenv").config()
const fileUpload=require("express-fileupload")
const mongoose=require("./database/db")
const cors=require("cors");
const userRoute=require("./router/userRoute")
const adminRoute=require("./router/adminRoute")
const cookieParser=require("cookie-parser")
const productRoute=require("./router/productRoute")
const categoryRoute=require("./router/categoryRoute")
const productvariantRoute=require("./router/productVariant")
const roleRoute=require("./router/rolesRoute")
const brandRoute=require("./router/brandRoute")
const subcategoryRoute=require("./router/subcategoryRoute")
const storeRoute=require("./router/storeRoute")
const cartRoute=require("./router/cartRoute");
const addressRoute=require("./router/addressRoute")
const inventoryRoute=require("./router/inventoryRoute")
const orderRoutes=require("./router/orderRoute")
const deliveryPartnerRoute=require("./router/deliveryPartner")
const wishlistRoute=require("./router/wishlistRoute")
const bannerRoute=require("./router/bannerRoute")
const app=express();

// app.use(cors({
//     origin:"*",
//     credentials: true
// }))
app.use(cors({
    origin: [
        "https://ecommerce-project-jade.vercel.app",
        "https://ecommerce-project-git-main-quick-kart2.vercel.app",
        "http://localhost:5173",
        "http://localhost:4000",
        "https://ecommerce-project-wwsg.vercel.app"
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT ||3000;


app.use("/ping", (_, res) => {
    return res.status(200).json({ message: "Ok" })
})
app.use(fileUpload({ useTempFiles: true }))

app.use("/api",userRoute)
app.use("/admin",adminRoute)
app.use("/category",categoryRoute)
app.use("/brands",brandRoute)
app.use("/role",roleRoute)
app.use("/subcategory",subcategoryRoute)
app.use("/products",productRoute);
app.use("/productvariant",productvariantRoute)
app.use("/cart",cartRoute)
app.use("/store",storeRoute);
app.use("/address",addressRoute)
app.use("/order", orderRoutes);
app.use("/inventory",inventoryRoute)
app.use("/deliverypartner",deliveryPartnerRoute)
app.use("/wishlist",wishlistRoute)
app.use("/banner",bannerRoute)

app.listen(PORT,()=>{
    console.log("server is running");
})