import React, { useState } from "react";
import api from "../../api";

function DeleteCategoryModal({ catId, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await api.delete(`/category/deletecategory/${catId}`);

      await onDeleted();
      onClose();
    } catch (error) {
      console.log("Delete error:", error);
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#102A43]/60 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!deleting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-[#D9E8EF] bg-[#EAF7FA] px-6 py-5">
          <h2 className="text-xl font-bold text-[#102A43]">
            Confirm Delete
          </h2>

          <p className="mt-1 text-sm text-[#627D98]">
            Delete category
          </p>
        </div>

        {/* Message and Buttons */}
        <div className="px-6 py-6">
          <p className="leading-6 text-[#627D98]">
            Are you sure you want to delete this category?
            This action cannot be undone.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="rounded-xl border border-[#D9E8EF] bg-white px-5 py-2.5 text-sm font-medium text-[#627D98] transition hover:border-[#22B8CF] hover:bg-[#EAF7FA] hover:text-[#102A43] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22B8CF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl bg-[#087F95] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066779] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22B8CF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteCategoryModal;
