
"use client";

import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function Signup({ setShowLogin, setShowSignup }) {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (
      !formData.firstName ||
      !formData.email ||
      !formData.password
    ) {
      setMessage("Please fill all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/api/signup",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      setMessage(response.data.message);

      if (response.status === 201) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });

        closeSignup();
        onLoginClick();
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const closeSignup = () =>{
    setShowSignup(false)
    setShowLogin(true)
  }

  const handleLogin= () =>{
    setShowLogin(true)
    setShowSignup(false)
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm">

      <div className="relative my-auto w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">

        <button
          type="button"
          onClick={closeSignup}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={22} />
        </button>

        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold text-emerald-800">
            Create Account
          </h1>

          <p className="mt-2 text-gray-500">
            Sign up to get started with QuickKart
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                First Name *
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-600"
              />
            </div>

          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email *
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-600"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password *
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-600"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password *
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-600"
              required
            />
          </div>

          {message && (
            <p className="text-center text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}

          <button
            type="button"
            onClick={() => {
  handleLogin()
  }}
            className="font-semibold text-emerald-700 hover:underline"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}
