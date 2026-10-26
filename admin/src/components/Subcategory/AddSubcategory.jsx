import React, { useEffect, useState } from "react";
import { FiX, FiImage } from "react-icons/fi";
import api from "../../api";

const AddSubcategory = ({ onClose, getdata, editData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await api.get("/category/showcategories");
        setCategories(response.data.category || []);
      } catch (error) {
        console.log(error.message);
      }
    }

    getCategories();
  }, []);

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setDescription(editData.description || "");

      setParentCategory(
        editData.parentCategory?._id ||
          editData.parentCategory ||
          ""
      );

      setImage(null);
    } else {
      setName("");
      setDescription("");
      setParentCategory("");
      setImage(null);
    }

    setError("");
  }, [editData]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("parentCategory", parentCategory);

      if (image) {
        formData.append("image", image);
      }

      if (editData) {
        await api.put(
          `/subcategory/updatesubcategory/${editData._id}`,
          formData
        );
      } else {
        await api.post(
          "/subcategory/createsubcategory",
          formData
        );
      }

      await getdata();
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#102A43]/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-2xl">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#D9E8EF] bg-[#EAF7FA] p-5">
          <div>
            <h2 className="text-xl font-bold text-[#102A43]">
              {editData ? "Edit Subcategory" : "Add Subcategory"}
            </h2>

            <p className="mt-1 text-sm text-[#627D98]">
              {editData
                ? "Update subcategory information"
                : "Add a new subcategory"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-[#627D98] transition hover:bg-[#D7F2F6] hover:text-[#087F95]"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
        >
          {/* Subcategory Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Subcategory Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter subcategory name"
              className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm text-[#102A43] outline-none transition placeholder:text-[#9FB3C8] focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter subcategory description"
              rows={3}
              className="w-full resize-y rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm text-[#102A43] outline-none transition placeholder:text-[#9FB3C8] focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20"
            />
          </div>

          {/* Parent Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Parent Category
            </label>

            <select
              value={parentCategory}
              onChange={(event) => setParentCategory(event.target.value)}
              className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm text-[#102A43] outline-none transition focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20"
              required
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Subcategory Image
            </label>

            <div className="rounded-xl border border-dashed border-[#22B8CF]/50 bg-[#F8FCFD] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D7F2F6] text-[#087F95]">
                  <FiImage size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#102A43]">
                    Choose an image
                  </p>
                  <p className="mt-1 text-xs text-[#627D98]">
                    PNG, JPEG or WEBP
                  </p>
                </div>
              </div>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  setImage(event.target.files[0] || null)
                }
                className="mt-4 w-full text-sm text-[#627D98] file:mr-4 file:rounded-lg file:border-0 file:bg-[#D7F2F6] file:px-4 file:py-2 file:font-medium file:text-[#087F95] hover:file:bg-[#C5EAF0]"
              />

              {image && (
                <p className="mt-2 break-all text-xs text-[#087F95]">
                  Selected: {image.name}
                </p>
              )}

              {!image && editData?.image && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-[#627D98]">
                    Current Image
                  </p>

                  <img
                    src={editData.image}
                    alt="Current subcategory"
                    className="h-20 w-20 rounded-lg border border-[#D9E8EF] object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Footer Buttons */}
          <div className="flex shrink-0 justify-end gap-3 border-t border-[#D9E8EF] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#D9E8EF] bg-white px-5 py-2.5 text-sm font-medium text-[#627D98] transition hover:bg-[#F0FAFC] hover:text-[#102A43]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#087F95] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#066779] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22B8CF] focus-visible:ring-offset-2"
            >
              {editData ? "Update Subcategory" : "Create Subcategory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubcategory;