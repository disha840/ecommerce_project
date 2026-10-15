import React from "react";
import { ShoppingBag } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#FFF9F6] text-[#713F50] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#EBD9D9]">

      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#F0DDE1] text-[#96566A] flex items-center justify-center">
          <ShoppingBag size={17} strokeWidth={1.8} />
        </div>

        <div>
          <p className="text-sm font-bold tracking-tight leading-none">
            MyStore
          </p>
          <p className="text-[9px] tracking-[3px] text-[#96566A] font-medium mt-1">
            ADMIN PANEL
          </p>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-xs text-[#A17B86] text-center">
        © 2026 MyStore. All rights reserved.
      </p>

      {/* Links */}
      <nav className="flex items-center gap-4 text-xs font-medium">
        <a href="#" className="text-[#96566A] hover:text-[#B65D70] transition-colors">
          Privacy
        </a>
        <a href="#" className="text-[#96566A] hover:text-[#B65D70] transition-colors">
          Terms
        </a>
        <a href="#" className="text-[#96566A] hover:text-[#B65D70] transition-colors">
          Support
        </a>
      </nav>

    </footer>
  );
};

export default Footer;