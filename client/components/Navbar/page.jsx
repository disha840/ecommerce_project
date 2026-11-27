
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
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const { showLogin, showSignup } = useSelector(
    (state) => state.ui
  );

  const store = useSelector((state) => state.store.selectedStore);

  const { items } = useSelector((state) => state.cart);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");

  const [suggestions, setSuggestions] = useState({
    categories: [],
    products: [],
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [noProductsFound, setNoProductsFound] = useState(false);

  const searchRef = useRef(null);

  // Dropdown ke bahar click karne par close hoga
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search dropdown ke bahar click karne par close hoga
  useEffect(() => {
    const handleSearchClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleSearchClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleSearchClickOutside
      );
    };
  }, []);

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

  // Check Login
  useEffect(() => {
    dispatch(checkAuth()).then((result) => {
      console.log("CheckAuth Result:", result);
    });
  }, [dispatch]);

  // Login hone par hi cart fetch hoga
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

  // Search suggestions API with 300ms debounce
  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2 || !store?._id) {
      setSuggestions({
        categories: [],
        products: [],
      });

      setNoProductsFound(false);
      setSearchLoading(false);

      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        setNoProductsFound(false);

        const response = await api.get(
          "/inventory/search-suggestions",
          {
            params: {
              storeId: store._id,
              q: query,
            },
            signal: controller.signal,
          }
        );

        setSuggestions({
          categories: response.data.categories || [],
          products: response.data.products || [],
        });

      } catch (error) {
        if (error.name !== "CanceledError") {
          console.log("Search error:", error);

          setSuggestions({
            categories: [],
            products: [],
          });
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, store?._id]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");

    setSuggestions({
      categories: [],
      products: [],
    });

    setShowSuggestions(false);
    setNoProductsFound(false);
  };

  // Product click
  const handleProductClick = (product) => {
    clearSearch();

    router.push(`/variants/${product.slug}`);
  };

  // Category click
  const handleCategoryClick = (category) => {
    clearSearch();

    router.push(`/categories/${category._id}`);
  };

  // Enter press
  const handleSearchSubmit = async (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const query = searchQuery.trim();

    if (query.length < 2) return;

    if (!store?._id) {
      setNoProductsFound(true);
      setShowSuggestions(true);
      return;
    }

    try {
      setSearchLoading(true);
      setNoProductsFound(false);

      const response = await api.get(
        "/inventory/search-suggestions",
        {
          params: {
            storeId: store._id,
            q: query,
          },
        }
      );

      const products = response.data.products || [];

      if (products.length > 0) {
        handleProductClick(products[0]);
      } else {
        setSuggestions({
          categories: response.data.categories || [],
          products: [],
        });

        setNoProductsFound(true);
        setShowSuggestions(true);
      }

    } catch (error) {
      console.log("Search submit error:", error);

      setNoProductsFound(true);
      setShowSuggestions(true);

    } finally {
      setSearchLoading(false);
    }
  };

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
            ref={searchRef}
            className="relative flex min-w-0 flex-1 items-center rounded-2xl border border-emerald-100 bg-emerald-50/50 p-1.5 transition focus-within:border-emerald-400"
          >
            <Search
              size={20}
              className="ml-3 shrink-0 text-emerald-700"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
                setNoProductsFound(false);
              }}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) {
                  setShowSuggestions(true);
                }
              }}
              onKeyDown={handleSearchSubmit}
              placeholder="Search for groceries..."
              className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />

            {searchLoading && (
              <div className="mr-3 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            )}

            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="mr-2 text-slate-400 transition hover:text-slate-700"
              >
                <X size={18} />
              </button>
            )}

            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 top-full z-[100] mt-2 max-h-[450px] w-full overflow-y-auto rounded-2xl border border-emerald-100 bg-white shadow-xl">

                {searchLoading ? (
                  <div className="p-5 text-center text-sm text-slate-500">
                    Searching...
                  </div>
                ) : noProductsFound ? (
                  <div className="p-6 text-center">
                    <Search
                      size={30}
                      className="mx-auto mb-2 text-slate-300"
                    />

                    <p className="font-semibold text-slate-700">
                      No products found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try searching with another product name
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Categories */}
                    {suggestions.categories.length > 0 && (
                      <div className="p-3">
                        <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                          Categories
                        </p>

                        {suggestions.categories.map((category) => (
                          <button
                            type="button"
                            key={category._id}
                            onClick={() => handleCategoryClick(category)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-emerald-50"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                              <Search
                                size={17}
                                className="text-emerald-700"
                              />
                            </div>

                            <span className="text-sm font-medium text-slate-700">
                              {category.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Products */}
                    {suggestions.products.length > 0 && (
                      <div className="border-t border-emerald-100 p-3">
                        <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                          Products
                        </p>

                        {suggestions.products.map((product) => (
                          <button
                            type="button"
                            key={product._id}
                            onClick={() => handleProductClick(product)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-emerald-50"
                          >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50">
                              <img
                                src={
                                  product.images?.[0]?.url ||
                                  product.variants?.[0]?.images?.[0]?.url ||
                                  "/placeholder.png"
                                }
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-800">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {product.category?.name}
                              </p>
                            </div>

                            <Search
                              size={16}
                              className="shrink-0 text-emerald-600"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {!searchLoading &&
                      suggestions.products.length === 0 &&
                      suggestions.categories.length === 0 && (
                        <div className="p-5 text-center text-sm text-slate-500">
                          No suggestions found
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
                      className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-[#102A43] hover:bg-[#F0FAFC] transition-all duration-200"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#D7F2F6] flex items-center justify-center">
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
                      className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
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

          {/* Cart - Only for Logged In User */}
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
