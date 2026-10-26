import React, { useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiShoppingBag,
} from "react-icons/fi";

import Loader from "../components/Loader";
import { setUser, checkAuth } from "../redux/Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Input Handler
  function inputHandler(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
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

    if (!form.email.trim()) {
      errors.email = "Please enter your email.";
    } else if (
      !form.email.includes("@") ||
      !form.email.includes(".")
    ) {
      errors.email = "Please enter a valid email.";
    }

    if (!form.password) {
      errors.password = "Please enter your password.";
    } else if (form.password.length < 6) {
      errors.password = "Password must contain at least 6 characters.";
    } else if (
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      !/[0-9]/.test(form.password)
    ) {
      errors.password =
        "Password must contain uppercase, lowercase and a number.";
    }

    return errors;
  }

  // Login Handler
  async function submitHandler(event) {
    event.preventDefault();

    const errors = errorHandler();
    setError(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/admin/login",
        form,
        {
          withCredentials: true,
        }
      );

      dispatch(setUser(response.data.user));

      toast.success(response.data.message || "Login successful!");

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Check Existing Login
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <>
      {loading && <Loader />}

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F0FAFC] px-4 py-8 sm:px-6 lg:px-8">

        {/* Background Decorations */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#22B8CF]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-[#087F95]/10 blur-3xl" />

        {/* Main Login Card */}
        <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#D9E8EF] bg-white shadow-2xl shadow-[#102A43]/10md:min-h-screen md:flex-row">

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
                <h2 className="text-xl font-bold tracking-wide">
                  MyStore
                </h2>

                <p className="text-xs text-slate-300">
                  Admin Panel
                </p>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="relative z-10 my-10 md:my-0">
              <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-[#22B8CF]/30 bg-[#22B8CF]/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#22B8CF]" />

                <span className="text-xs font-medium text-[#8DE3EC]">
                  ADMIN PORTAL
                </span>
              </div>

              <h1 className="max-w-sm text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Welcome
                <br />
                <span className="text-[#22B8CF]">
                  Back!
                </span>
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300 sm:text-base">
                Sign in to manage your store, organize products and keep
                everything running smoothly.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#8DE3EC]">
                  <FiShield size={21} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Secure Admin Access
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Your store, all in one place
                  </p>
                </div>
              </div>
            </div>

            <p className="relative z-10 hidden text-xs text-slate-400 md:block">
              © 2026 MyStore. All rights reserved.
            </p>
          </div>

          {/* Right Login Form */}
          <div className="flex flex-1 items-center justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14">

            <form
              className="w-full max-w-md"
              onSubmit={submitHandler}
            >
              {/* Form Heading */}
              <div className="mb-8">
                <p className="mb-2 text-sm font-semibold text-[#087F95]">
                  GOOD TO SEE YOU AGAIN
                </p>

                <h2 className="text-3xl font-bold text-[#102A43] sm:text-4xl">
                  Sign In
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#627D98]">
                  Enter your details below to access your admin account.
                </p>
              </div>

              {/* Email Input */}
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#243B53]"
                >
                  Email Address
                </label>

                <div
                  className={`flex items-center gap-3 rounded-xl border bg-[#F8FCFD] px-4 transition focus-within:ring-4 focus-within:ring-[#22B8CF]/10 ${
                    error.email
                      ? "border-red-400 focus-within:border-red-400"
                      : "border-[#D9E8EF] focus-within:border-[#087F95]"
                  }`}
                >
                  <FiMail
                    size={19}
                    className="shrink-0 text-[#087F95]"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full bg-transparent py-3.5 text-sm text-[#102A43] outline-none placeholder:text-[#94A8B8]"
                    onChange={inputHandler}
                  />
                </div>

                {error.email && (
                  <p className="mt-2 text-xs text-red-500">
                    {error.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#243B53]"
                >
                  Password
                </label>

                <div
                  className={`flex items-center gap-3 rounded-xl border bg-[#F8FCFD] px-4 transition focus-within:ring-4 focus-within:ring-[#22B8CF]/10 ${
                    error.password
                      ? "border-red-400 focus-within:border-red-400"
                      : "border-[#D9E8EF] focus-within:border-[#087F95]"
                  }`}
                >
                  <FiLock
                    size={19}
                    className="shrink-0 text-[#087F95]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

              {/* Forgot Password */}
              <div className="mb-7 flex justify-end">
                <Link
                  to="/forgotpassw"
                  className="text-sm font-semibold text-[#087F95] transition hover:text-[#102A43] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#087F95] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#087F95]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#066779] hover:shadow-xl hover:shadow-[#087F95]/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{loading ? "Signing in..." : "Sign In to Dashboard"}</span>

                {!loading && (
                  <FiArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

              {/* Bottom Note */}
              <div className="mt-7 flex items-start justify-center gap-2 text-center text-xs leading-5 text-[#627D98]">
                <FiShield
                  size={15}
                  className="mt-0.5 shrink-0 text-[#087F95]"
                />

                <p>
                  Your login information is used to securely access your
                  account.
                </p>
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

export default Login;