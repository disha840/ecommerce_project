import React from "react";
import api from "../../api";

function DeleteRoleModal({ roleId, onClose, onDeleted }) {
  const handleDelete = async () => {
    try {
      await api.delete(`/role/deleterole/${roleId}`);
      await onDeleted();
      onClose();
    } catch (error) {
      console.log("Delete role error:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#D9E8EF] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D7F2F6]">
            <span className="text-xl font-bold text-[#087F95]">!</span>
          </div>

          <h2 className="text-xl font-bold text-[#102A43]">
            Confirm Delete
          </h2>
        </div>

        <p className="mt-4 leading-6 text-[#627D98]">
          Are you sure you want to delete this role?
          This action cannot be undone.
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#D9E8EF] bg-white px-4 py-2.5 font-medium text-[#102A43] transition hover:bg-[#F0FAFC]"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="rounded-lg bg-[#087F95] px-4 py-2.5 font-medium text-white transition hover:bg-[#066779]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRoleModal;
