import React, { useState } from "react";
import api from "../../api";
import { FiAlertTriangle, FiTrash2 } from "react-icons/fi";

function DeleteVariantModal({ variantId, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await api.delete(`/productvariant/deletevariant/${variantId}`);

      await onDeleted();
      onClose();
    } catch (error) {
      console.log(
        "Delete variant error:",
        error.response?.data || error.message
      );

      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#102A43]/40 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!deleting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#D9E8EF] bg-[#F0FAFC] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* MODAL CONTENT */}
        <div className="flex flex-col items-center px-5 pt-6 text-center sm:px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D7F2F6] ring-8 ring-[#D7F2F6]/50">
            <FiAlertTriangle
              size={26}
              className="text-[#087F95]"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold tracking-tight text-[#102A43]">
            Confirm Delete
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-[#627D98]">
            Are you sure you want to delete this product variant?
            Its associated Cloudinary image will also be deleted.
            This action cannot be undone.
          </p>
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#D9E8EF] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg border border-[#D9E8EF] bg-white px-5 py-2 text-sm font-medium text-[#102A43] transition hover:bg-[#EAF7FA] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || !variantId}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#087F95] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#066779] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiTrash2 size={15} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteVariantModal;
