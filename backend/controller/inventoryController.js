
const Inventory = require("../models/Inventory");
const Store = require("../models/Store");

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

        // CHECK STORE
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

        // INVENTORY SUMMARY
        const inventorySummary = await Inventory.aggregate([
            {
                $group: {
                    _id: "$store",

                    // UNIQUE PRODUCTS
                    totalProducts: {
                        $addToSet: "$product"
                    },

                    // UNIQUE ACTIVE PRODUCTS
                    activeProducts: {
                        $addToSet: {
                            $cond: [
                                { $eq: ["$status", "active"] },
                                "$product",
                                null
                            ]
                        }
                    },

                    // UNIQUE INACTIVE PRODUCTS
                    inactiveProducts: {
                        $addToSet: {
                            $cond: [
                                { $eq: ["$status", "inactive"] },
                                "$product",
                                null
                            ]
                        }
                    },

                    // LOW STOCK ITEMS
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

                    // TOTAL INVENTORY RECORDS
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

        // RETURN ALL STORES
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
            count: result.length,
            stores: result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createInventory,getInventories
};
