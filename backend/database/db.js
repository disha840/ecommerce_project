const mongoose=require("mongoose");

mongoose.connect(process.env.mongodb_atlas_uri)
.then(()=>{
    console.log("mongodb connect sucessfully")
})
.catch((err)=>{
    console.log(err)
})
