
"use client";

import { useEffect, useState } from "react";
export default function Product() {
    const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/products/showproducts"
      );

      const data = await response.json();

      console.log("Products response:", data);

      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
}, []);
  return (
    
<section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
  <div className="mb-7 flex items-end justify-between">
    <div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">
        Handpicked for you
      </p>

      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
        Popular Products
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Fresh picks for your everyday needs.
      </p>
    </div>

    <button className="hidden text-sm font-semibold text-emerald-700 hover:text-emerald-900 sm:block">
      View All →
    </button>
  </div>

  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
    {products.map((product) => {
      const price = Number(product.price ?? 0);
      const originalPrice = Number(
        product.originalPrice ?? product.mrp ?? price
      );

      const discount =
        originalPrice > price
          ? Math.round(
              ((originalPrice - price) / originalPrice) * 100
            )
          : 0;

      return (
        <div
          key={product._id}
          className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="relative flex h-40 items-center justify-center bg-emerald-50 sm:h-52">
            {product.images?.[0] ? (
              <img
                src={
                  typeof product.images[0] === "string"
                    ? product.images[0]
                    : product.images[0].url
                }
                alt={product.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="text-6xl">🛒</span>
            )}

            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="p-4">
            <p className="text-xs text-gray-500">
              {typeof product.category === "object"
                ? product.category?.name
                : product.category || "Grocery"}
            </p>

            <h3 className="mt-1 font-semibold text-gray-900">
              {product.name}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {product.unit || ""}
            </p>

            <div className="mt-4 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-gray-900">
                  ₹{price}
                </span>

                {discount > 0 && (
                  <span className="ml-2 text-xs text-gray-400 line-through">
                    ₹{originalPrice}
                  </span>
                )}
              </div>

              <button className="rounded-lg border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white">
                + Add
              </button>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</section>

  );
}
