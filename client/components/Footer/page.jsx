
           "use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold text-white">
              Fresh<span className="text-emerald-400">Mart</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
              Fresh groceries, everyday essentials, and quality products
              delivered straight to your doorstep.
            </p>

            
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="transition hover:text-emerald-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-emerald-400">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="transition hover:text-emerald-400">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-emerald-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-emerald-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Customer Support
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/profile" className="transition hover:text-emerald-400">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="transition hover:text-emerald-400">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="transition hover:text-emerald-400">
                  Shipping Policy
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Get In Touch
            </h3>

            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <span className="mb-1 block font-medium text-white">
                  bhakrota
                </span>
                jaipur, India
              </li>

              <li>
                <span className="mb-1 block font-medium text-white">
                  Email
                </span>
                support@example.com
              </li>

              <li>
                <span className="mb-1 block font-medium text-white">
                  Phone
                </span>
                +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-400">
            © {year} FreshMart. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="transition hover:text-emerald-400">
              Privacy Policy
            </Link>

            <Link href="/terms" className="transition hover:text-emerald-400">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}