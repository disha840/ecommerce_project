
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  role: "",
  status: "ACTIVE",
};

function CreateUserForm({
  onClose,
  editData = null,
  onCreated,
  showAllUsers,
}) {
  const [role, setRole] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);

  const isEdit = Boolean(editData);

  useEffect(() => {
    async function getRole() {
      try {
        setRoleLoading(true);

        const response = await api.get("/api/getrole");
        setRole(response.data.getAllRole || []);
      } catch (error) {
        console.error("Error fetching roles:", error);

        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to fetch roles"
        );
      } finally {
        setRoleLoading(false);
      }
    }

    getRole();
  }, []);

  // Fill form for editing
  useEffect(() => {
    if (editData) {
      setFormData({
        ...initialFormData,
        firstName: editData.firstName || "",
        lastName: editData.lastName || "",
        email: editData.email || "",
        phone: editData.phone || "",
        role:
          typeof editData.role === "object"
            ? editData.role?._id || ""
            : editData.role || "",
        status: editData.status || "ACTIVE",
        password: "",
      });
    } else {
      setFormData({ ...initialFormData });
    }
  }, [editData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      if (isEdit) {
        await api.put(`/api/updateuser/${editData._id}`, formData);
        toast.success("User updated successfully");
      } else {
        await api.post("/api/createuser", formData);
        toast.success("User created successfully");
      }

      if (onCreated) {
        await onCreated();
      }

      onClose();
    } catch (error) {
      console.error("Error saving user:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.msg ||
        error.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full px-4 py-3 rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] text-[#713F50] placeholder:text-[#AD9299] outline-none focus:border-[#B77B8C] disabled:opacity-60";

  const labelStyle =
    "block text-sm font-semibold text-[#713F50] mb-2";

  const userFields = [
    ["firstName", "First Name *", "Enter first name", "text", true],
    ["lastName", "Last Name", "Enter last name", "text", false],
    ["email", "Email *", "Enter email", "email", true],
    ["phone", "Phone", "Enter phone number", "tel", false],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F7E9E9] px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-[#713F50]">
              {isEdit ? "Edit User" : "Create User"}
            </h2>

            <p className="mt-1 text-sm text-[#A17B86]">
              {isEdit
                ? "Update user information."
                : "Add a new user to your store."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-9 w-9 rounded-lg bg-[#F0DDE1] font-bold text-[#713F50] hover:bg-[#EBD9D9] disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[75vh] overflow-y-auto px-6 py-6">

            {/* User Information */}
            <h3 className="mb-4 text-lg font-bold text-[#713F50]">
              User Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {userFields.map(
                ([name, label, placeholder, type, required]) => (
                  <div key={name}>
                    <label className={labelStyle}>
                      {label}
                    </label>

                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required={required}
                      disabled={loading}
                      className={inputStyle}
                    />
                  </div>
                )
              )}

              {/* Password */}
              <div>
                <label className={labelStyle}>
                  Password {isEdit ? "" : "*"}
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    isEdit
                      ? "New password (optional)"
                      : "Enter password"
                  }
                  required={!isEdit}
                  disabled={loading}
                  className={inputStyle}
                />
              </div>

              {/* Role */}
              <div>
                <label className={labelStyle}>Role *</label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled={loading || roleLoading}
                  className={inputStyle}
                >
                  <option value="">
                    {roleLoading ? "Loading roles..." : "Select role"}
                  </option>

                  {role.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-[#F7E9E9] px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[#EBD9D9] px-6 py-3 text-sm font-semibold text-[#713F50] hover:bg-[#F7E9E9] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || roleLoading}
              className="flex min-w-36 items-center justify-center gap-2 rounded-xl bg-[#96566A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#713F50] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}

              {loading
                ? "Saving..."
                : isEdit
                  ? "Update User"
                  : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserForm;