import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import api from "../../api";

const AddSubcategory = ({ onClose,getdata, editData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await api.get("/category/showcategories");
        setCategories(res.data.category || []);
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
      setImage(null)
    } else {
      setName("");
      setDescription("");
      setParentCategory("");
      setImage(null);
    }
     
  }, [editData]);

  async function handleSubmit(e) {
    e.preventDefault();
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
      await getdata()

      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-semibold">
            {editData ? "Edit Subcategory" : "Add Subcategory"}
          </h2>

          <button onClick={onClose}>
            <FiX size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-sm">Subcategory Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border p-3"
              rows="3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Parent Category</label>
            <select
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              className="w-full rounded-lg border p-3"
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

          <div>
            <label className="mb-1 block text-sm">Image</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full rounded-lg border p-3"
            />
            {editData?.image && (
  <img
    src={editData.image}
    alt="Current Image"
    className="mt-2 h-20 w-20 object-cover"
  />
)}

            
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#96566A] px-5 py-2 text-white"
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