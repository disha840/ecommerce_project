

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/axios/api";
import { useSelector } from "react-redux";

export default function Product() {
  const router = useRouter();

  const store = useSelector((state) => state.store.selectedStore);
  const storeId = store?._id;

  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("STORE:", store);
console.log("STORE ID:", storeId);

  useEffect(() => {
    if (!storeId) {
      setInventories([]);
      return;
    }

    const fetchStoreInventory = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/inventory/store/${storeId}`
        );
        console.log("STORE ID:", storeId);
console.log("INVENTORY RESPONSE:", response.data);

        
        // console.log("FIRST INVENTORY:", response.data.inventories?.[0]);

        if (response.data.success) {
          setInventories(response.data.inventories || []);
        } else {
          setInventories([]);
          console.log(response.data.message || "Inventory fetch nahi hui");
        }

      } catch (error) {
        console.error(
          "Inventory Error:",
          error.response?.data || error.message
        );
        setInventories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInventory();
  }, [storeId]);

  const viewProduct = (slug) => {
    router.push(`/products/${slug}`);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">

      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">
          Handpicked for you
        </p>

        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Products
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {store?.name || "Selected Store"}
        </p>
      </div>

      {!storeId ? (
        <p className="py-12 text-center text-gray-500">
          Please select your delivery location.
        </p>
      ) : loading ? (
        <p className="py-12 text-center text-gray-500">
          Loading products...
        </p>
      ) : inventories.length === 0 ? (
        <p className="py-12 text-center text-gray-500">
          No products available in this store.
        </p>
      ) : (

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">

          {inventories.map((item) => {
            const product = item.product;
            const variant = item.variant;

            if (!product || !variant) return null;

            const price = Number(variant.sellingPrice || 0);
            const originalPrice = Number(variant.mrp || price);

            const discount =
              originalPrice > price
                ? Math.round(
                    ((originalPrice - price) / originalPrice) * 100
                  )
                : 0;

            return (
              <div
                key={item._id}
                onClick={() => viewProduct(product.slug)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="relative flex h-40 items-center justify-center bg-emerald-50 sm:h-52">

                  {variant.images?.[0]?.url ||
                  product.images?.[0]?.url ? (
                    <img
                      src={
                        variant.images?.[0]?.url ||
                        product.images?.[0]?.url
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
                    {product.category?.name || "Grocery"}
                  </p>

                  <h3 className="mt-1 font-semibold text-gray-900">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {variant.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {variant.unitValue} {variant.unit}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">
                        ₹{price}
                      </span>

                      {originalPrice > price && (
                        <span className="ml-2 text-xs text-gray-400 line-through">
                          ₹{originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-emerald-700">
                    {item.availableQuantity} available
                  </p>

                </div>
              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}
