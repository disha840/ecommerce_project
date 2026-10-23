
import React, { useState } from "react";
import api from "../api";
import { useNavigate, useLocation } from "react-router-dom";
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
  X,
} from "lucide-react";
import { FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "User", icon: Users, path: "/admin/users" },
    { name: "Role", icon: ShieldCheck, path: "/admin/role" },
    { name: "Store", icon: Store, path: "/admin/store" },
    { name: "Category", icon: Tags, path: "/admin/category" },
    { name: "Subcategory", icon: FolderTree, path: "/admin/subcategory" },
    { name: "Brand", icon: Tag, path: "/admin/brand" },
    { name: "Inventory", icon: Boxes, path: null },
    { name: "Product", icon: Package, path: "/admin/products" },
    { name: "Product-Variant", icon: Package, path: "/admin/productvariant" },
  ];

  const logoutHandler =async () => {
     try {
    await api.post(
      "http://localhost:3000/admin/logout",
      {},
      { withCredentials: true }
    );

    localStorage.removeItem("isloggedIn");
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  } catch (error) {
    console.log("Logout failed:", error);
  }
  };

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#FFF9F6] text-[#713F50] border-r border-[#EBD9D9] p-4">

        {/* Menu Heading */}
        <div className="px-3 pt-3 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-[#A17B86]">
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
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  }
                }}
                className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-sm text-left transition-all duration-200 ${
                  isActive
                    ? "bg-[#96566A] text-white shadow-sm font-semibold"
                    : "text-[#713F50] hover:bg-[#F0DDE1]"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={isActive ? "text-white" : "text-[#96566A]"}
                />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-sm font-medium text-[#713F50] hover:bg-[#F0DDE1] transition-all duration-200"
          >
            <FiLogOut size={19} className="text-[#96566A]" />
            <span>Logout</span>
          </button>
        </div>

        {/* Bottom Note */}
        <div className="pt-5 px-3">
          <div className="border-t border-[#EBD9D9] pt-4">
            <p className="text-xs text-[#A17B86]">
              MyStore Admin Panel
            </p>
            <p className="text-xs text-[#B5A0A5] mt-1">
              Manage your store easily
            </p>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-[#EBD9D9] bg-[#FFF9F6] p-6 shadow-xl">

            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-[#A17B86] hover:bg-[#F0DDE1]"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0DDE1]">
                <FiLogOut size={28} className="text-[#96566A]" />
              </div>

              <h2 className="text-xl font-bold text-[#713F50]">
                Are you sure you want to logout?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#A17B86]">
                You will need to log in again to access your admin dashboard.
              </p>

              <div className="mt-6 flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-xl border border-[#EBD9D9] bg-white px-4 py-3 text-sm font-semibold text-[#713F50] transition hover:bg-[#F0DDE1]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={logoutHandler}
                  className="flex-1 rounded-xl bg-[#96566A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#713F50]"
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