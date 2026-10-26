
import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiShield,
  FiX,
  FiUserPlus,
  FiSave,
} from "react-icons/fi";

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    "w-full rounded-lg border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-[#102A43] outline-none transition placeholder:text-[#829AB1] focus:border-[#087F95] focus:ring-2 focus:ring-[#22B8CF]/20 disabled:cursor-not-allowed disabled:opacity-60";

  const labelStyle =
    "mb-2 block text-sm font-semibold text-[#102A43]";

  const userFields = [
    ["firstName", "First Name *", "Enter first name", "text", true, <FiUser />],
    ["lastName", "Last Name", "Enter last name", "text", false, <FiUser />],
    ["email", "Email *", "Enter email", "email", true, <FiMail />],
    ["phone", "Phone", "Enter phone number", "tel", false, <FiPhone />],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-2xl">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#D9E8EF] bg-[#F8FCFD] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
              {isEdit ? <FiSave size={22} /> : <FiUserPlus size={22} />}
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#102A43]">
                {isEdit ? "Edit User" : "Create User"}
              </h2>

              <p className="mt-1 text-sm text-[#627D98]">
                {isEdit
                  ? "Update user information."
                  : "Add a new user to your store."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-[#627D98] transition hover:bg-[#D7F2F6] hover:text-[#102A43] disabled:opacity-50"
            aria-label="Close modal"
          >
            <FiX size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-[#102A43]">
                User Information
              </h3>

              <p className="mt-1 text-sm text-[#627D98]">
                Enter the user's details below.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {userFields.map(
                ([name, label, placeholder, type, required, icon]) => (
                  <div key={name}>
                    <label className={labelStyle}>{label}</label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#087F95]">
                        {icon}
                      </span>

                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        required={required}
                        disabled={loading}
                        className={`${inputStyle} pl-10`}
                      />
                    </div>
                  </div>
                )
              )}

              {/* Password */}
              <div>
                <label className={labelStyle}>
                  Password {isEdit ? "" : "*"}
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#087F95]">
                    <FiLock />
                  </span>

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
                    className={`${inputStyle} pl-10`}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className={labelStyle}>Role *</label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#087F95]">
                    <FiShield />
                  </span>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    disabled={loading || roleLoading}
                    className={`${inputStyle} pl-10`}
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
          </div>

          {/* Footer */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#D9E8EF] bg-[#F8FCFD] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-[#D9E8EF] bg-white px-5 py-2.5 text-sm font-semibold text-[#102A43] transition hover:bg-[#F0FAFC] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || roleLoading}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#087F95] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066779] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  {isEdit ? <FiSave size={17} /> : <FiUserPlus size={17} />}
                  {isEdit ? "Update User" : "Create User"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserForm;
