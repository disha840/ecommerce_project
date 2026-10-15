import React, { useState } from "react";
import api from "../api";

const EditUser = ({ user, onClose}) => {

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    status: user?.status || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

 async function handleSubmit(e) {
    e.preventDefault();
    try{
        const response=await api.put(`/api/updateuser/${user._id}`,formData)
        console.log(response)
        onClose()
    }
    catch(error){
        console.log(error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[90%] max-w-3xl rounded-2xl bg-[#E9EDD5] p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <p className="text-xs text-[#68754A]">
              Users
            </p>

            <h1 className="text-2xl font-bold text-[#344027]">
              Edit User
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl font-bold text-[#344027]"
          >
            ×
          </button>

        </div>


        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-6"
        >

          <div className="grid grid-cols-2 gap-5">

            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold text-[#68754A] mb-2">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-[#C8D09B] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#4F5D3A]"
              />
            </div>


            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold text-[#68754A] mb-2">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-[#C8D09B] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#4F5D3A]"
              />
            </div>


            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#68754A] mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-[#C8D09B] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#4F5D3A]"
              />
            </div>


            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-[#68754A] mb-2">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-[#C8D09B] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#4F5D3A]"
              />
            </div>


            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-[#68754A] mb-2">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-[#C8D09B] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#4F5D3A]"
              >
                <option value="">Select Role</option>
                <option value="SUPER_ADMIN">SUPER ADMIN</option>
                <option value="ADMIN">ADMIN</option>
                <option value="STORE_MANAGER">STORE MANAGER</option>
                <option value="INVENTORY_MANAGER">
                  INVENTORY MANAGER
                </option>
                <option value="DELIVERY_PARTNER">
                  DELIVERY PARTNER
                </option>
                <option value="SUPPORT_AGENT">
                  SUPPORT AGENT
                </option>
                <option value="CUSTOMER">CUSTOMER</option>
              </select>
            </div>


            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-[#68754A] mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-[#C8D09B] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#4F5D3A]"
              >
                <option value="">Select Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

          </div>


          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-7">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#C8D09B] text-[#344027] text-sm font-semibold hover:bg-[#E9EDD5]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#4F5D3A] text-white text-sm font-semibold hover:bg-[#344027]"
            >
              Update User
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditUser;
