
"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";
import api from "@/axios/api";

function SubcategoryProducts() {
  const { slug, subslug } = useParams();

  const selectedStore = useSelector(
    (state) => state.store.selectedStore
  );

  const storeId =
    typeof selectedStore === "object"
      ? selectedStore?._id
      : selectedStore;

  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all subcategories of selected category
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setSubcategories([]);

        if (!storeId || !slug) {
          return;
        }

        const res = await api.get(
          `/inventory/store-subcategories/${storeId}/${slug}`
        );

        if (
          res.data.success &&
          Array.isArray(res.data.subcategories)
        ) {
          setSubcategories(res.data.subcategories);
        } else {
          setSubcategories([]);
        }
      } catch (error) {
        console.log("Subcategories fetch error:", error);
        setSubcategories([]);
      }
    };

    fetchSubcategories();
  }, [slug, storeId]);

  // Fetch products of selected subcategory
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setProducts([]);

        const res = await api.get(
          `/inventory/store/${storeId}/subcategory/${subslug}/products`
        );

        setProducts(res.data.products || []);
      } catch (error) {
        console.log("Products fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (subslug && storeId) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [subslug, storeId]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* All Subcategories */}
        <div className="mb-8 border-b border-gray-200 pb-6">

          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#087F95]">
            Shop by category
          </p>

          <h1 className="text-2xl font-bold text-[#102A43] sm:text-3xl">
            Explore Subcategories
          </h1>

          <div className="mt-5 flex flex-wrap gap-3">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory._id}
                href={`/categories/${slug}/${subcategory.slug}`}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
                  subslug === subcategory.slug
                    ? "border-[#087F95] bg-[#087F95] text-white shadow-md"
                    : "border-gray-200 bg-white text-[#102A43] hover:border-[#087F95] hover:text-[#087F95]"
                }`}
              >
                {subcategory.name}
              </Link>
            ))}
          </div>

        </div>

        {/* Products Heading */}
        <div className="mb-8 flex flex-col justify-between gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#087F95]">
              Selected Subcategory
            </p>

            <h2 className="text-2xl font-bold text-[#102A43] sm:text-3xl">
              Products
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Explore products available in this subcategory.
            </p>
          </div>

          {!loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiShoppingBag size={18} className="text-[#087F95]" />
              <span>{products.length} Products</span>
            </div>
          )}
        </div>

        {!storeId ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-16 text-center">
            <FiShoppingBag className="mx-auto mb-4 text-4xl text-gray-300" />

            <h2 className="text-lg font-semibold text-[#102A43]">
              Select a store
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Please select a store to view available products.
            </p>
          </div>

        ) : loading ? (

          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#087F95]" />
              <p className="mt-4 text-sm font-medium text-gray-500">
                Loading products...
              </p>
            </div>
          </div>

        ) : products.length === 0 ? (

          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D7F2F6] text-[#087F95]">
              <FiShoppingBag size={30} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-[#102A43]">
              No products found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              No products are currently available in this subcategory.
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">

            {products.map((product) => (
              <Link
                href={`/products/${product.slug}`}
                key={product._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#22B8CF] hover:shadow-lg"
              >

                <div className="relative flex h-36 items-center justify-center bg-[#F8FAFC] p-3 sm:h-44">

                  {product.images?.[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-contain p-3 transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  ) : (
                    <FiShoppingBag
                      size={40}
                      className="text-gray-300"
                    />
                  )}

                </div>

                <div className="flex flex-1 flex-col p-3 sm:p-4">

                  <h2 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#102A43] sm:text-base">
                    {product.name}
                  </h2>

                  {product.brand?.name && (
                    <p className="mt-2 truncate text-xs text-gray-500">
                      {product.brand.name}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs font-medium text-[#087F95]">
                      View Product
                    </span>

                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D7F2F6] text-[#087F95] transition group-hover:bg-[#087F95] group-hover:text-white">
                      <FiArrowRight size={15} />
                    </span>
                  </div>

                </div>
              </Link>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500">
          Loading products...
        </div>
      }
    >
      <SubcategoryProducts />
    </Suspense>
  );
}
