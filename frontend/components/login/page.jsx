


"use client";
import { useDispatch } from "react-redux";
import {setuser} from "../../redux/Slices/AuthSlice"
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function Login({ setShowLogin,setShowSignup }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
  
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:3000/api/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      

      if (response.data.status) {
        dispatch(setuser(response.data.user))
  

        if (closeLogin) {
          closeLogin();
        }

        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    setShowLogin(false)
    setShowSignup(true)
  };

  const closeLogin=()=>{
    setShowLogin(false)
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 px-4 py-10 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

        {/* Close Button */}
        <button
          type="button"
          onClick={closeLogin}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={22} />
        </button>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-800">
            Welcome Back!
          </h1>

          <p className="mt-2 text-gray-500">
            Login to your QuickKart account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          {message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Signup Navigation */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={handleSignup}
            className="font-semibold text-emerald-700 hover:underline"
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
}
