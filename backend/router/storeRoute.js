const express=require("express");
const router=express.Router();
const {getStoreManagers,createStore,getStores}=require("../controller/storeController")


router.get("/managers",getStoreManagers)
router.post("/createStore",createStore);
router.get("/getstores",getStores)

module.exports=router;