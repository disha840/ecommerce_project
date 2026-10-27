
import React, { useState, useEffect } from "react";
import api from "../../api";

const AddBrand = ({ onClose, editData, getdata }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        description: editData.description || "",
        status: editData.status || "Active",
      });
    }
  }, [editData]);

  function inputHandler(event) {
    const { name, value, type, files } = event.target;

    if (type === "file") {
      setImage(files[0]);
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function submitHandler(event) {
    event.preventDefault();
    setLoading(true);

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("status", formData.status);

    if (image) {
      data.append("image", image);
    }

    try {
      const response = editData?._id
        ? await api.put(`/brands/${editData._id}`, data)
        : await api.post("/brands/createbrand", data);

      console.log(response.data);

      await getdata();
      onClose();
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-[#102A43]/40 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!loading) {
          onClose();
        }
      }}
    >
      <div
        className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#D9E8EF] bg-[#F0FAFC] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#D9E8EF] px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-[#102A43]">
              {editData ? "Edit Brand" : "Add New Brand"}
            </h2>

            <p className="mt-1 text-sm text-[#627D98]">
              {editData
                ? "Update brand details"
                : "Create a new product brand"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-2xl text-[#627D98] transition hover:bg-[#D7F2F6] hover:text-[#087F95] disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form
          className="space-y-4 p-4 sm:p-5"
          onSubmit={submitHandler}
        >
          <div className="rounded-xl border border-[#D9E8EF] bg-white p-4 sm:p-5">

            {/* BRAND NAME */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-[#102A43]">
                Brand Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter brand name"
                className="w-full rounded-lg border border-[#D9E8EF] bg-[#F8FCFD] px-3 py-2 text-sm text-[#102A43] placeholder:text-[#627D98] outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20"
                onChange={inputHandler}
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-[#102A43]">
                Description
              </label>

              <textarea
                rows="3"
                name="description"
                value={formData.description}
                placeholder="Enter brand description"
                className="w-full resize-none rounded-lg border border-[#D9E8EF] bg-[#F8FCFD] px-3 py-2 text-sm text-[#102A43] placeholder:text-[#627D98] outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20"
                onChange={inputHandler}
              />
            </div>

            {/* BRAND IMAGE */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-[#102A43]">
                Brand Image
              </label>

              {editData?.image && !image && (
                <img
                  src={editData.image}
                  alt="Current brand"
                  className="mb-3 h-20 w-20 rounded-lg border border-[#D9E8EF] bg-[#F8FCFD] object-contain p-2"
                />
              )}

              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Selected brand"
                  className="mb-3 h-20 w-20 rounded-lg border border-[#D9E8EF] bg-[#F8FCFD] object-contain p-2"
                />
              )}

              <div className="rounded-xl border-2 border-dashed border-[#D9E8EF] bg-[#F8FCFD] p-5 text-center transition hover:border-[#22B8CF]">
                <div className="mb-2 text-2xl text-[#087F95]">
                  ↑
                </div>

                <p className="text-sm font-medium text-[#102A43]">
                  {image ? image.name : "Upload brand image"}
                </p>

                <p className="mt-1 text-xs text-[#627D98]">
                  PNG, JPG or WEBP
                </p>

                <input
                  type="file"
                  name="image"
                  accept="image/png,image/jpeg,image/webp"
                  className="mx-auto mt-3 block max-w-full text-sm text-[#627D98] file:mr-3 file:rounded-lg file:border-0 file:bg-[#D7F2F6] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#087F95] hover:file:bg-[#BDEAF0]"
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
                className="w-full rounded-lg border border-[#D9E8EF] bg-[#F8FCFD] px-3 py-2 text-sm text-[#102A43] outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 border-t border-[#D9E8EF] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-[#D9E8EF] bg-white px-4 py-2 text-sm font-medium text-[#102A43] transition hover:bg-[#EAF7FA] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#087F95] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#066779] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editData
                  ? "Update Brand"
                  : "+ Add Brand"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddBrand;
