

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
        {/* Icon and Message */}
        <div className="flex flex-col items-center px-6 pt-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D7F2F6] ring-8 ring-[#D7F2F6]/50">
            <FiAlertTriangle size={28} className="text-[#087F95]" />
          </div>

          <h2 className="mt-5 text-xl font-bold tracking-tight text-[#102A43]">
            Confirm Delete
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#627D98]">
            Are you sure you want to delete this subcategory? This action
            cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#D9E8EF] bg-[#F8FCFD] px-6 py-4 sm:flex-row sm:justify-end">
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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087F95] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066779] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22B8CF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiTrash2 size={16} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSubcategoryModal;
