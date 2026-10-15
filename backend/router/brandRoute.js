const express = require("express");
const router = express.Router();

const { createBrand, showBrand, deleteBrand } = require("../controller/brandController");

router.post("/createbrand", createBrand);
router.get("/showbrand",showBrand)
router.delete("/deletebrand/:id",deleteBrand)
module.exports = router;