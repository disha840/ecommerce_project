
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api";
import { setUser } from "../redux/Slices/authSlice";

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Store,
  Tags,
  FolderTree,
  Tag,
  Boxes,
  Package,
  ShoppingBag,
  ChevronRight,
  X,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      name: "User",
      icon: Users,
      path: "/admin/users",
    },
    {
      name: "Role",
      icon: ShieldCheck,
      path: "/admin/role",
    },
    {
      name: "Store",
      icon: Store,
      path: "/admin/store",
    },
    {
      name: "Category",
      icon: Tags,
      path: "/admin/category",
    },
    {
      name: "Subcategory",
      icon: FolderTree,
      path: "/admin/subcategory",
    },
    {
      name: "Brand",
      icon: Tag,
      path: "/admin/brand",
    },
    {
      name: "Inventory",
      icon: Boxes,
      path: null,
    },
    {
      name: "Product",
      icon: Package,
      path: "/admin/products",
    },
    {
      name: "Product-Variant",
      icon: ShoppingBag,
      path: "/admin/productvariant",
    },
  ];

  const logoutHandler = async () => {
    try {
      await api.post(
        "/admin/logout",
        {},
        { withCredentials: true }
      );

      dispatch(setUser(null));
      setShowLogoutModal(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  return (
    <>
      <aside className="hidden md:flex h-full w-64 shrink-0 flex-col overflow-y-auto bg-[#102A43] px-4 py-5 text-white shadow-xl">

        {/* Logo Section */}
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22B8CF] shadow-lg shadow-cyan-950/30">
            <ShoppingBag
              size={24}
              strokeWidth={2.2}
              className="text-[#102A43]"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">
              MyStore
            </h1>
            <p className="mt-1 text-[10px] font-semibold tracking-[2px] text-[#8EDCE8]">
              ADMIN PANEL
            </p>
          </div>
        </div>

        {/* Menu Heading */}
        <div className="mb-3 px-3">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#8AA9BF]">
            Main Menu
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.path &&
              (location.pathname === item.path ||
                (item.path !== "/admin/dashboard" &&
                  location.pathname.startsWith(item.path + "/")));

            return (
              <button
                key={item.name}
                type="button"
                disabled={!item.path}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  }
                }}
                className={`group relative flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition-all duration-200 ${
                  isActive
                    ? "border-[#22B8CF]/40 bg-[#22B8CF] font-semibold text-[#102A43] shadow-md shadow-cyan-950/20"
                    : item.path
                    ? "border-transparent text-[#D7E7F0] hover:border-white/10 hover:bg-white/10 hover:text-white"
                    : "cursor-not-allowed border-transparent text-[#6F8CA3]/70"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.3 : 1.8}
                  className={`shrink-0 transition-transform duration-200 ${
                    isActive
                      ? "text-[#102A43]"
                      : item.path
                      ? "text-[#71D4E2] group-hover:scale-110 group-hover:text-[#B7F0F6]"
                      : "text-[#6F8CA3]/70"
                  }`}
                />

                <span className="flex-1">{item.name}</span>

                {isActive && (
                  <ChevronRight
                    size={17}
                    className="text-[#102A43]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-8">

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-[#D7E7F0] transition-all duration-200 hover:border-[#22B8CF]/30 hover:bg-[#22B8CF]/10 hover:text-white"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors group-hover:bg-[#22B8CF]/20">
              <LogOut
                size={18}
                className="text-[#71D4E2]"
              />
            </div>

            <span>Logout</span>
          </button>

          {/* Footer Card */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22B8CF]/15">
                <ShieldCheck
                  size={19}
                  className="text-[#71D4E2]"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  MyStore Admin
                </p>
                <p className="mt-1 text-[10px] text-[#8AA9BF]">
                  Manage your store easily
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl border border-[#D9E8EF] bg-white p-7 shadow-2xl">

            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-[#627D98] transition hover:bg-[#F0FAFC] hover:text-[#102A43]"
              aria-label="Close modal"
            >
              <X size={19} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D7F2F6]">
                <LogOut
                  size={28}
                  className="text-[#087F95]"
                />
              </div>

              <h2 className="text-xl font-bold text-[#102A43]">
                Confirm Logout
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#627D98]">
                Are you sure you want to log out of your admin account?
              </p>

              <div className="mt-7 flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-xl border border-[#D9E8EF] bg-white px-4 py-3 text-sm font-semibold text-[#243B53] transition hover:bg-[#F0FAFC]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={logoutHandler}
                  className="flex-1 rounded-xl bg-[#087F95] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-900/10 transition hover:bg-[#066779]"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
