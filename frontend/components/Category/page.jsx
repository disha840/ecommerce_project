
"use client";

import { useEffect, useState } from "react";



export default function Category() {
    const [categories, setCategories] = useState([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/category/showcategories"
      );
      console.log(response)

      const data = await response.json();
      setCategories(data.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  fetchCategories();
}, []);
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

    <button className="hidden text-sm font-semibold text-emerald-700 hover:text-emerald-900 sm:block">
      View All →
    </button>
  </div>

  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
    {categories.length>0 &&categories.map((category, index) => {
      const colors = [
        "bg-red-50",
        "bg-green-50",
        "bg-blue-50",
        "bg-amber-50",
        "bg-orange-50",
        "bg-purple-50",
        "bg-yellow-50",
        "bg-teal-50",
      ];

      return (
        <div
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
        </div>
      );
    })}
  </div>
</section>
  );
}
