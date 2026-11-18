

import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";

const FormModal = ({ onClose, editData, getdata }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    user: "",
    vehicleType: "bike",
    vehicleNumber: "",
    drivingLicenseNumber: "",
    status: "active",
    isOnline: false,
    isAvailable: false,
  });

  useEffect(() => {
    getAllDeliveryPartnerUsers();
  }, []);

  const getAllDeliveryPartnerUsers = async () => {
    try {
      const response = await api.get("/deliverypartner/all-users");

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch delivery partner users"
      );
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        user: editData.user?._id || editData.user || "",
        vehicleType: editData.vehicleType || "bike",
        vehicleNumber: editData.vehicleNumber || "",
        drivingLicenseNumber: editData.drivingLicenseNumber || "",
        status: editData.status || "active",
        isOnline: editData.isOnline || false,
        isAvailable: editData.isAvailable || false,
      });
    }
  }, [editData]);

  function inputHandler(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function submitHandler(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const data = {
        user: formData.user,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),
        drivingLicenseNumber: formData.drivingLicenseNumber
          .trim()
          .toUpperCase(),
        status: formData.status,
        isOnline: formData.isOnline,
        isAvailable: formData.isAvailable,
      };

      if (editData) {
        // Update API baad mein connect karna
        return;
      }

      const response = await api.post(
        "/deliverypartner/addpartner",
        data
      );

      if (response.data.success) {
        toast.success(response.data.message || "Delivery partner added successfully");

        onClose();
        getdata?.();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#D7F2F6]";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#102A43]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#D9E8EF] bg-[#F8FCFD] px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-xl font-bold text-[#102A43]">
              {editData ? "Edit Delivery Partner" : "Add Delivery Partner"}
            </h2>

            <p className="mt-1 text-sm text-[#627D98]">
              {editData
                ? "Update delivery partner information"
                : "Add a new delivery partner to your team"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-2xl text-[#627D98] transition hover:bg-[#D7F2F6] hover:text-[#087F95]"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={submitHandler}
          className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
        >
          {/* PERSONAL INFORMATION */}
          <div>
            <h3 className="mb-4 text-base font-bold text-[#102A43]">
              Personal Information
            </h3>

            <label className="mb-2 block text-sm font-medium text-[#102A43]">
              Select User
            </label>

            <select
              name="user"
              value={formData.user}
              onChange={inputHandler}
              required
              disabled={!!editData}
              className={inputClass}
            >
              <option value="">Select delivery partner user</option>

              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName} - {user.email}
                </option>
              ))}
            </select>

            {formData.user && (
              <div className="mt-3 rounded-xl border border-[#D9E8EF] bg-[#F0FAFC] p-4">
                {(() => {
                  const selectedUser = users.find(
                    (user) => user._id === formData.user
                  );

                  return selectedUser ? (
                    <>
                      <p className="text-sm font-semibold text-[#102A43]">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </p>

                      <p className="mt-1 text-xs text-[#627D98]">
                        {selectedUser.email}
                      </p>

                      <p className="mt-1 text-xs text-[#627D98]">
                        {selectedUser.phone}
                      </p>
                    </>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          <div className="border-t border-[#D9E8EF]" />

          {/* VEHICLE INFORMATION */}
          <div>
            <h3 className="mb-4 text-base font-bold text-[#102A43]">
              Vehicle Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#102A43]">
                  Vehicle Type
                </label>

                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={inputHandler}
                  className={inputClass}
                >
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="cycle">Cycle</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#102A43]">
                  Vehicle Number
                </label>

                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={inputHandler}
                  placeholder="e.g. RJ14 AB 1234"
                  required
                  className={`${inputClass} uppercase`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#102A43]">
                  Driving License Number
                </label>

                <input
                  type="text"
                  name="drivingLicenseNumber"
                  value={formData.drivingLicenseNumber}
                  onChange={inputHandler}
                  placeholder="Enter driving license number"
                  required
                  className={`${inputClass} uppercase`}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[#D9E8EF]" />

          {/* AVAILABILITY & STATUS */}
          <div>
            <h3 className="mb-4 text-base font-bold text-[#102A43]">
              Availability & Status
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] p-4">
                <div>
                  <p className="text-sm font-semibold text-[#102A43]">
                    Online Status
                  </p>

                  <p className="mt-1 text-xs text-[#627D98]">
                    Is partner online?
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isOnline"
                  checked={formData.isOnline}
                  onChange={inputHandler}
                  className="h-5 w-5 accent-[#087F95]"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] p-4">
                <div>
                  <p className="text-sm font-semibold text-[#102A43]">
                    Available for Delivery
                  </p>

                  <p className="mt-1 text-xs text-[#627D98]">
                    Can accept new orders?
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={inputHandler}
                  className="h-5 w-5 accent-[#087F95]"
                />
              </label>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#102A43]">
                  Partner Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={inputHandler}
                  className={inputClass}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#D9E8EF] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[#D9E8EF] px-5 py-3 text-sm font-medium text-[#102A43] transition hover:bg-[#F0FAFC] disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#087F95] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#066779] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : editData
                  ? "Update Partner"
                  : "+ Add Partner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
