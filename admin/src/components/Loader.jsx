import React from "react";
import { FiShoppingBag } from "react-icons/fi";

const Loader = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-60 flex items-center justify-center bg-[#102A43]/50 backdrop-blur-sm"
    >
      <div className="relative flex w-64 flex-col items-center overflow-hidden rounded-3xl border border-[#D9E8EF] bg-white px-8 py-9 shadow-2xl shadow-[#102A43]/30">

        {/* Background Decoration */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#22B8CF]/10" />
        <div className="pointer-events-none absolute -bottom-12 -left-10 h-28 w-28 rounded-full border-8 border-[#087F95]/5" />

        {/* Spinner */}
        <div className="relative flex h-20 w-20 items-center justify-center">

          {/* Track */}
          <div className="absolute inset-0 rounded-full border-4 border-[#E3F4F8]" />

          {/* Spinning arc */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#087F95] border-r-[#22B8CF]" />

          {/* Center logo */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#102A43] text-[#22B8CF] shadow-lg shadow-[#102A43]/20">
            <FiShoppingBag size={21} />
          </div>
        </div>

        {/* Text */}
        <div className="relative mt-6 text-center">
          <p className="text-base font-bold tracking-wide text-[#102A43]">
            MyStore
          </p>

          <div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-[#627D98]">
            <span>Please wait</span>

            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#087F95]" />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#22B8CF]"
                style={{ animationDelay: "0.15s" }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#087F95]"
                style={{ animationDelay: "0.3s" }}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;