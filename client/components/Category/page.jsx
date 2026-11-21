


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import api from "@/axios/api"

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const store = useSelector((state) => state.store.selectedStore);

  useEffect(() => {
    const fetchCategories = async () => {
  try {
    if (!store?._id) {
      setCategories([]);
      return;
    }

    setLoading(true);

    const response = await api.get(
      `/inventory/store-categories/${store._id}`
    );

    const data = response.data;

    console.log("Store Categories:", data);

    if (data.success && Array.isArray(data.categories)) {
      setCategories(data.categories);
    } else {
      setCategories([]);
    }

  } catch (error) {
    console.error(
      "Error fetching store categories:",
      error.response?.data || error.message
    );
    setCategories([]);
  } finally {
    setLoading(false);
  }
};

    fetchCategories();
  }, [store?._id]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
      <div className="mb-7 flex items-end justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">
            Explore our store
          </p>

          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Shop by Category
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Everything you need, all in one place.
          </p>
        </div>

        <Link
          href="/categories"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
        >
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">
          Loading categories...
        </div>
      ) : !store?._id ? (
        <div className="py-10 text-center text-gray-500">
          Please select a store to view categories.
        </div>
      ) : categories.length > 0 ? (

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {categories.slice(0, 6).map((category, index) => {
            const colors = [
              "bg-red-50",
              "bg-green-50",
              "bg-blue-50",
              "bg-amber-50",
              "bg-orange-50",
              "bg-purple-50",
            ];

            return (
              <Link
                href={`/categories/${category.slug}`}
                key={category._id}
                className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 text-center transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
              >
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl ${
                    colors[index % colors.length]
                  } transition group-hover:scale-105`}
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">🛒</span>
                  )}
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-800">
                  {category.name}
                </h3>
              </Link>
            );
          })}
        </div>

      ) : (
        <div className="py-10 text-center">
          <div className="mb-4 text-5xl">📦</div>
          <h2 className="font-semibold text-gray-800">
            No Categories Found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            No categories are available in this store.
          </p>
        </div>
      )}
    </section>
  );
}
