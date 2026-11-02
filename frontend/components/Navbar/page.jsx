
"use client";
import api from "@/axios/api";
import { useDispatch ,useSelector} from "react-redux";
import { getCart } from "@/redux/Slices/cartSlice";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Login from "@/components/login/page";
import Signup from "@/components/signup/page";
import {logout} from "@/redux/Slices/AuthSlice"
import { checkAuth } from "@/redux/Slices/AuthSlice";
import { setShowLogin,setShowSignup } from "@/redux/Slices/uiSlice";
import { clearCart } from "@/redux/Slices/cartSlice";
import Router from "next/router";

import {
  ShoppingCart,
  Search,
  UserRound,
  LogOut,
  MapPin,
  ChevronDown,
  Leaf,
  Menu,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router=useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
const user  = useSelector((state) => state.auth.user);

const dispatch = useDispatch();

 const { showLogin, showSignup } = useSelector(
    (state) => state.ui
);

const { items } = useSelector((state) => state.cart);
  // Modal open hone par background scroll band karna
  useEffect(() => {
    if (showLogin || showSignup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLogin, showSignup]);

useEffect(() => {
  
  dispatch(checkAuth());
  
}, []);

 useEffect(() => {
  
        dispatch(getCart());
  
    },[]);

    const handleLogout = async () => {
  try {
    const response = await api.post("/api/logout");

    if (response.data.status) {
      dispatch(logout());
      setShowDropdown(false);
      dispatch(clearCart());
      router.push("/");
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      {/* Login Modal */}
      {/* {showLogin && (
        <Login setShowLogin={setShowLogin}
        setShowSignup={setShowSignup}
         
        />
      )} */}
      {showLogin && (
    <Login
        setShowLogin={(value) => dispatch(setShowLogin(value))}
        setShowSignup={(value) => dispatch(setShowSignup(value))}
    />
)}

      {showSignup && (
    <Signup
        setShowLogin={(value) => dispatch(setShowLogin(value))}
        setShowSignup={(value) => dispatch(setShowSignup(value))}
    />
)}

      <header className="sticky top-0 z-50 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center gap-5 border-b border-emerald-100 px-5 py-4 md:px-8">

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

          <div className="hidden shrink-0 items-center gap-2 rounded-xl px-2 py-2 sm:flex">
            <MapPin size={22} className="text-emerald-700" />

            <div>
              <p className="text-xs text-slate-500">Delivering to</p>

              <p className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                Select your location
                <ChevronDown size={14} />
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-emerald-100 bg-emerald-50/50 p-1.5 transition focus-within:border-emerald-400">
            <Search size={20} className="ml-3 shrink-0 text-emerald-700" />

            <input
              type="text"
              placeholder="Search for groceries..."
              className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

         
          {user ? (
  <div className="relative">
    <button
      onClick={() => setShowDropdown(!showDropdown)}
      className="w-10 h-10 rounded-full bg-cyan-600 text-white font-semibold"
    >
      {user?.firstName?.charAt(0).toUpperCase()}
    </button>


    {showDropdown && (
  <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-xl border border-[#D9E8EF] z-50 overflow-hidden">

    {/* User Information */}
    <div className="px-4 py-4 bg-[#F0FAFC] border-b border-[#D9E8EF]">
      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-full bg-[#087F95] text-white flex items-center justify-center text-lg font-semibold">
          {user?.firstName?.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#102A43] truncate">
            {user?.firstName} {user?.lastName}
          </p>

          <p className="text-xs text-[#627D98] truncate">
            {user?.email}
          </p>
        </div>

      </div>
    </div>

    {/* Menu Items */}
    <div className="p-2">

      <button
        onClick={() => {
          setShowDropdown(false);
          router.push("/profile");
        }}
        className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-[#102A43] hover:bg-[#F0FAFC] transition-all duration-200"
      >
        <div className="w-9 h-9 rounded-lg bg-[#D7F2F6] flex items-center justify-center">
          <UserRound size={18} className="text-[#087F95]" />
        </div>

        <div className="text-left">
          <p className="text-sm font-semibold">My Profile</p>
          <p className="text-xs text-[#627D98]">View your account details</p>
        </div>
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
      >
        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
          <LogOut size={18} />
        </div>

        <div className="text-left">
          <p className="text-sm font-semibold">Logout</p>
          <p className="text-xs text-red-400">Sign out of your account</p>
        </div>
      </button>

    </div>
  </div>
)}
  </div>
) :  (
  <button
    onClick={() => {
      dispatch(setShowLogin(true));
      setShowDropdown(false);
    }}
    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-95"
  >
    <UserRound size={18} />
    Login
  </button>
)}

  



          <Link
            href="/cart"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <ShoppingCart size={20} />
              Cart ({items.length})
          </Link>

        </nav>

        <div className="border-b border-emerald-100 bg-emerald-50/60">
          <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-5 md:gap-8 md:px-8">

            <Link
              href="/categories"
              className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white hover:text-emerald-700"
            >
              <Menu size={20} />
              All Categories
              <ChevronDown size={15} />
            </Link>

            <Link
              href="/"
              className={`shrink-0 border-b-2 px-4 py-4 text-sm font-semibold transition ${
                pathname === "/"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
              }`}
            >
              Home
            </Link>

            <Link
              href="/products"
              className={`shrink-0 border-b-2 px-4 py-4 text-sm font-semibold transition ${
                pathname.startsWith("/products")
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
              }`}
            >
              All Products
            </Link>

          </div>
        </div>
      </header>
    </>
  );
}