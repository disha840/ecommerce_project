const express = require("express");
const router = express.Router();

const { createBrand, showBrand, deleteBrand, viewBrand } = require("../controller/brandController");

router.post("/createbrand", createBrand);
router.get("/showbrand",showBrand)
router.delete("/deletebrand/:id",deleteBrand);
router.get("/viewbrand/:id",viewBrand)
module.exports = router;