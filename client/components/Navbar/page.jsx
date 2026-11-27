

"use client";

import api from "@/axios/api";
import { useDispatch, useSelector } from "react-redux";
import { getCart, clearCart } from "@/redux/Slices/cartSlice";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Login from "@/components/login/page";
import Signup from "@/components/signup/page";
import { logout, checkAuth } from "@/redux/Slices/AuthSlice";
import DeliveryLocation from "../location/DeliveryLocation";
import { setShowLogin, setShowSignup } from "@/redux/Slices/uiSlice";

import {
  ShoppingCart,
  Search,
  UserRound,
  LogOut,
  ChevronDown,
  Leaf,
  Menu,
  Heart,
  X,
  Package,
  Tag,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);

  // Search States
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const user = useSelector((state) => state.auth.user);

  const { showLogin, showSignup } = useSelector(
    (state) => state.ui
  );

  const store = useSelector(
    (state) => state.store.selectedStore
  );

  const { items } = useSelector((state) => state.cart);

  // Close dropdown and search on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Stop background scroll when modal opens
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

  // Check Login
  useEffect(() => {
    dispatch(checkAuth()).then((result) => {
      console.log("CheckAuth Result:", result);
    });
  }, [dispatch]);

  // Fetch Cart
  useEffect(() => {
    if (!user) {
      dispatch(clearCart());
      return;
    }

    if (!store?._id) {
      return;
    }

    dispatch(getCart());
  }, [user, store?._id, dispatch]);

  // Search Product and Category
  useEffect(() => {
    const query = searchText.trim();

    if (query.length < 2 || !store?._id) {
      setCategories([]);
      setProducts([]);
      setLoading(false);
      return;
    }

    let isActive = true;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await api.get(
          "/product/search-suggestions",
          {
            params: {
              storeId: store._id,
              q: query,
            },
          }
        );

        if (isActive) {
          setCategories(response.data.categories || []);
          setProducts(response.data.products || []);
        }
      } catch (error) {
        if (isActive) {
          console.log("Search Error:", error);
          setCategories([]);
          setProducts([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [searchText, store?._id]);

  // Open Category
  const handleCategoryClick = (category) => {
    setSearchText("");
    setShowSuggestions(false);
    router.push(`/categories/${category.slug}`);
  };

  // Open Product
  const handleProductClick = (product) => {
    setSearchText("");
    setShowSuggestions(false);

    router.push(
      `/products?category=${encodeURIComponent(
        product.category?.slug || ""
      )}&product=${encodeURIComponent(product.slug)}`
    );
  };

  // Clear Search
  const handleClearSearch = () => {
    setSearchText("");
    setCategories([]);
    setProducts([]);
    setShowSuggestions(false);
  };

  // Logout
  const handleLogout = async () => {
    try {
      const response = await api.post("/api/logout");

      if (response.data.status) {
        dispatch(logout());
        dispatch(clearCart());
        setShowDropdown(false);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Clear suggestions on route change
  useEffect(() => {
    setShowSuggestions(false);
  }, [pathname]);

  return (
    <>
      {/* Login Modal */}
      {showLogin && (
        <Login
          setShowLogin={(value) => dispatch(setShowLogin(value))}
          setShowSignup={(value) => dispatch(setShowSignup(value))}
        />
      )}

      {/* Signup Modal */}
      {showSignup && (
        <Signup
          setShowLogin={(value) => dispatch(setShowLogin(value))}
          setShowSignup={(value) => dispatch(setShowSignup(value))}
        />
      )}

      <header className="sticky top-0 z-50 bg-white">
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

          {/* Delivery Location */}
          <div className="hidden shrink-0 sm:block">
            <DeliveryLocation />
          </div>

          {/* Search */}
          <div
            className="relative flex min-w-0 flex-1"
            ref={searchRef}
          >
            <div className="flex w-full min-w-0 items-center rounded-2xl border border-emerald-100 bg-emerald-50/50 p-1.5 transition focus-within:border-emerald-400">

              <Search
                size={20}
                className="ml-3 shrink-0 text-emerald-700"
              />

              <input
                type="text"
                value={searchText}
                placeholder="Search for groceries..."
                onChange={(event) => {
                  setSearchText(event.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (searchText.trim().length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
                className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              {searchText && (
                <button
                  onClick={handleClearSearch}
                  className="mr-2 rounded-full p-1 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            {showSuggestions && searchText.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full z-[100] mt-2 max-h-[420px] overflow-y-auto rounded-2xl border border-emerald-100 bg-white shadow-xl">

                {/* Loading */}
                {loading && (
                  <div className="px-5 py-5 text-center text-sm text-slate-500">
                    Searching...
                  </div>
                )}

                {!loading && (
                  <>
                    {/* Categories */}
                    {categories.length > 0 && (
                      <div className="p-3">
                        <div className="mb-2 flex items-center gap-2 px-2">
                          <Tag
                            size={16}
                            className="text-emerald-600"
                          />

                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Categories
                          </h3>
                        </div>

                        {categories.map((category) => (
                          <button
                            key={category._id}
                            onClick={() =>
                              handleCategoryClick(category)
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-emerald-50"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                              <Tag size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-800">
                                {category.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                View Category
                              </p>
                            </div>

                            <ChevronDown
                              size={16}
                              className="-rotate-90 text-slate-400"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Divider */}
                    {categories.length > 0 && products.length > 0 && (
                      <div className="mx-4 border-t border-emerald-100" />
                    )}

                    {/* Products */}
                    {products.length > 0 && (
                      <div className="p-3">
                        <div className="mb-2 flex items-center gap-2 px-2">
                          <Package
                            size={16}
                            className="text-emerald-600"
                          />

                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Products
                          </h3>
                        </div>

                        {products.map((product) => (
                          <button
                            key={product._id}
                            onClick={() =>
                              handleProductClick(product)
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-emerald-50"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                              <Package size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-800">
                                {product.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                {product.category?.name || "Product"}
                              </p>
                            </div>

                            <Search
                              size={16}
                              className="text-slate-400"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No Results */}
                    {categories.length === 0 &&
                      products.length === 0 && (
                        <div className="px-5 py-8 text-center">
                          <Search
                            size={28}
                            className="mx-auto mb-2 text-slate-300"
                          />

                          <p className="text-sm font-semibold text-slate-700">
                            No results found
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Try searching for another product or category.
                          </p>
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* User Login / Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 font-semibold text-white"
              >
                {user?.firstName?.charAt(0).toUpperCase()}
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-xl">

                  {/* User Information */}
                  <div className="border-b border-[#D9E8EF] bg-[#F0FAFC] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#087F95] text-lg font-semibold text-white">
                        {user?.firstName?.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#102A43]">
                          {user?.firstName} {user?.lastName}
                        </p>

                        <p className="truncate text-xs text-[#627D98]">
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
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[#102A43] transition-all duration-200 hover:bg-[#F0FAFC]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D7F2F6]">
                        <UserRound size={18} className="text-[#087F95]" />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-semibold">My Profile</p>
                        <p className="text-xs text-[#627D98]">
                          View your account details
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/wishlist");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[#102A43] transition-all duration-200 hover:bg-[#F0FAFC]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D7F2F6]">
                        <Heart size={18} className="text-[#087F95]" />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-semibold">My Wishlist</p>
                        <p className="text-xs text-[#627D98]">
                          View your saved products
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-red-600 transition-all duration-200 hover:bg-red-50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                        <LogOut size={18} />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-semibold">Logout</p>
                        <p className="text-xs text-red-400">
                          Sign out of your account
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
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

          {/* Cart */}
          {user ? (
            <Link
              href="/cart"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <ShoppingCart size={20} />
              Cart ({items.length})
            </Link>
          ) : (
            <button
              onClick={() => dispatch(setShowLogin(true))}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <ShoppingCart size={20} />
              Cart
            </button>
          )}
        </nav>

        {/* Navigation Links */}
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
