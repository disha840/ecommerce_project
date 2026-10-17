import React, { useState } from "react";
import api from "../../api";
import { FiAlertTriangle, FiTrash2 } from "react-icons/fi";

function DeleteSubcategoryModal({ subId, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/subcategory/deletesubcategory/${subId}`);
      await onDeleted();
      onClose();
    } catch (error) {
      console.log("Delete error:", error);
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#EBD9D9] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center px-6 pt-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60">
            <FiAlertTriangle size={28} className="text-red-600" />
          </div>

          <h2 className="mt-5 text-xl font-bold tracking-tight text-[#713F50]">
            Confirm Delete
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-[#A17B86]">
            Are you sure you want to delete this subcategory? This action
            cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#EBD9D9] bg-[#FFF9F6] px-6 py-4 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg border border-[#EBD9D9] bg-white px-5 py-2 text-sm font-medium text-[#713F50] transition hover:bg-[#F7E9E9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#96566A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiTrash2 size={15} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSubcategoryModal;