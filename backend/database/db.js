const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/project")
.then(()=>{
    console.log("mongodb connect sucessfully")
})
.catch((err)=>{
    console.log(err)
})
