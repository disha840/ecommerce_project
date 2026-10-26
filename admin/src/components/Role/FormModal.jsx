import React, { useState, useEffect } from "react";
import api from "../../api";
import { FiX, FiShield, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";

const FormModal = ({
  setShowModal,
  role,
  onUpdated,
  onCreated,
}) => {
  const modules = [
    "users",
    "categories",
    "subcategories",
    "products",
    "roles",
    "store",
    "product-variant",
    "brand",
  ];

  const actions = [
    { label: "Add", value: "create" },
    { label: "Read", value: "read" },
    { label: "Update", value: "update" },
    { label: "Delete", value: "delete" },
  ];

  const [name, setName] = useState("");
  const [permissions, setPermission] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fill existing data when editing
  useEffect(() => {
    if (role) {
      setName(role.name || "");
      setPermission(role.permissions || []);
    } else {
      setName("");
      setPermission([]);
    }
  }, [role]);

  // Format module name for display
  const formatModuleName = (module) => {
    return module
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Handle permission checkbox
  const handlePermission = (permission, checked) => {
    if (checked) {
      setPermission((prev) =>
        prev.includes(permission) ? prev : [...prev, permission]
      );
    } else {
      setPermission((prev) =>
        prev.filter((item) => item !== permission)
      );
    }
  };

  // CREATE OR UPDATE ROLE
  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter role name");
      return;
    }

    try {
      setLoading(true);

      const data = {
        name: name.trim(),
        permissions,
        status: role?.status || "Active",
      };

      if (role?._id) {
        // UPDATE ROLE
        const response = await api.put(
          `/role/updaterole/${role._id}`,
          data
        );

        console.log("Role updated:", response.data);

        if (onUpdated) {
          await onUpdated();
        }

        toast.success("Role updated successfully");
      } else {
        // CREATE ROLE
        const response = await api.post("/role/createrole", data);

        console.log("Role created:", response.data);

        if (onCreated) {
          await onCreated();
        }

        toast.success("Role created successfully");
      }

      // Close modal after successful API request
      setShowModal(false);
    } catch (error) {
      console.log("Role error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message || "Failed to save role"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/60 p-4 backdrop-blur-sm"
      onClick={() => setShowModal(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#D9E8EF] bg-[#F8FCFD] px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
              <FiShield size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#102A43]">
                {role ? "Edit Role" : "Add New Role"}
              </h2>

              <p className="mt-1 text-sm text-[#627D98]">
                {role
                  ? "Update role name and permissions."
                  : "Create a new role with specific permissions."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="rounded-lg p-2 text-[#627D98] transition hover:bg-[#D7F2F6] hover:text-[#087F95]"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* FORM */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-6 p-5 sm:p-6">
            {/* ROLE NAME */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#102A43]">
                Role Name
              </label>

              <div className="relative">
                <FiShield
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#087F95]"
                />

                <input
                  type="text"
                  placeholder="Enter role name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] py-3 pl-10 pr-4 text-sm text-[#102A43] outline-none transition placeholder:text-[#94A8B8] focus:border-[#087F95] focus:bg-white focus:ring-2 focus:ring-[#22B8CF]/20"
                />
              </div>
            </div>

            {/* PERMISSIONS */}
            <div>
              <div className="mb-3">
                <label className="block text-sm font-semibold text-[#102A43]">
                  Permissions
                </label>

                <p className="mt-1 text-xs leading-5 text-[#627D98]">
                  Select the permissions this role should have for each module.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#D9E8EF]">
                <div className="grid w-full grid-cols-[1fr_repeat(4,72px)] border-b border-[#D9E8EF] bg-[#F0FAFC] px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#102A43]">
                    Module
                  </div>

                  {actions.map((action) => (
                    <div
                      key={action.value}
                      className="text-center text-xs font-semibold uppercase tracking-wide text-[#102A43]"
                    >
                      {action.label}
                    </div>
                  ))}
                </div>

                {modules.map((module) => (
                  <div
                    key={module}
                    className="grid w-full grid-cols-[1fr_repeat(4,72px)] items-center border-b border-[#D9E8EF] px-4 py-3 last:border-b-0 transition hover:bg-[#F8FCFD]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D7F2F6] text-[#087F95]">
                        <FiShield size={15} />
                      </div>

                      <span className="text-sm font-medium text-[#102A43]">
                        {formatModuleName(module)}
                      </span>
                    </div>

                    {actions.map((action) => {
                      const permission = `${module}:${action.value}`;

                      return (
                        <div
                          key={action.value}
                          className="flex justify-center"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 cursor-pointer accent-[#087F95]"
                            checked={permissions.includes(permission)}
                            onChange={(e) =>
                              handlePermission(
                                permission,
                                e.target.checked
                              )
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 justify-end gap-3 border-t border-[#D9E8EF] bg-[#F8FCFD] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            disabled={loading}
            className="rounded-xl border border-[#D9E8EF] bg-white px-5 py-2.5 text-sm font-semibold text-[#102A43] transition hover:bg-[#F0FAFC] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-[#087F95] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066779] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiPlus size={18} />

            {loading
              ? "Saving..."
              : role
                ? "Update Role"
                : "Add Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
