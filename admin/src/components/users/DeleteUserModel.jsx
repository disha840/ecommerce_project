import React from "react";
import api from "../../api";
import { FiAlertTriangle, FiX, FiTrash2 } from "react-icons/fi";

function DeleteUserModal({ userId, onClose, onDeleted }) {
  const handleDelete = async () => {
    try {
      await api.delete(`/api/deleteuser/${userId}`);
      await onDeleted();
      onClose();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#D9E8EF] bg-white p-6 shadow-xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Button */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
            <FiAlertTriangle size={25} />
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#627D98] transition hover:bg-[#F0FAFC] hover:text-[#102A43]"
            aria-label="Close modal"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-[#102A43]">
          Confirm Delete
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#627D98]">
          Are you sure you want to delete this user?
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#D9E8EF] px-5 py-2.5 font-medium text-[#243B53] transition hover:bg-[#F0FAFC]"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#087F95] px-5 py-2.5 font-medium text-white transition hover:bg-[#066779]"
          >
            <FiTrash2 size={17} />
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteUserModal;
