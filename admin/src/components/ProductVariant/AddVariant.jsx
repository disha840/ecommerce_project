

import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import api from "../../api";

function AddVariant({ onClose }) {

  // Products store karne ke liye
  const [products, setProducts] = useState([]);

  // Form ki saari values
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

  const [loading, setLoading] = useState(false);

  // Step 1: Backend se products lana
  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    try {
      const response = await api.get("/products/showproducts");

      // API response ke according products set karna
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

  // Step 2: Input change hone par formData update karna
  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Step 3: Images select karna
  function handleImageChange(event) {
    const selectedImages = Array.from(event.target.files);

    setFormData({
      ...formData,
      images: selectedImages,
    });
  }

  // Step 4: Discount calculate karna
  function handlePriceChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    let updatedMrp = formData.mrp;
    let updatedSellingPrice = formData.sellingPrice;

    if (name === "mrp") {
      updatedMrp = value;
    }

    if (name === "sellingPrice") {
      updatedSellingPrice = value;
    }

    let discount = "";

    if (
      Number(updatedMrp) > 0 &&
      updatedSellingPrice !== ""
    ) {
      discount =
        (
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

  // Step 5: Variant create karna
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
      data.append(
        "discountPercentage",
        formData.discountPercentage
      );
      data.append("weight", formData.weight);
      data.append("length", formData.length);
      data.append("width", formData.width);
      data.append("height", formData.height);
      data.append("status", formData.status);

      for (let i = 0; i < formData.images.length; i++) {
        data.append("images", formData.images[i]);
      }

      // IMPORTANT:
      // Is URL ko apne actual backend create route se match karna.
      await api.post("/productvariant/createvariant", data);

      console.log("Form data ready:", formData);

      alert("Form ready hai. Ab actual create API route connect karna hai.");
    } catch (error) {
      console.log("Create variant error:", error);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[#EBD9D9] px-4 py-3 text-sm outline-none focus:border-[#96566A]";

  const labelClass =
    "mb-2 block text-sm font-medium text-[#713F50]";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-5xl rounded-xl bg-[#FFF9F6] p-6">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#EBD9D9] bg-white p-3 text-[#713F50]"
          >
            <FiArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-[#713F50]">
              Add Variant
            </h1>
            <p className="mt-1 text-sm text-[#A17B86]">
              Add a new variant for a product
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="rounded-xl border border-[#EBD9D9] bg-white p-6">

            <h2 className="mb-5 text-lg font-semibold text-[#713F50]">
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

                  {products.map(function (product) {
                    return (
                      <option
                        key={product._id}
                        value={product._id}
                      >
                        {product.name}
                      </option>
                    );
                  })}
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
                  <option value="piece">piece</option>
                  <option value="pack">pack</option>
                  <option value="box">box</option>
                  <option value="set">set</option>
                  <option value="pair">pair</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="mg">mg</option>
                  <option value="l">l</option>
                  <option value="ml">ml</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                </select>
              </div>

              {/* MRP */}
              <div>
                <label className={labelClass}>MRP (₹)</label>
                <input
                  name="mrp"
                  type="number"
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
                  value={formData.sellingPrice}
                  onChange={handlePriceChange}
                  placeholder="Enter selling price"
                  className={inputClass}
                />
              </div>

              {/* Discount */}
              <div>
                <label className={labelClass}>
                  Discount Percentage (%)
                </label>
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
            <div className="mt-7 border-t border-[#EBD9D9] pt-6">
              <label className={labelClass}>Variant Images</label>

              <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#EBD9D9] bg-[#FFF9F6] px-6 py-8">
                <FiUploadCloud
                  size={32}
                  className="mb-3 text-[#96566A]"
                />
                <span className="text-sm text-[#713F50]">
                  Upload variant images
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <p className="mt-2 text-sm text-[#A17B86]">
                {formData.images.length} images selected
              </p>
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
            <div className="mt-8 flex justify-end gap-3 border-t border-[#EBD9D9] pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#EBD9D9] px-6 py-3 text-sm text-[#713F50]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#96566A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#713F50]"
              >
                {loading ? "Saving..." : "Save Variant"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVariant;
