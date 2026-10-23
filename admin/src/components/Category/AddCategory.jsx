
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#EBD9D9] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#F7E9E9] p-6">
          <div>
            <h2 className="text-xl font-bold text-[#713F50]">
              {editData ? "Edit Category" : "Add New Category"}
            </h2>

            <p className="mt-1 text-sm text-[#A17B86]">
              {editData
                ? "Update category details"
                : "Create a new product category"}
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="text-2xl text-[#A17B86] hover:text-[#713F50] disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form className="space-y-5 p-6" onSubmit={submitHandler}>
          {/* CATEGORY NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#713F50]">
              Category Name
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              placeholder="Enter category name"
              className="w-full rounded-xl border border-[#EBD9D9] bg-white px-4 py-3 text-sm text-[#713F50] outline-none placeholder:text-[#AD9299] focus:border-[#B77B8C] focus:ring-2 focus:ring-[#F0DDE1]"
              onChange={inputHandler}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#713F50]">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              placeholder="Enter category description"
              className="w-full resize-none rounded-xl border border-[#EBD9D9] bg-white px-4 py-3 text-sm text-[#713F50] outline-none placeholder:text-[#AD9299] focus:border-[#B77B8C] focus:ring-2 focus:ring-[#F0DDE1]"
              onChange={inputHandler}
            />
          </div>

          {/* CATEGORY IMAGE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#713F50]">
              Category Image
            </label>

            {image ? (
              <div className="mb-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Selected category"
                  className="h-24 w-24 rounded-lg border border-[#EBD9D9] object-cover"
                />
              </div>
            ) : imageUrl ? (
              <div className="mb-3">
                <img
                  src={imageUrl}
                  alt="Current category"
                  className="h-24 w-24 rounded-lg border border-[#EBD9D9] object-cover"
                />
              </div>
            ) : null}

            <div className="rounded-xl border-2 border-dashed border-[#EBD9D9] bg-[#FFF9F6] p-8 text-center">
              <div className="mb-3 text-3xl text-[#A17B86]">↑</div>

              <p className="text-sm font-medium text-[#96566A]">
                {image
                  ? image.name
                  : editData?.image
                    ? "Choose a new image to replace the current one"
                    : "Upload category image"}
              </p>

              <p className="mt-1 text-xs text-[#A17B86]">
                PNG, JPG or WEBP
              </p>

              <input
                type="file"
                name="image"
                accept="image/png,image/jpeg,image/webp"
                className="mx-auto mt-4 block max-w-full text-sm text-[#713F50]"
                onChange={inputHandler}
              />
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#713F50]">
              Status
            </label>

            <select
              value={formData.status}
              name="status"
              onChange={inputHandler}
              className="w-full rounded-xl border border-[#EBD9D9] bg-white px-4 py-3 text-sm text-[#713F50] outline-none focus:border-[#B77B8C]"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 border-t border-[#F7E9E9] pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[#EBD9D9] px-5 py-3 text-sm font-medium text-[#713F50] hover:bg-[#FFF9F6] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#96566A] px-5 py-3 text-sm font-medium text-white hover:bg-[#713F50] disabled:cursor-not-allowed disabled:opacity-60"
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