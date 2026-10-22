
import React, { useState, useEffect } from "react";
import api from "../../api";
import { FiX, FiShield, FiPlus } from "react-icons/fi";

const FormModal = ({ setShowModal, role, onUpdated }) => {
  const modules = [
    "users",
    "categories",
    "subcategories",
    "products",
    "roles",
    "store",
    "product-variant",
    "brand"
  ];
  
  const actions = [
    { label: "Add", value: "create" },
    { label: "Read", value: "read" },
    { label: "Update", value: "update" },
    { label: "Delete", value: "delete" },
  ];

  const [name, setname] = useState("");
  const [permissions, setPermission] = useState([]);
  const [loading, setLoading] = useState(false);

  // Edit mode mein existing role ka data fill hoga
  useEffect(() => {
    if (role) {
      setname(role.name || "");
      setPermission(role.permissions || []);
    } else {
      setname("");
      setPermission([]);
    }
  }, [role]);

  const formatModuleName = (module) => {
    return module.charAt(0).toUpperCase() + module.slice(1);
  };

  const handlePermission = (permission, checked) => {
    if (checked) {
      setPermission((prev) =>
        prev.includes(permission) ? prev : [...prev, permission]
      );
    } else {
      setPermission((prev) =>
        prev.filter((permi) => permi !== permission)
      );
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter role name");
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
        // Update existing role
        const response = await api.put(
          `/role/updaterole/${role._id}`,
          data
        );

        console.log("Role updated:", response.data);

        if (onUpdated) {
          await onUpdated();
        }
      } else {
      
        const response = await api.post("/role/createrole", data);

        console.log("Role created:", response.data);
      }

      setShowModal(false);
    } catch (error) {
      console.log("Role error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => setShowModal(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#EBD9D9] bg-white shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#F7E9E9] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0DDE1] text-[#96566A]">
              <FiShield size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#713F50]">
                {role ? "Edit Role" : "Add New Role"}
              </h2>

              <p className="mt-1 text-sm text-[#A17B86]">
                {role
                  ? "Update role name and permissions."
                  : "Create a new role with specific permissions."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="rounded-lg p-2 text-[#A17B86] transition hover:bg-[#F7E9E9] hover:text-[#713F50]"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* FORM UI */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-5 p-6">
            {/* ROLE NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#713F50]">
                Role Name
              </label>

              <div className="relative">
                <FiShield
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#96566A]"
                />

                <input
                  type="text"
                  placeholder="Enter role name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  className="w-full rounded-xl border border-[#EBD9D9] py-2.5 pl-10 pr-4 text-sm text-[#713F50] outline-none transition placeholder:text-[#AD9299] focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/10"
                />
              </div>
            </div>

            {/* PERMISSIONS */}
            <div>
              <div className="mb-3">
                <label className="block text-sm font-semibold text-[#713F50]">
                  Permissions
                </label>

                <p className="mt-1 text-xs text-[#A17B86]">
                  Select the permissions this role should have for each module.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#EBD9D9]">
                <div className="grid w-full grid-cols-[1fr_repeat(4,72px)] border-b border-[#EBD9D9] bg-[#F7E9E9] px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#713F50]">
                    Module
                  </div>

                  {actions.map((action) => (
                    <div
                      key={action.value}
                      className="text-center text-xs font-semibold uppercase tracking-wide text-[#713F50]"
                    >
                      {action.label}
                    </div>
                  ))}
                </div>

                {modules.map((module) => (
                  <div
                    key={module}
                    className="grid w-full grid-cols-[1fr_repeat(4,72px)] items-center border-b border-[#F7E9E9] px-4 py-3 last:border-b-0 hover:bg-[#FFF9F6]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0DDE1] text-[#96566A]">
                        <FiShield size={15} />
                      </div>

                      <span className="text-sm font-medium text-[#713F50]">
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
                            className="accent-[#96566A]"
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
        <div className="flex shrink-0 justify-end gap-3 border-t border-[#F7E9E9] bg-white px-6 py-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="rounded-xl border border-[#EBD9D9] px-5 py-2.5 text-sm font-semibold text-[#713F50] transition hover:bg-[#F7E9E9]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-[#96566A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#713F50] disabled:cursor-not-allowed disabled:opacity-60"
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
