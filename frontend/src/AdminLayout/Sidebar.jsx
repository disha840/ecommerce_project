import React from "react";
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
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "User", icon: Users, path: "/admin/users" },
    { name: "Role", icon: ShieldCheck, path: "/admin/role" },
    { name: "Store", icon: Store, path: null },
    { name: "Category", icon: Tags, path: "/admin/category" },
    { name: "Subcategory", icon: FolderTree, path: null },
    { name: "Brand", icon: Tag, path: "/admin/brand" },
    { name: "Inventory", icon: Boxes, path: null },
    { name: "Product", icon: Package, path: null },
  ];

  return (
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

      {/* Bottom Note */}
      <div className="mt-auto pt-8 px-3">
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
  );
};

export default Sidebar;