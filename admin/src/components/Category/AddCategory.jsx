
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const AddCategory = ({ onClose, getdata, editData }) => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    status: "ACTIVE",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // FILL FORM FOR EDIT
  useEffect(() => {
    if (editData) {
      setFormData({
        category: editData.name || "",
        description: editData.description || "",
        status: editData.status || "ACTIVE",
      });
    } else {
      setFormData({
        category: "",
        description: "",
        status: "ACTIVE",
      });
    }

    setImage(null);
  }, [editData]);

  // INPUT HANDLER
  function inputHandler(e) {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setImage(files?.[0] || null);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // CREATE OR UPDATE CATEGORY
  async function submitHandler(e) {
    e.preventDefault();

    if (!formData.category.trim()) {
      toast.error("Please enter category name");
      return;
    }

    const data = new FormData();

    data.append("name", formData.category.trim());
    data.append("description", formData.description);
    data.append("status", formData.status);

    if (image) {
      data.append("image", image);
    }

    try {
      setLoading(true);

      if (editData?._id) {
        await api.put(
          `/category/updatecategory/${editData._id}`,
          data
        );

        toast.success("Category updated successfully");
      } else {
        await api.post("/category/createcategory", data);

        toast.success("Category created successfully");
      }

      // CLOSE MODAL
      onClose();

      // REFRESH CATEGORY LIST
      if (getdata) {
        await getdata();
      }
    } catch (error) {
      console.log(error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || "Failed to save category"
      );
    } finally {
      setLoading(false);
    }
  }

  // IMAGE PREVIEW
  const imageUrl = editData?.image
    ? editData.image.startsWith("http")
      ? editData.image
      : `http://localhost:5000${editData.image}`
    : null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#102A43]/60 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#D9E8EF] bg-[#F8FCFD] px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-xl font-bold text-[#102A43]">
              {editData ? "Edit Category" : "Add New Category"}
            </h2>

            <p className="mt-1 text-sm text-[#627D98]">
              {editData
                ? "Update category details"
                : "Create a new product category"}
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-2xl text-[#627D98] transition hover:bg-[#D7F2F6] hover:text-[#087F95] disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form
          className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          onSubmit={submitHandler}
        >
          {/* CATEGORY NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Category Name
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              placeholder="Enter category name"
              className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm text-[#102A43] outline-none placeholder:text-[#829AB1] focus:border-[#22B8CF] focus:ring-2 focus:ring-[#D7F2F6]"
              onChange={inputHandler}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              placeholder="Enter category description"
              className="w-full resize-none rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm text-[#102A43] outline-none placeholder:text-[#829AB1] focus:border-[#22B8CF] focus:ring-2 focus:ring-[#D7F2F6]"
              onChange={inputHandler}
            />
          </div>

          {/* CATEGORY IMAGE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Category Image
            </label>

            {image ? (
              <div className="mb-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Selected category"
                  className="h-24 w-24 rounded-xl border border-[#D9E8EF] object-cover"
                />
              </div>
            ) : imageUrl ? (
              <div className="mb-3">
                <img
                  src={imageUrl}
                  alt="Current category"
                  className="h-24 w-24 rounded-xl border border-[#D9E8EF] object-cover"
                />
              </div>
            ) : null}

            <div className="rounded-xl border-2 border-dashed border-[#BCEAF0] bg-[#F8FCFD] p-6 text-center sm:p-8">
              <div className="mb-3 text-3xl font-bold text-[#087F95]">
                ↑
              </div>

              <p className=" text-sm font-medium text-[#102A43]">
                {image
                  ? image.name
                  : editData?.image
                    ? "Choose a new image to replace the current one"
                    : "Upload category image"}
              </p>

              <p className="mt-1 text-xs text-[#627D98]">
                PNG, JPG or WEBP
              </p>

              <input
                type="file"
                name="image"
                accept="image/png,image/jpeg,image/webp"
                className="mx-auto mt-4 block max-w-full text-sm text-[#627D98] file:mr-3 file:rounded-lg file:border-0 file:bg-[#D7F2F6] file:px-4 file:py-2 file:font-medium file:text-[#087F95] hover:file:bg-[#BCEAF0]"
                onChange={inputHandler}
              />
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Status
            </label>

            <select
              value={formData.status}
              name="status"
              onChange={inputHandler}
              className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm text-[#102A43] outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#D7F2F6]"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* FOOTER */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#D9E8EF] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[#D9E8EF] px-5 py-3 text-sm font-medium text-[#102A43] transition hover:bg-[#F0FAFC] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#087F95] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#066779] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editData
                  ? "Update Category"
                  : "+ Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
