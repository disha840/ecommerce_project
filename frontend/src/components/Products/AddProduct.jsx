

import React, { useState, useEffect } from "react";
import api from "../../api";

const AddProduct = ({ onClose, onCreated, product = null }) => {
  const isEdit = Boolean(product);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    description: "",
    category: "",
    subcategory: "",
    brand: "",
    isFeatured: false,
    isActive: true,
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputClass =
    "w-full rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] px-4 py-3 text-sm outline-none focus:border-[#B77B8C]";

  // Load existing product data when editing
  useEffect(() => {
    if (!product) return;

    setFormData({
      name: product.name || "",
      unit: product.unit || "",
      description: product.description || "",
      category:
        typeof product.category === "object"
          ? product.category?._id || ""
          : product.category || "",
      subcategory:
        typeof product.subcategory === "object"
          ? product.subcategory?._id || ""
          : product.subcategory || "",
      brand:
        typeof product.brand === "object"
          ? product.brand?._id || ""
          : product.brand || "",
      isFeatured: Boolean(product.isFeatured),
      isActive: product.isActive !== false,
    });

    const productImages = Array.isArray(product.images)
      ? product.images
      : [];

    setExistingImages(
      productImages
        .map((image) =>
          typeof image === "string"
            ? image
            : image?.url || image?.secure_url || image?.secureUrl
        )
        .filter(Boolean)
    );

    let productTags = product.tags || [];

    if (typeof productTags === "string") {
      try {
        productTags = JSON.parse(productTags);
      } catch {
        productTags = productTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
    }

    setTags(Array.isArray(productTags) ? productTags : []);
  }, [product]);

  // Fetch categories, subcategories and brands
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [categoryRes, subcategoryRes, brandRes] =
          await Promise.all([
            api.get("/category/showcategories"),
            api.get("/subcategory/showsubcategories"),
            api.get("/brands/showbrand"),
          ]);

        setCategories(
          categoryRes.data.categories ||
            categoryRes.data.category ||
            []
        );

        setSubcategories(
          subcategoryRes.data.subcategories ||
            subcategoryRes.data.subcategory ||
            []
        );

        setBrands(
          brandRes.data.brands || brandRes.data.brand || []
        );
      } catch (error) {
        console.log("Fetch options error:", error);
        setErrorMessage("Failed to load categories, subcategories or brands.");
      }
    }

    fetchOptions();
  }, []);

  // Handle form inputs
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Filter subcategories by selected category
  const filteredSubcategories = subcategories.filter((item) => {
    const parentId =
      typeof item.parentCategory === "object"
        ? item.parentCategory?._id
        : item.parentCategory;

    return String(parentId) === String(formData.category);
  });

  // Select multiple new images
  function handleImages(e) {
    const selectedImages = Array.from(e.target.files || []);

    setImages((prev) => {
      const combined = [...prev, ...selectedImages];

      return combined.filter(
        (image, index, arr) =>
          arr.findIndex(
            (item) =>
              item.name === image.name &&
              item.size === image.size &&
              item.lastModified === image.lastModified
          ) === index
      );
    });

    e.target.value = "";
  }

  // Remove newly selected image
  function handleRemoveImage(indexToRemove) {
    setImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }

  // Remove an existing image from the product
  function handleRemoveExistingImage(indexToRemove) {
    setExistingImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }

  // Add tags
  function handleAddTag(e) {
    e.preventDefault();

    const newTag = tagInput.trim();

    if (!newTag) return;

    if (
      tags.some(
        (tag) => tag.toLowerCase() === newTag.toLowerCase()
      )
    ) {
      setTagInput("");
      return;
    }

    setTags((prev) => [...prev, newTag]);
    setTagInput("");
  }

  // Remove tag
  function handleRemoveTag(indexToRemove) {
    setTags((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }

  // Create or update product
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.subcategory ||
      !formData.brand
    ) {
      setErrorMessage(
        "Please enter product name and select category, subcategory and brand."
      );
      return;
    }

    if (existingImages.length + images.length === 0) {
      setErrorMessage("Please select at least one product image.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name.trim());
      data.append("unit", formData.unit);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("subcategory", formData.subcategory);
      data.append("brand", formData.brand);
      data.append("tags", JSON.stringify(tags));
      data.append("isFeatured", String(formData.isFeatured));
      data.append("isActive", String(formData.isActive));

      // Keep existing images that were not removed
      data.append("existingImages", JSON.stringify(existingImages));

      // Add newly selected images
      images.forEach((image) => {
        data.append("images", image);
      });

      let response;

      if (isEdit) {
        response = await api.put(
          `/products/updateproduct/${product._id}`,
          data
        );
      } else {
        response = await api.post("/products/createproduct", data);
      }

      if (onCreated) {
        await onCreated();
      }

      onClose();
    } catch (error) {
      console.log(
        isEdit ? "Update product error:" : "Create product error:",
        error.response?.data || error
      );

      setErrorMessage(
        error.response?.data?.message ||
          (isEdit
            ? "Failed to update product."
            : "Failed to add product.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#713F50]">
              {isEdit ? "Edit Product" : "Add Product"}
            </h2>

            <p className="mt-1 text-sm text-[#A17B86]">
              {isEdit
                ? "Update your product details"
                : "Add a new product to your store"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-[#A17B86] hover:text-[#713F50]"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="mb-4 font-semibold text-[#713F50]">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Unit
                </label>

                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g. kg, piece, litre, pack"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter product description"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Category Information */}
          <div className="mb-6">
            <h3 className="mb-4 font-semibold text-[#713F50]">
              Category Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select Category</option>

                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Subcategory
                </label>

                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={!formData.category}
                  required
                >
                  <option value="">Select Subcategory</option>

                  {filteredSubcategories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Brand
                </label>

                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select Brand</option>

                  {brands.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="mb-6">
            <h3 className="mb-3 font-semibold text-[#713F50]">
              Product Images
            </h3>

            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-[#EBD9D9] bg-[#FFF9F6] p-8 text-center hover:border-[#B77B8C]">
              <div className="mb-3 text-4xl">🖼️</div>

              <p className="text-sm text-[#A17B86]">
                Click to select more images
              </p>

              <p className="mt-1 text-xs text-[#AD9299]">
                PNG, JPG or JPEG — select multiple images
              </p>

              <input
                type="file"
                multiple
                accept="image/png,image/jpeg"
                onChange={handleImages}
                className="hidden"
              />
            </label>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mt-4">
                <p className="mb-3 text-sm font-medium text-[#713F50]">
                  Existing Images
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {existingImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative overflow-hidden rounded-xl border border-[#EBD9D9]"
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="h-32 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveExistingImage(index)
                        }
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xl font-bold text-red-600 shadow-md"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image previews */}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="mb-3 text-sm font-medium text-[#713F50]">
                  New Images
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image, index) => (
                    <div
                      key={`${image.name}-${image.size}-${image.lastModified}`}
                      className="relative overflow-hidden rounded-xl border border-[#EBD9D9]"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className="h-32 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xl font-bold text-red-600 shadow-md"
                      >
                        &times;
                      </button>

                      <p className="truncate px-2 py-2 text-xs">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Tags */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-[#713F50]">
              Product Tags
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
                placeholder="Enter a tag"
                className={inputClass}
              />

              <button
                type="button"
                onClick={handleAddTag}
                className="shrink-0 rounded-xl bg-[#96566A] px-5 py-3 text-sm font-medium text-white hover:bg-[#713F50]"
              >
                Add Tag
              </button>
            </div>

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={`${tag}-${index}`}
                    className="flex items-center gap-2 rounded-full border border-[#EBD9D9] bg-[#FFF9F6] px-3 py-2 text-sm text-[#713F50]"
                  >
                    <span>{tag}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F0DDE1] text-base leading-none"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EBD9D9] p-4">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 accent-[#96566A]"
              />

              <div>
                <p className="text-sm font-medium">Featured Product</p>
                <p className="text-xs text-[#A17B86]">
                  Show in featured products
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EBD9D9] p-4">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 accent-[#96566A]"
              />

              <div>
                <p className="text-sm font-medium">Active Product</p>
                <p className="text-xs text-[#A17B86]">
                  Make product available
                </p>
              </div>
            </label>
          </div>

          {/* Error */}
          {errorMessage && (
            <p className="mb-4 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-[#F7E9E9] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#EBD9D9] px-5 py-3 text-sm font-medium text-[#713F50]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#96566A] px-6 py-3 text-sm font-medium text-white hover:bg-[#713F50] disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Product"
                : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
