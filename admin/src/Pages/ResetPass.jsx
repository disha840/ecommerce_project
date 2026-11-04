import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
  FiShield,
  FiShoppingBag,
  FiKey,
} from "react-icons/fi";

import Loader from "../components/Loader";

const ResetPass = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location?.state?.email;

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Email nahi mila to wapas Forgot Password page par bhejo
  useEffect(() => {
    if (!email) {
      navigate("/forgotpassw", { replace: true });
    }
  }, [email, navigate]);

  // Input Handler
  function inputHandler(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setError({
      ...error,
      [name]: "",
    });
  }

  // Form Validation
  function errorHandler() {
    const errors = {};

    if (!formData.password) {
      errors.password = "Please enter your new password.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must contain at least 6 characters.";
    } else if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      errors.password =
        "Password must contain uppercase, lowercase and a number.";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
  }

  // Reset Password Handler
  async function submitHandler(e) {
    e.preventDefault();

    const errors = errorHandler();
    setError(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/admin/changepassword",
        {
          email: email,
          password: formData.password,
        }
      );

      toast.success(
        response.data?.message || "Password reset successfully!"
      );

      setFormData({
        password: "",
        confirmPassword: "",
      });

      navigate("/login", {
        replace: true,
        state: { email: response.data.email },
      });
    } catch (err) {
      console.log(err.response?.data);

      toast.error(
        err.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loader />}

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F0FAFC] px-4 py-8 sm:px-6 lg:px-8">

        {/* Background Decorations */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#22B8CF]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-[#087F95]/10 blur-3xl" />

        {/* Main Card */}
        <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#D9E8EF] bg-white shadow-2xl shadow-[#102A43]/10 md:min-h-screen md:flex-row">

          {/* Left Welcome Panel */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-[#102A43] px-7 py-9 text-white sm:px-10 sm:py-12 md:w-[46%] md:px-12 lg:px-14">

            {/* Decorative Circles */}
            <div className="pointer-events-none absolute -right-20 -top-16 h-64 w-64 rounded-full border-8 border-[#22B8CF]/10" />

            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#22B8CF]/10" />

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22B8CF] text-[#102A43] shadow-lg shadow-black/10">
                <FiShoppingBag size={25} />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-wide">MyStore</h2>

                <p className="text-xs text-slate-300">Admin Panel</p>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="relative z-10 my-10 md:my-0">
              <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-[#22B8CF]/30 bg-[#22B8CF]/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#22B8CF]" />

                <span className="text-xs font-medium text-[#8DE3EC]">
                  RESET PASSWORD
                </span>
              </div>

              <h1 className="max-w-sm text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Create a new
                <br />
                <span className="text-[#22B8CF]">Password</span>
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300 sm:text-base">
                Choose a strong password for your account and make sure you
                remember it.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#8DE3EC]">
                  <FiShield size={21} />
                </div>

                <div>
                  <p className="text-sm font-semibold">Keep it Strong</p>

                  <p className="mt-1 text-xs text-slate-400">
                    Use uppercase, lowercase and numbers
                  </p>
                </div>
              </div>
            </div>

            <p className="relative z-10 hidden text-xs text-slate-400 md:block">
              © 2026 MyStore. All rights reserved.
            </p>
          </div>

          {/* Right Form */}
          <div className="flex flex-1 items-center justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14">
            <form className="w-full max-w-md" onSubmit={submitHandler}>

              {/* Form Heading */}
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#087F95]/10 text-[#087F95]">
                  <FiKey size={24} />
                </div>

                <p className="mb-2 text-sm font-semibold text-[#087F95]">
                  ALMOST DONE
                </p>

                <h2 className="text-3xl font-bold text-[#102A43] sm:text-4xl">
                  Reset Password
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#627D98]">
                  Enter your new password below.
                </p>
              </div>

              {/* New Password */}
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#243B53]"
                >
                  New Password
                </label>

                <div
                  className={`flex items-center gap-3 rounded-xl border bg-[#F8FCFD] px-4 transition focus-within:ring-4 focus-within:ring-[#22B8CF]/10 ${
                    error.password
                      ? "border-red-400 focus-within:border-red-400"
                      : "border-[#D9E8EF] focus-within:border-[#087F95]"
                  }`}
                >
                  <FiLock size={19} className="shrink-0 text-[#087F95]" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full bg-transparent py-3.5 text-sm text-[#102A43] outline-none placeholder:text-[#94A8B8]"
                    onChange={inputHandler}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 text-[#627D98] transition hover:text-[#087F95]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff size={19} />
                    ) : (
                      <FiEye size={19} />
                    )}
                  </button>
                </div>

                {error.password && (
                  <p className="mt-2 text-xs leading-5 text-red-500">
                    {error.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-7">
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#243B53]"
                >
                  Confirm Password
                </label>

                <div
                  className={`flex items-center gap-3 rounded-xl border bg-[#F8FCFD] px-4 transition focus-within:ring-4 focus-within:ring-[#22B8CF]/10 ${
                    error.confirmPassword
                      ? "border-red-400 focus-within:border-red-400"
                      : "border-[#D9E8EF] focus-within:border-[#087F95]"
                  }`}
                >
                  <FiLock size={19} className="shrink-0 text-[#087F95]" />

                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="w-full bg-transparent py-3.5 text-sm text-[#102A43] outline-none placeholder:text-[#94A8B8]"
                    onChange={inputHandler}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="shrink-0 text-[#627D98] transition hover:text-[#087F95]"
                    aria-label={
                      showConfirm ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirm ? (
                      <FiEyeOff size={19} />
                    ) : (
                      <FiEye size={19} />
                    )}
                  </button>
                </div>

                {error.confirmPassword && (
                  <p className="mt-2 text-xs leading-5 text-red-500">
                    {error.confirmPassword}
                  </p>
                )}
              </div>

              {/* Reset Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#087F95] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#087F95]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#066779] hover:shadow-xl hover:shadow-[#087F95]/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{loading ? "Resetting..." : "Reset Password"}</span>

                {!loading && (
                  <FiArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

              {/* Back to Login */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#087F95] transition hover:text-[#102A43] hover:underline"
                >
                  <FiArrowLeft size={16} />
                  Back to Login
                </button>
              </div>

              <p className="mt-8 text-center text-xs text-[#94A8B8] md:hidden">
                © 2026 MyStore. All rights reserved.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPass;