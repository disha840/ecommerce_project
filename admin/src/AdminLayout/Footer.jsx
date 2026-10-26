
import React from "react";
import { ShoppingBag } from "lucide-react";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 border-t border-[#D9E8EF] bg-white px-4 py-4 text-[#102A43] sm:flex-row sm:px-6">

      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
          <ShoppingBag size={18} strokeWidth={1.8} />
        </div>

        <div>
          <p className="text-sm font-bold leading-none tracking-tight text-[#102A43]">
            MyStore
          </p>

          <p className="mt-1 text-[9px] font-semibold tracking-[2px] text-[#087F95]">
            ADMIN PANEL
          </p>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-xs text-[#627D98]">
        © 2026 MyStore. All rights reserved.
      </p>

      {/* Links */}
      <nav className="flex items-center gap-4 text-xs font-medium">
        <a
          href="#"
          className="text-[#486581] transition-colors hover:text-[#087F95]"
        >
          Privacy
        </a>

        <a
          href="#"
          className="text-[#486581] transition-colors hover:text-[#087F95]"
        >
          Terms
        </a>

        <a
          href="#"
          className="text-[#486581] transition-colors hover:text-[#087F95]"
        >
          Support
        </a>
      </nav>

    </footer>
  );
};

export default Footer;
