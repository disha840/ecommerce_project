import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiArrowRight,
  FiArrowLeft,
  FiShield,
  FiShoppingBag,
  FiMail,
  FiClock,
} from "react-icons/fi";

import Loader from "../components/Loader";

const OTP_LENGTH = 4;
const OTP_TIME = 20 * 60;

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location?.state?.email;

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_TIME);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  // Email nahi mila to wapas Forgot Password page par bhejo
  useEffect(() => {
    if (!email) {
      navigate("/forgotpassw", { replace: true });
    }
  }, [email, navigate]);

  // Page khulte hi pehla input focus ho
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer
  useEffect(() => {
    const t = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, []);

  // Input change: sirf digit allowed + next input par auto jump
  function inputHandler(e, idx) {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);

    const newOtp = [...otp];
    newOtp[idx] = digit;
    setOtp(newOtp);
    setError("");

    if (digit && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  }

  // Backspace / Arrow keys
  function keyDownHandler(e, idx) {
    if (e.key === "Backspace") {
      if (!otp[idx] && idx > 0) {
        const newOtp = [...otp];
        newOtp[idx - 1] = "";
        setOtp(newOtp);
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  }

  // Paste support (pura OTP ek saath paste)
  function pasteHandler(e) {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (newOtp[i] = d));
    setOtp(newOtp);
    setError("");

    const nextIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIdx]?.focus();
  }

  // Verify OTP
  async function submitHandler(e) {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length < OTP_LENGTH) {
      setError(`Please enter the ${OTP_LENGTH}-digit OTP.`);
      return;
    }

    if (timer <= 0) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/admin/verifyotp",
        {
          email: email,
          otp: finalOtp,
        }
      );

      toast.success(response.data?.message || "OTP verified successfully!");

      navigate("/resetpassword", {
        state: { email: response.data.email },
      });
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message ||
          "Invalid OTP. Please enter the correct OTP."
      );
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
  async function resendOtp() {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/resendotp",
        { email: email }
      );

      toast.success(response.data?.message || "OTP resent successfully!");

      setTimer(OTP_TIME);
      setOtp(Array(OTP_LENGTH).fill(""));
      setError("");
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const minutes = Math.floor(timer / 60);
  const seconds = String(timer % 60).padStart(2, "0");

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
                  OTP VERIFICATION
                </span>
              </div>

              <h1 className="max-w-sm text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Verify your
                <br />
                <span className="text-[#22B8CF]">Account</span>
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300 sm:text-base">
                We have sent a verification code to your email. Enter the OTP
                to continue.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#8DE3EC]">
                  <FiShield size={21} />
                </div>

                <div>
                  <p className="text-sm font-semibold">Secure Verification</p>

                  <p className="mt-1 text-xs text-slate-400">
                    Never share your OTP with anyone
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
                  <FiMail size={24} />
                </div>

                <p className="mb-2 text-sm font-semibold text-[#087F95]">
                  CHECK YOUR INBOX
                </p>

                <h2 className="text-3xl font-bold text-[#102A43] sm:text-4xl">
                  Verify OTP
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#627D98]">
                  Enter the {OTP_LENGTH}-digit OTP sent to{" "}
                  <span className="font-semibold text-[#243B53]">
                    {email || "your email"}
                  </span>
                </p>
              </div>

              {/* OTP Inputs */}
              <div className="mb-3 flex justify-center gap-3 sm:gap-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete={idx === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    aria-label={`OTP digit ${idx + 1}`}
                    onChange={(e) => inputHandler(e, idx)}
                    onKeyDown={(e) => keyDownHandler(e, idx)}
                    onPaste={pasteHandler}
                    onFocus={(e) => e.target.select()}
                    className={`h-14 w-14 rounded-xl border bg-[#F8FCFD] text-center text-xl font-bold text-[#102A43] outline-none transition focus:ring-4 focus:ring-[#22B8CF]/10 sm:h-16 sm:w-16 ${
                      error
                        ? "border-red-400 focus:border-red-400"
                        : "border-[#D9E8EF] focus:border-[#087F95]"
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="mb-2 text-center text-xs text-red-500">
                  {error}
                </p>
              )}

              {/* Timer */}
              <div className="mb-7 mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#087F95]">
                <FiClock size={16} />

                {timer > 0 ? (
                  <span>
                    {minutes}:{seconds}
                  </span>
                ) : (
                  <span className="text-red-500">OTP expired</span>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#087F95] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#087F95]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#066779] hover:shadow-xl hover:shadow-[#087F95]/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{loading ? "Verifying..." : "Verify OTP"}</span>

                {!loading && (
                  <FiArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

              {/* Resend */}
              <div className="mt-6 text-center text-sm text-[#627D98]">
                Didn't receive the code?
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={loading}
                  className="ml-1 font-semibold text-[#087F95] transition hover:text-[#102A43] hover:underline disabled:opacity-60"
                >
                  Resend OTP
                </button>
              </div>

              {/* Back */}
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/forgotpassw")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#087F95] transition hover:text-[#102A43] hover:underline"
                >
                  <FiArrowLeft size={16} />
                  Change email
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

export default VerifyOtp;