
import React, { useState, useEffect } from "react";
import api from "../api";

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
  onCreated, showAllUsers 
}) {
  const [role, setRole] = useState([]);
  
  const [formData, setFormData] = useState(initialFormData);

  const isEdit = Boolean(editData);

  // Fetch roles
  useEffect(() => {
    async function getRole() {
      try {
        const response = await api.get("/api/getrole");
        setRole(response.data.getAllRole || []);
      } catch (error) {
        console.log("Error fetching roles:", error);
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

    try {
      if (isEdit) {
        await api.put(
          `/api/updateuser/${editData._id}`,
          formData
        );
      } else {
        await api.post("/api/createuser", formData);
      }

      if (onCreated) {
        await onCreated();
      }

      onClose();
    } catch (error) {
     console.log("Error:", error.response?.data);
    }
  };

  const inputStyle =
    "w-full px-4 py-3 rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] text-[#713F50] placeholder:text-[#AD9299] outline-none focus:border-[#B77B8C]";

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
            className="h-9 w-9 rounded-lg bg-[#F0DDE1] font-bold text-[#713F50] hover:bg-[#EBD9D9]"
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
                  className={inputStyle}
                >
                  <option value="">Select role</option>

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
              className="rounded-xl border border-[#EBD9D9] px-6 py-3 text-sm font-semibold text-[#713F50] hover:bg-[#F7E9E9]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#96566A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#713F50]"
            >
              {isEdit ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserForm;