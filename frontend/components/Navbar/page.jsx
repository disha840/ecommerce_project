

import Link from "next/link";
import {
  ShoppingCart,
  Search,
  UserRound,
  MapPin,
  ChevronDown,
  Leaf,
  Menu,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Main Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center gap-5 border-b border-emerald-100 px-5 py-4 md:px-8">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <Leaf size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
              Quick<span className="text-emerald-600">Kart</span>
            </h1>
            <p className="text-[11px] text-slate-500">
              Freshness at your doorstep
            </p>
          </div>
        </Link>

        {/* Location */}
        <div className="hidden shrink-0 items-center gap-2 rounded-xl px-2 py-2 sm:flex">
          <MapPin size={22} className="text-emerald-700" />

          <div>
            <p className="text-xs text-slate-500">
              Delivering to
            </p>
            <p className="flex items-center gap-1 text-sm font-semibold text-slate-800">
              Select your location
              <ChevronDown size={14} />
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-emerald-100 bg-emerald-50/50 p-1.5 transition focus-within:border-emerald-400">
          <Search
            size={20}
            className="ml-3 shrink-0 text-emerald-700"
          />

          <input
            type="text"
            placeholder="Search for groceries..."
            className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Login */}
        <Link
          href="/login"
          className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <UserRound size={21} />
          </span>

          <span className="text-sm font-semibold">
            Login
          </span>
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <ShoppingCart size={20} />
          Cart
        </Link>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-b border-emerald-100 bg-emerald-50/60">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-5 md:gap-8 md:px-8">

          {/* All Categories */}
          <Link
            href="/categories"
            className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white hover:text-emerald-700"
          >
            <Menu size={20} />
            All Categories
            <ChevronDown size={15} />
          </Link>

          {/* Home */}
          <Link
            href="/"
            className="shrink-0 border-b-2 border-emerald-600 px-4 py-4 text-sm font-bold text-emerald-700"
          >
            Home
          </Link>

          {/* All Products */}
          <Link
            href="/products"
            className="shrink-0 border-b-2 border-transparent px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
          >
            All Products
          </Link>
        </div>
      </div>
    </header>
  );
}
