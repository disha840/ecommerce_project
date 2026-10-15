import React from "react";
import {
  ShoppingBag,
  Bell,
  ChevronDown,
} from "lucide-react";

const Header = () => {
  return (
    <header className="bg-[#FFF9F6] text-[#713F50] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 border-b border-[#EBD9D9] shadow-sm">

      {/* Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-11 h-11 rounded-xl bg-[#F0DDE1] text-[#96566A] flex items-center justify-center">
          <ShoppingBag size={23} strokeWidth={1.8} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">
            MyStore
          </h1>
          <p className="text-[10px] tracking-[3px] text-[#96566A] font-medium">
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
          className="relative p-2 rounded-xl hover:bg-[#F7E9E9] transition-colors"
        >
          <Bell size={22} strokeWidth={1.8} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#B65D70] rounded-full border-2 border-[#FFF9F6]" />
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-2 sm:gap-3 rounded-xl p-1.5 hover:bg-[#F7E9E9] transition-colors"
        >
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold">Disha</p>
            <p className="text-xs text-[#A17B86]">Admin</p>
          </div>

          <div className="w-10 h-10 rounded-full bg-[#96566A] text-white flex items-center justify-center font-semibold">
            D
          </div>

          <ChevronDown size={16} className="hidden sm:block text-[#96566A]" />
        </button>

      </div>
    </header>
  );
};

export default Header;