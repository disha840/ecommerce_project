import React from "react";
import { useState,useEffect } from "react";
import api from "../../api";


const AddProduct = ({ onClose }) => {

const [categories, setCategories] = useState([]);
const [subcategories, setSubcategories] = useState([]);
const [brands, setBrands] = useState([]);

async function getCategories() {
  try {
    const response = await api.get("/category/showcategories");
    // console.log(response.data)
    setCategories(response.data.category);
  } catch (error) {
    console.log(error);
  }
}

async function getSubcategories() {
  try {
    const response = await api.get("/subcategory/showsubcategories");
    // console.log(response.data)
    setSubcategories(response.data.subcategory);
  } catch (error) {
    console.log(error);
  }
}

async function getBrands() {
  try {
    const response = await api.get("/brands/showbrand");
    setBrands(response.data.brand);
  } catch (error) {
    console.log(error);
  }
}
useEffect(() => {
  getCategories();
  getSubcategories();
  getBrands();
}, []);
  const inputClass =
    "w-full rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] px-4 py-3 text-sm outline-none focus:border-[#B77B8C]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#713F50]">Add Product</h2>
            <p className="mt-1 text-sm text-[#A17B86]">
              Add a new product to your store
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
                placeholder="Enter product name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Unit</label>
              <input
                type="text"
                placeholder="e.g. kg, piece, litre, pack"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
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
              <select className={inputClass} defaultValue="">
              <option value="">Select Category</option>
                           {categories?.map((item) => (
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
              <select className={inputClass} defaultValue="">
                 <option value="">Select Subcategory</option>
                             {subcategories?.map((item) => (
                     <option key={item._id} value={item._id}>
                              {item.name}
                                   </option>
                                ))}
                          </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Brand</label>
              <select className={inputClass} defaultValue="">
                    <option value="">Select Brand</option>
                             {brands?.map((item) => (
                      <option key={item._id} value={item._id}>
                            {item.name}
                                </option>
                                  ))}
                             </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-[#713F50]">Product Images</h3>

          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-[#EBD9D9] bg-[#FFF9F6] p-8 text-center hover:border-[#B77B8C]">
            <div className="mb-3 text-4xl">🖼️</div>
            <p className="text-sm text-[#A17B86]">
              Click to upload product images
            </p>
            <p className="mt-1 text-xs text-[#AD9299]">PNG, JPG or JPEG</p>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg"
              className="hidden"
            />
          </label>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">Tags</label>
          <input
            type="text"
            placeholder="e.g. organic, fresh, popular"
            className={inputClass}
          />
        </div>

        {/* Settings */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EBD9D9] p-4">
            <input type="checkbox" className="h-4 w-4 accent-[#96566A]" />
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
              defaultChecked
              className="h-4 w-4 accent-[#96566A]"
            />
            <div>
              <p className="text-sm font-medium">Active Product</p>
              <p className="text-xs text-[#A17B86]">Make product available</p>
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t border-[#F7E9E9] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#EBD9D9] px-5 py-3 text-sm font-medium text-[#713F50] hover:bg-[#FFF9F6]"
          >
            Cancel
          </button>

          <button
            type="button"
            className="rounded-xl bg-[#96566A] px-6 py-3 text-sm font-medium text-white hover:bg-[#713F50]"
          >
            Save Product
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddProduct;