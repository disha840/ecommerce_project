
import React from "react";
import {
  ShoppingBag,
  Bell,
  ChevronDown,
} from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[#D9E8EF] bg-white px-4 py-3 text-[#102A43] shadow-sm sm:px-6">

      {/* Logo */}
      <div className="flex shrink-0 items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
          <ShoppingBag size={23} strokeWidth={1.8} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#102A43]">
            MyStore
          </h1>

          <p className="text-[10px] font-semibold tracking-[3px] text-[#087F95]">
            ADMIN PANEL
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-5">

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl p-2 text-[#486581] transition-colors hover:bg-[#F0FAFC] hover:text-[#087F95]"
        >
          <Bell size={22} strokeWidth={1.8} />

          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#22B8CF]" />
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-[#F0FAFC] sm:gap-3"
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[#102A43]">
              Disha
            </p>

            <p className="text-xs text-[#627D98]">
              Admin
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#D7F2F6] bg-[#102A43] font-semibold text-white">
            D
          </div>

          <ChevronDown
            size={16}
            className="hidden text-[#087F95] sm:block"
          />
        </button>

      </div>
    </header>
  );
};

export default Header;
