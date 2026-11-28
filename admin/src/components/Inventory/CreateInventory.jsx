


import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import api from "../../api";
import { toast } from "react-toastify";

function CreateInventory({ onClose, inventory, isEdit }) {

    const [stores, setStores] = useState([]);
    const [products, setProducts] = useState([]);
    const [variants, setVariants] = useState([]);

    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        store: "",
        product: "",
        variant: "",
        quantity: "",
        reservedQuantity: 0,
        reorderLevel: 10,
        maxStockLevel: 100,
        status: "active"
    });

    // FETCH ALL STORES
    useEffect(() => {
        async function fetchStores() {
            try {
                const response = await api.get("/store/getstores");

                setStores(
                    response.data.stores ||
                    response.data.store ||
                    []
                );

            } catch (error) {
                console.log("Fetch stores error:", error);
            }
        }

        fetchStores();
    }, []);

    // FETCH ALL PRODUCTS
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await api.get("/products/showproducts");

                setProducts(
                    response.data.products ||
                    response.data.product ||
                    []
                );

            } catch (error) {
                console.log("Fetch products error:", error);
            }
        }

        fetchProducts();
    }, []);

    // FILL FORM DATA WHEN EDITING
    useEffect(() => {

        if (isEdit && inventory) {

            setFormData({
                store: inventory.store?._id || inventory.store || "",
                product: inventory.product?._id || inventory.product || "",
                variant: inventory.variant?._id || inventory.variant || "",
                quantity: inventory.quantity ?? "",
                reservedQuantity: inventory.reservedQuantity ?? 0,
                reorderLevel: inventory.reorderLevel ?? 10,
                maxStockLevel: inventory.maxStockLevel ?? 100,
                status: inventory.status || "active"
            });

        } else {

            setFormData({
                store: "",
                product: "",
                variant: "",
                quantity: "",
                reservedQuantity: 0,
                reorderLevel: 10,
                maxStockLevel: 100,
                status: "active"
            });

        }

    }, [inventory, isEdit]);

    // FETCH VARIANTS ACCORDING TO SELECTED PRODUCT
    useEffect(() => {

        async function fetchVariants() {

            if (!formData.product) {
                setVariants([]);
                return;
            }

            try {
                const response = await api.get(
                    `/productvariant/getallvariants/${formData.product}`
                );

                setVariants(response.data.variants || []);

            } catch (error) {
                console.log("Fetch variants error:", error);
                setVariants([]);
            }
        }

        fetchVariants();

    }, [formData.product]);

    // HANDLE INPUT CHANGE
    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "product" ? { variant: "" } : {})
        }));

        if (name === "product") {
            setVariants([]);
        }
    }

    // CREATE / UPDATE INVENTORY
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setSubmitting(true);

            let response;

            if (isEdit && inventory?._id) {

                // UPDATE INVENTORY API
                response = await api.put(
                    `/inventory/updateinventory/${inventory._id}`,
                    formData
                );

                toast.success(
                    response.data.message || "Inventory updated successfully"
                );

            } else {

                // CREATE INVENTORY API
                response = await api.post(
                    "/inventory/createinventory",
                    formData
                );

                toast.success(
                    response.data.message || "Inventory created successfully"
                );

            }

            onClose();

        } catch (error) {

            console.error("Save Inventory Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to save inventory"
            );

        } finally {
            setSubmitting(false);
        }
    }

    const inputClass =
        "w-full rounded-lg border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm text-[#102A43] outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20";

    const labelClass =
        "mb-2 block text-sm font-medium text-[#102A43]";

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#102A43]/40 p-4 backdrop-blur-sm"
            onClick={onClose}
        >

            <div
                className="my-auto w-full max-w-3xl rounded-2xl border border-[#D9E8EF] bg-[#F0FAFC] p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >

                {/* HEADER */}
                <div className="mb-6 flex items-center gap-3">

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-[#D9E8EF] bg-white p-3 text-[#087F95]"
                    >
                        <FiArrowLeft size={20} />
                    </button>

                    <div>
                        <h1 className="text-2xl font-bold text-[#102A43]">
                            {isEdit ? "Edit Inventory" : "Create Inventory"}
                        </h1>

                        <p className="mt-1 text-sm text-[#627D98]">
                            {isEdit
                                ? "Update your store product stock"
                                : "Add product stock to your store"}
                        </p>
                    </div>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="rounded-xl border border-[#D9E8EF] bg-white p-6">

                        <h2 className="mb-5 text-lg font-semibold text-[#102A43]">
                            Inventory Information
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* STORE */}
                            <div>
                                <label className={labelClass}>
                                    Store *
                                </label>

                                <select
                                    name="store"
                                    value={formData.store}
                                    onChange={handleChange}
                                    required
                                    disabled={isEdit}
                                    className={inputClass}
                                >
                                    <option value="">Select Store</option>

                                    {stores.map((store) => (
                                        <option
                                            key={store._id}
                                            value={store._id}
                                        >
                                            {store.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* PRODUCT */}
                            <div>
                                <label className={labelClass}>
                                    Product *
                                </label>

                                <select
                                    name="product"
                                    value={formData.product}
                                    onChange={handleChange}
                                    required
                                    disabled={isEdit}
                                    className={inputClass}
                                >
                                    <option value="">Select Product</option>

                                    {products.map((product) => (
                                        <option
                                            key={product._id}
                                            value={product._id}
                                        >
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* VARIANT */}
                            <div>
                                <label className={labelClass}>
                                    Product Variant *
                                </label>

                                <select
                                    name="variant"
                                    value={formData.variant}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.product || isEdit}
                                    className={inputClass}
                                >
                                    <option value="">Select Variant</option>

                                    {variants.map((variant) => (
                                        <option
                                            key={variant._id}
                                            value={variant._id}
                                        >
                                            {variant.name}
                                        </option>
                                    ))}

                                    {/* Keep selected variant visible while editing */}
                                    {isEdit &&
                                        inventory?.variant &&
                                        !variants.some(
                                            (variant) =>
                                                variant._id === formData.variant
                                        ) && (
                                            <option value={formData.variant}>
                                                {inventory.variant.name || "Selected Variant"}
                                            </option>
                                        )}
                                </select>
                            </div>

                            {/* QUANTITY */}
                            <div>
                                <label className={labelClass}>
                                    Quantity *
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    min="0"
                                    step="1"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter quantity"
                                    className={inputClass}
                                />
                            </div>

                            {/* RESERVED QUANTITY */}
                            <div>
                                <label className={labelClass}>
                                    Reserved Quantity
                                </label>

                                <input
                                    type="number"
                                    name="reservedQuantity"
                                    min="0"
                                    step="1"
                                    value={formData.reservedQuantity}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* REORDER LEVEL */}
                            <div>
                                <label className={labelClass}>
                                    Reorder Level
                                </label>

                                <input
                                    type="number"
                                    name="reorderLevel"
                                    min="0"
                                    step="1"
                                    value={formData.reorderLevel}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* MAX STOCK */}
                            <div>
                                <label className={labelClass}>
                                    Maximum Stock Level
                                </label>

                                <input
                                    type="number"
                                    name="maxStockLevel"
                                    min="0"
                                    step="1"
                                    value={formData.maxStockLevel}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            {/* STATUS */}
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                        </div>

                        {/* BUTTONS */}
                        <div className="mt-8 flex justify-end gap-3 border-t border-[#D9E8EF] pt-6">

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={submitting}
                                className="rounded-lg border border-[#D9E8EF] bg-white px-6 py-3 text-sm font-medium text-[#627D98] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-lg bg-[#087F95] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#066778] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting
                                    ? "Please Wait..."
                                    : isEdit
                                    ? "Update Inventory"
                                    : "Create Inventory"}
                            </button>

                        </div>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default CreateInventory;
