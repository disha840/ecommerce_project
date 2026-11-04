
"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiShoppingBag } from "react-icons/fi";
import api from "@/axios/api"

function SubcategoryProducts() {
  const { subId } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(
          `/products/showsubcategory/${subId}`
        );

        setProducts(res.data.products || []);
      } catch (error) {
        console.log("Products fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (subId) {
      fetchProducts();
    }
  }, [subId]);

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Products
      </h1>

      {products.length === 0 ? (
        <div className="py-16 text-center">
          <FiShoppingBag className="mx-auto mb-3 text-4xl text-gray-400" />
          <p className="text-gray-600">
            No products found in this subcategory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <Link
              href={`/products/${product.slug}`}
              key={product._id}
              className="rounded-xl border border-gray-200 bg-white p-3 transition hover:shadow-md"
            >
              <div className="relative mb-3 h-40 w-full">
                {product.images?.[0]?.url && (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="rounded-lg object-contain"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                )}
              </div>

              <h2 className="line-clamp-2 font-semibold text-gray-800">
                {product.name}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {product.unit}
              </p>

              
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading products...</div>}>
      <SubcategoryProducts />
    </Suspense>
  );
}
