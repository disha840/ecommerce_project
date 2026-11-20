
"use client";

import { useState } from "react";
import axios from "axios";

const AddAddressModal = ({ isOpen, onClose ,onAddressAdded}) => {

  const [formData, setFormData] = useState({
    type: "HOME",
    name: "",
    phone: "",
    houseNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/address/add",
        formData,
        { withCredentials: true }
      );

      alert(response.data.message);

      onAddressAdded();
      onClose();

      setFormData({
        type: "HOME",
        name: "",
        phone: "",
        houseNumber: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
      });

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Address
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Address Type */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Address Type
            </label>

            <div className="flex gap-4">
              {["HOME", "WORK", "OTHER"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={handleChange}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Name and Phone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-lg border p-3 outline-none focus:border-cyan-600"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded-lg border p-3 outline-none focus:border-cyan-600"
                required
              />
            </div>
          </div>

          {/* House Number and Street */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                House / Flat Number
              </label>
              <input
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                placeholder="House number"
                className="w-full rounded-lg border p-3 outline-none focus:border-cyan-600"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Street / Area
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street or area"
                className="w-full rounded-lg border p-3 outline-none focus:border-cyan-600"
                required
              />
            </div>
          </div>

          {/* Landmark */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Landmark
            </label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Nearby landmark (optional)"
              className="w-full rounded-lg border p-3 outline-none focus:border-cyan-600"
            />
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full rounded-lg border p-3 outline-none focus:border-cyan-600"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="w-full rounded-lg border p-3 outline-none focus:border-cyan-600"
                required
              />
            </div>
          </div>

          {/* Country and Pincode */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-cyan-600"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                className="w-full rounded-lg border p-3 outline-none focus:border-cyan-600"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2.5 text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-cyan-700 px-5 py-2.5 text-white hover:bg-cyan-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;
