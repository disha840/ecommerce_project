

import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiUploadCloud, FiX } from "react-icons/fi";
import api from "../../api";

function AddVariant({ onClose, variant = null }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

  const [formData, setFormData] = useState({
    product: "",
    name: "",
    sku: "",
    barcode: "",
    unitValue: "",
    unit: "piece",
    mrp: "",
    sellingPrice: "",
    discountPercentage: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    images: [],
    status: "ACTIVE",
  });

  // Fetch products
  useEffect(() => {
    getProducts();
  }, []);

  // Fill form when editing
  useEffect(() => {
    if (variant) {
      setFormData({
        product: variant.product?._id || variant.product || "",
        name: variant.name || "",
        sku: variant.sku || "",
        barcode: variant.barcode || "",
        unitValue: variant.unitValue || "",
        unit: variant.unit || "piece",
        mrp: variant.mrp || "",
        sellingPrice: variant.sellingPrice || "",
        discountPercentage: variant.discountPercentage || "",
        weight: variant.weight || "",
        length: variant.length || "",
        width: variant.width || "",
        height: variant.height || "",
        images: [],
        status: variant.status || "ACTIVE",
      });

      setExistingImages(variant.images || []);
    }
  }, [variant]);

  async function getProducts() {
    try {
      const response = await api.get("/products/showproducts");

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data.product)) {
        setProducts(response.data.product);
      }
    } catch (error) {
      console.log("Products fetch error:", error);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleImageChange(event) {
    const selectedImages = Array.from(event.target.files);

    setFormData({
      ...formData,
      images: selectedImages,
    });
  }

  // Remove old image
  function removeExistingImage(index) {
    const updatedImages = existingImages.filter(
      (image, imageIndex) => imageIndex !== index
    );

    setExistingImages(updatedImages);
  }

  // Calculate discount
  function handlePriceChange(event) {
    const { name, value } = event.target;

    let updatedMrp = formData.mrp;
    let updatedSellingPrice = formData.sellingPrice;

    if (name === "mrp") {
      updatedMrp = value;
    }

    if (name === "sellingPrice") {
      updatedSellingPrice = value;
    }

    let discount = "";

    if (Number(updatedMrp) > 0 && updatedSellingPrice !== "") {
      discount = (
        ((Number(updatedMrp) - Number(updatedSellingPrice)) /
          Number(updatedMrp)) *
        100
      ).toFixed(2);
    }

    setFormData({
      ...formData,
      [name]: value,
      discountPercentage: discount,
    });
  }

  // Create or update variant
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("product", formData.product);
      data.append("name", formData.name);
      data.append("sku", formData.sku);
      data.append("barcode", formData.barcode);
      data.append("unitValue", formData.unitValue);
      data.append("unit", formData.unit);
      data.append("mrp", formData.mrp);
      data.append("sellingPrice", formData.sellingPrice);
      data.append("discountPercentage", formData.discountPercentage);
      data.append("weight", formData.weight);
      data.append("length", formData.length);
      data.append("width", formData.width);
      data.append("height", formData.height);
      data.append("status", formData.status);

      // Send images which should be kept
      data.append(
        "existingImages",
        JSON.stringify(existingImages.map((image) => image.url))
      );

      // Send newly selected images
      for (let i = 0; i < formData.images.length; i++) {
        data.append("images", formData.images[i]);
      }

      if (variant) {
        await api.put(
          `/productvariant/updatevariant/${variant._id}`,
          data
        );
      } else {
        await api.post("/productvariant/createvariant", data);
      }

      onClose();
    } catch (error) {
      console.log("Save variant error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm text-[#102A43] outline-none placeholder:text-[#627D98] focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20";

  const labelClass =
    "mb-2 block text-sm font-medium text-[#102A43]";

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-[#102A43]/40 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="my-auto w-full max-w-5xl rounded-2xl border border-[#D9E8EF] bg-[#F0FAFC] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-[#D9E8EF] bg-white p-3 text-[#087F95]"
          >
            <FiArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-[#102A43]">
              {variant ? "Edit Variant" : "Add Variant"}
            </h1>
            <p className="mt-1 text-sm text-[#627D98]">
              {variant
                ? "Update product variant information"
                : "Add a new variant for a product"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rounded-xl border border-[#D9E8EF] bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold text-[#102A43]">
              Variant Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Product */}
              <div className="md:col-span-2">
                <label className={labelClass}>Product *</label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variant Name */}
              <div>
                <label className={labelClass}>Variant Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 500g Pack"
                  className={inputClass}
                />
              </div>

              {/* SKU */}
              <div>
                <label className={labelClass}>SKU</label>
                <input
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter SKU"
                  className={inputClass}
                />
              </div>

              {/* Barcode */}
              <div>
                <label className={labelClass}>Barcode</label>
                <input
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Enter barcode"
                  className={inputClass}
                />
              </div>

              {/* Unit Value */}
              <div>
                <label className={labelClass}>Unit Value</label>
                <input
                  name="unitValue"
                  type="number"
                  value={formData.unitValue}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  className={inputClass}
                />
              </div>

              {/* Unit */}
              <div>
                <label className={labelClass}>Unit</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {["piece", "pack", "box", "set", "pair", "kg", "g", "mg", "l", "ml", "cm", "m"].map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              {/* MRP */}
              <div>
                <label className={labelClass}>MRP (₹)</label>
                <input
                  name="mrp"
                  type="number"
                  min="0"
                  value={formData.mrp}
                  onChange={handlePriceChange}
                  placeholder="Enter MRP"
                  className={inputClass}
                />
              </div>

              {/* Selling Price */}
              <div>
                <label className={labelClass}>Selling Price (₹)</label>
                <input
                  name="sellingPrice"
                  type="number"
                  min="0"
                  value={formData.sellingPrice}
                  onChange={handlePriceChange}
                  placeholder="Enter selling price"
                  className={inputClass}
                />
              </div>

              {/* Discount */}
              <div>
                <label className={labelClass}>Discount Percentage (%)</label>
                <input
                  value={formData.discountPercentage}
                  readOnly
                  className={inputClass}
                />
              </div>

              {/* Weight */}
              <div>
                <label className={labelClass}>Weight</label>
                <input
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Enter weight"
                  className={inputClass}
                />
              </div>

              {/* Length */}
              <div>
                <label className={labelClass}>Length</label>
                <input
                  name="length"
                  type="number"
                  value={formData.length}
                  onChange={handleChange}
                  placeholder="Length"
                  className={inputClass}
                />
              </div>

              {/* Width */}
              <div>
                <label className={labelClass}>Width</label>
                <input
                  name="width"
                  type="number"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="Width"
                  className={inputClass}
                />
              </div>

              {/* Height */}
              <div>
                <label className={labelClass}>Height</label>
                <input
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Images */}
            <div className="mt-7 border-t border-[#D9E8EF] pt-6">
              <label className={labelClass}>Variant Images</label>

              {/* Existing images */}
              {existingImages.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-4">
                  {existingImages.map((image, index) => (
                    <div key={image.public_id || index} className="relative">
                      <img
                        src={image.url}
                        alt="Variant"
                        className="h-24 w-24 rounded-lg border object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#22B8CF] bg-[#F8FCFD] px-6 py-8 hover:bg-[#EAF7FA]">
                <FiUploadCloud size={32} className="mb-3 text-[#087F95]" />
                <span className="text-sm font-medium text-[#102A43]">
                  Upload variant images
                </span>
                <span className="mt-1 text-xs text-[#627D98]">
                  Select one or more images
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <p className="mt-2 text-sm text-[#627D98]">
                {existingImages.length} existing, {formData.images.length} new images
              </p>

              {formData.images.map((image, index) => (
                <p key={index} className="mt-1 text-xs text-[#087F95]">
                  {image.name}
                </p>
              ))}
            </div>

            {/* Status */}
            <div className="mt-6">
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end gap-3 border-t border-[#D9E8EF] pt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-lg border border-[#D9E8EF] bg-white px-6 py-3 text-sm font-medium text-[#627D98]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#087F95] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : variant
                  ? "Update Variant"
                  : "Save Variant"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVariant;
