
import React from "react";
import api from "../../api";

function DeleteCategoryModal({ catId, onClose, onDeleted }) {
  const handleDelete = async () => {
    try {
      await api.delete(`/category/deletecategory/${catId}`);
      await onDeleted();
      onClose();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-[#EBD9D9] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-[#713F50]">
          Confirm Delete
        </h2>

        <p className="mt-3 text-[#A17B86]">
          Are you sure you want to delete this category?
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#EBD9D9] px-4 py-2 text-[#713F50] hover:bg-[#F7E9E9]"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default  DeleteCategoryModal ;