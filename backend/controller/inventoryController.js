
const Inventory = require("../models/inventoryModel");
const Store = require("../models/storeModel");
const mongoose = require("mongoose");
const Product=require("../models/productModel")
const Category=require("../models/categoryModel")
const Subcategory=require("../models/subcategoryModel")
const ProductVariant = require("../models/productVariant");


// CREATE INVENTORY
const createInventory = async (req, res) => {
    try {
        const {
            product,
            store,
            variant,
            quantity,
            reservedQuantity,
            reorderLevel,
            maxStockLevel
        } = req.body;
        console.log(req.body)

        if (!product || !store || !variant) {
            return res.status(400).json({
                success: false,
                message: "Product, Store and Variant are required"
            });
        }

        if (
            quantity === undefined || quantity === "" ||
            reservedQuantity === undefined || reservedQuantity === "" ||
            reorderLevel === undefined || reorderLevel === "" ||
            maxStockLevel === undefined || maxStockLevel === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "All stock fields are required"
            });
        }

        // CONVERT VALUES INTO NUMBERS
        const finalQuantity = Number(quantity);
        const finalReservedQuantity = Number(reservedQuantity);
        const finalReorderLevel = Number(reorderLevel);
        const finalMaxStockLevel = Number(maxStockLevel);

        // VALIDATE NON-NEGATIVE INTEGERS
        const values = [
            finalQuantity,
            finalReservedQuantity,
            finalReorderLevel,
            finalMaxStockLevel
        ];

        if (
            values.some(
                (value) =>
                    !Number.isFinite(value) ||
                    value < 0 ||
                    !Number.isInteger(value)
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Stock quantities must be valid non-negative integers"
            });
        }

        // RESERVED QUANTITY VALIDATION
        if (finalReservedQuantity > finalQuantity) {
            return res.status(400).json({
                success: false,
                message: "Reserved quantity cannot exceed total quantity"
            });
        }

        const existingStore = await Store.findById(store);

        if (!existingStore) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        // PREVENT DUPLICATE INVENTORY
        const existingInventory = await Inventory.findOne({
            product,
            store,
            variant
        });

        if (existingInventory) {
            return res.status(409).json({
                success: false,
                message: "Inventory already exists for this product and variant in this store"
            });
        }

        // CALCULATE AVAILABLE QUANTITY
        const availableQuantity =
            finalQuantity - finalReservedQuantity;

        // CREATE INVENTORY
        const inventory = await Inventory.create({
            product,
            store,
            variant,
            quantity: finalQuantity,
            reservedQuantity: finalReservedQuantity,
            reorderLevel: finalReorderLevel,
            maxStockLevel: finalMaxStockLevel,
            availableQuantity
        });

        return res.status(201).json({
            success: true,
            message: "Store inventory created successfully",
            inventory
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getInventories = async (req, res) => {
    try {
        // FETCH ALL STORES
        const stores = await Store.find()
            .select("name code address status")
            .sort({ createdAt: -1 });

        // FETCH ALL INVENTORIES
        const inventories = await Inventory.find()
            .populate("store", "name code")
            .populate("product", "name category brand")
            .populate("variant", "name sku unit unitValue mrp sellingPrice")
            .sort({ createdAt: -1 });

        // INVENTORY SUMMARY
        const inventorySummary = await Inventory.aggregate([
            {
                $group: {
                    _id: "$store",
                    totalProducts: {
                        $addToSet: "$product"
                    },
                    activeProducts: {
                        $addToSet: {
                            $cond: [
                                { $eq: ["$status", "active"] },
                                "$product",
                                null
                            ]
                        }
                    },
                    inactiveProducts: {
                        $addToSet: {
                            $cond: [
                                { $eq: ["$status", "inactive"] },
                                "$product",
                                null
                            ]
                        }
                    },
                    lowStockItems: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$status", "active"] },
                                        {
                                            $lte: [
                                                "$availableQuantity",
                                                "$reorderLevel"
                                            ]
                                        }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    totalRecords: {
                        $sum: 1
                    }
                }
            }
        ]);

        // CREATE SUMMARY MAP
        const summaryMap = new Map(
            inventorySummary.map((item) => [
                String(item._id),
                {
                    totalProducts: item.totalProducts.filter(Boolean).length,
                    activeProducts: item.activeProducts.filter(Boolean).length,
                    inactiveProducts: item.inactiveProducts.filter(Boolean).length,
                    lowStockItems: item.lowStockItems,
                    totalRecords: item.totalRecords
                }
            ])
        );

        // STORE WITH SUMMARY
        const result = stores.map((store) => ({
            ...store.toObject(),
            summary: summaryMap.get(String(store._id)) || {
                totalProducts: 0,
                activeProducts: 0,
                inactiveProducts: 0,
                lowStockItems: 0,
                totalRecords: 0
            }
        }));

        return res.status(200).json({
            success: true,
            count: inventories.length,
            stores: result,
            inventories
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getAvailableStoreInventory = async (req, res) => {
    try {
        const { storeId } = req.params;

        console.log("Store ID:", storeId);

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Store ID"
            });
        }

        const inventories = await Inventory.find({
            store: storeId,
            status: "active",
            availableQuantity: { $gt: 0 }
        })
        .populate("product", "name slug category brand images isFeatured isPopular")
        .populate("variant", "name slug sku unit unitValue mrp sellingPrice images")
        .sort({ createdAt: -1 });

        console.log("Inventories:", inventories);

        return res.status(200).json({
            success: true,
            count: inventories.length,
            inventories
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getStoreCategories = async (req, res) => {
    try {
        const { storeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Store ID"
            });
        }

        const existingStore = await Store.findById(storeId);

        if (!existingStore) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        // GET PRODUCTS AVAILABLE IN THIS STORE
        const productIds = await Inventory.find({
            store: storeId,
            status: "active",
            availableQuantity: { $gt: 0 }
        }).distinct("product");

        // GET CATEGORY IDS OF THOSE PRODUCTS
        const categoryIds = await Product.find({
            _id: { $in: productIds }
        }).distinct("category");

        // GET ACTIVE CATEGORIES
        const categories = await Category.find({
            _id: { $in: categoryIds },
            status: "ACTIVE"
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Store categories fetched successfully",
            count: categories.length,
            categories
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getStoreSubcategories = async (req, res) => {
    try {
        const { storeId, categorySlug } = req.params;

        console.log(">>>>>>>>>>>>")

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Store ID"
            });
        }

        const existingStore = await Store.findById(storeId);

        if (!existingStore) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        // CHECK CATEGORY USING SLUG
        const existingCategory = await Category.findOne({
            slug: categorySlug,
            // status: "ACTIVE"
        });

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // GET AVAILABLE PRODUCTS FROM STORE
        const productIds = await Inventory.find({
            store: storeId,
            status: "active",
            availableQuantity: { $gt: 0 }
        }).distinct("product");

        // GET SUBCATEGORIES OF AVAILABLE PRODUCTS
        const subcategoryIds = await Product.find({
            _id: { $in: productIds },
            category: existingCategory._id
        }).distinct("subcategory");

        // GET ACTIVE SUBCATEGORIES
        const subcategories = await Subcategory.find({
            _id: { $in: subcategoryIds },
            status: "ACTIVE"
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Store subcategories fetched successfully",
            count: subcategories.length,
            subcategories
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



const getStoreSubcategoryProducts = async (req, res) => {
    try {
        const { storeId, slug } = req.params;

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Store ID"
            });
        }

        const existingStore = await Store.findById(storeId);

        if (!existingStore) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        const existingSubcategory = await Subcategory.findOne({
            slug: slug,
            status: "ACTIVE"
        });

        if (!existingSubcategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found"
            });
        }

        // GET AVAILABLE PRODUCTS FROM SELECTED STORE
        const productIds = await Inventory.find({
            store: storeId,
            status: "active",
            availableQuantity: { $gt: 0 }
        }).distinct("product");

        // GET PRODUCTS OF SELECTED SUBCATEGORY
        const products = await Product.find({
            _id: { $in: productIds },
            subcategory: existingSubcategory._id
        })
            .populate("category", "name")
            .populate("subcategory", "name")
            .populate("brand", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Subcategory products fetched successfully",
            count: products.length,
            products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSearchSuggestions = async (req, res) => {
    try {
        const { storeId, q } = req.query;

        // Validate Store ID
        if (!storeId || !mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Valid Store ID is required"
            });
        }

        // Validate search query
        const searchQuery = String(q || "").trim();

        if (!searchQuery) {
            return res.status(200).json({
                success: true,
                categories: [],
                products: []
            });
        }

        if (searchQuery.length > 80) {
            return res.status(400).json({
                success: false,
                message: "Search query is too long"
            });
        }

        if (searchQuery.length < 2) {
            return res.status(200).json({
                success: true,
                categories: [],
                products: []
            });
        }

        // Check active store
        const store = await Store.findOne({
            _id: storeId,
            status: "active"
        }).select("_id");

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Active store not found"
            });
        }

        // Escape regex
        const escapeRegex = (value) =>
            value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const searchRegex = new RegExp(
            escapeRegex(searchQuery),
            "i"
        );

        const storeObjectId = new mongoose.Types.ObjectId(storeId);

        // Search available products in selected store
        const availableProducts = await Inventory.aggregate([
            {
                $match: {
                    store: storeObjectId,
                    status: "active",
                    availableQuantity: { $gt: 0 }
                }
            },
            {
                $lookup: {
                    from: Product.collection.name,
                    localField: "product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $match: {
                    "product.isActive": true
                }
            },
            {
                $lookup: {
                    from: ProductVariant.collection.name,
                    localField: "variant",
                    foreignField: "_id",
                    as: "variant"
                }
            },
            { $unwind: "$variant" },
            {
                $match: {
                    "variant.status": "ACTIVE",
                    $expr: {
                        $eq: ["$variant.product", "$product._id"]
                    },
                    $or: [
                        { "product.name": searchRegex },
                        { "variant.name": searchRegex }
                    ]
                }
            },
            {
                $lookup: {
                    from: Category.collection.name,
                    localField: "product.category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: "$product._id",
                    name: "$product.name",
                    slug: "$product.slug",
                    images: "$product.images",

                    category: {
                        $cond: [
                            { $ifNull: ["$category._id", false] },
                            {
                                _id: "$category._id",
                                name: "$category.name",
                                slug: "$category.slug"
                            },
                            null
                        ]
                    },

                    variant: {
                        _id: "$variant._id",
                        name: "$variant.name",
                        slug: "$variant.slug",
                        sku: "$variant.sku",
                        unit: "$variant.unit",
                        unitValue: "$variant.unitValue",
                        mrp: "$variant.mrp",
                        sellingPrice: "$variant.sellingPrice",
                        images: "$variant.images"
                    },

                    availableQuantity: 1
                }
            },
            { $sort: { name: 1 } },
            { $limit: 10 }
        ]);

        // Get categories having available products in this store
        const availableCategoryIds = await Inventory.aggregate([
            {
                $match: {
                    store: storeObjectId,
                    status: "active",
                    availableQuantity: { $gt: 0 }
                }
            },
            {
                $lookup: {
                    from: Product.collection.name,
                    localField: "product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $match: {
                    "product.isActive": true
                }
            },
            {
                $lookup: {
                    from: ProductVariant.collection.name,
                    localField: "variant",
                    foreignField: "_id",
                    as: "variant"
                }
            },
            { $unwind: "$variant" },
            {
                $match: {
                    "variant.status": "ACTIVE",
                    $expr: {
                        $eq: ["$variant.product", "$product._id"]
                    }
                }
            },
            {
                $group: {
                    _id: "$product.category"
                }
            }
        ]);

        const categoryIds = availableCategoryIds
            .map(item => item._id)
            .filter(Boolean);

        // Search categories
        const categories = await Category.find({
            _id: { $in: categoryIds },
            name: searchRegex
        })
            .select("_id name slug image")
            .limit(10)
            .lean();

        return res.status(200).json({
            success: true,
            message: "Search suggestions fetched successfully",
            categories,
            products: availableProducts
        });

    } catch (error) {
        return handleResponseError(error, res);
    }
};



module.exports = {
    createInventory,getInventories,getAvailableStoreInventory,getStoreCategories,getStoreSubcategories,getStoreSubcategoryProducts,getSearchSuggestions
};
