"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateUser} from "../redux/Slices/AuthSlice"

const EditProfileModal = ({ closeModal }) => {

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);

  // Existing user data form me fill karna
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  // Input handle karna
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Profile update API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.put(
        "http://localhost:3000/api/update-profile",
        formData,
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        dispatch(updateUser(response.data.user));

        alert("Profile updated successfully");

        closeModal();
      }

    } catch (error) {
      alert(
        error.response?.data?.message || "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-xl bg-white p-6">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Profile
          </h2>

          <button
            type="button"
            onClick={closeModal}
            className="text-2xl text-gray-500"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-cyan-600"
              required
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-cyan-600"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-cyan-600"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-cyan-600"
              required
            />
          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-cyan-700 px-5 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;