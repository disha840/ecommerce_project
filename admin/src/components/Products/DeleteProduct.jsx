import React, { useState } from "react";
import api from "../../api";

function DeleteProductModal({ productId, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await api.delete(`/products/deleteproduct/${productId}`);
      await onDeleted();
      onClose();
    } catch (error) {
      console.log("Delete product error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#102A43]/60 p-4"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#D9E8EF] bg-white p-6 text-[#102A43] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D7F2F6] text-2xl text-[#087F95]">
            !
          </div>

          <h2 className="text-xl font-bold text-[#102A43]">
            Confirm Delete
          </h2>
        </div>

        {/* Message */}
        <p className="mt-4 text-sm leading-6 text-[#627D98]">
          Are you sure you want to delete this product?
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-[#D9E8EF] px-4 py-2 text-sm font-medium text-[#627D98] transition hover:bg-[#F0FAFC] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-[#087F95] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#066779] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteProductModal;
