

"use client";

import api from "@/axios/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Product() {
    const router = useRouter();

    const store = useSelector((state) => state.store.selectedStore);
    const storeId = store?._id;

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!storeId) {
            setFeaturedProducts([]);
            setPopularProducts([]);
            return;
        }

        const fetchProducts = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/inventory/store/${storeId}`
                );

                const data = response.data;

                if (data.success && Array.isArray(data.inventories)) {
                    const featured = [];
                    const popular = [];

                    data.inventories.forEach((item) => {
                        const product = item.product;

                        if (!product) return;

                        if (
                            product.isFeatured === true &&
                            !featured.some(
                                (existing) => existing._id === product._id
                            )
                        ) {
                            featured.push({
                                ...product,
                                variant: item.variant
                            });
                        }

                        if (
                            product.isPopular === true &&
                            !popular.some(
                                (existing) => existing._id === product._id
                            )
                        ) {
                            popular.push({
                                ...product,
                                variant: item.variant
                            });
                        }
                    });

                    setFeaturedProducts(featured);
                    setPopularProducts(popular);
                } else {
                    setFeaturedProducts([]);
                    setPopularProducts([]);
                }

            } catch (error) {
                console.error(
                    "Error fetching products:",
                    error.response?.data || error.message
                );

                setFeaturedProducts([]);
                setPopularProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [storeId]);

    const viewProduct = (slug) => {
        router.push(`/variants/${slug}`);
    };

    const renderProducts = (products) => (
        products.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
                No products available.
            </p>
        ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {products.map((product) => {
                    const variant = product.variant;

                    const price = Number(variant?.sellingPrice || 0);
                    const originalPrice = Number(variant?.mrp || price);

                    const discount =
                        originalPrice > price
                            ? Math.round(
                                ((originalPrice - price) / originalPrice) * 100
                            )
                            : 0;

                    return (
                        <div
                            key={product._id}
                            onClick={() => viewProduct(product.slug)}
                            className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                        >
                            {/* Image */}

                            <div className="relative flex h-40 items-center justify-center overflow-hidden bg-emerald-50 sm:h-48">
                                {variant?.images?.[0]?.url ||
                                product.images?.[0]?.url ? (
                                    <img
                                        src={
                                            variant?.images?.[0]?.url ||
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

                            {/* Details */}

                            <div className="p-3 sm:p-4">
                                <p className="text-xs text-slate-500">
                                    {product.category?.name || "Grocery"}
                                </p>

                                <h3 className="mt-1 truncate font-semibold text-slate-900">
                                    {product.name}
                                </h3>

                                {variant && (
                                    <p className="mt-1 text-xs text-slate-500">
                                        {variant.name}
                                    </p>
                                )}

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="font-bold text-slate-900">
                                        ₹{price}
                                    </span>

                                    {originalPrice > price && (
                                        <span className="text-xs text-slate-400 line-through">
                                            ₹{originalPrice}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    );

    return (
        <section className="mx-auto max-w-7xl px-5 py-10 md:px-10">

            {!storeId ? (
                <p className="py-12 text-center text-sm text-slate-500">
                    Please select your delivery location.
                </p>
            ) : loading ? (
                <p className="py-12 text-center text-sm text-slate-500">
                    Loading products...
                </p>
            ) : (
                <>
                    {/* Featured Products */}

                    <div className="mb-12">
                        <div className="mb-7">
                            <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-emerald-600">
                                Handpicked for you
                            </p>

                            <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                                Featured Products
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Fresh picks for your everyday needs.
                            </p>
                        </div>

                        {renderProducts(featuredProducts)}
                    </div>

                    {/* Popular Products */}

                    <div>
                        <div className="mb-7">
                            <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-emerald-600">
                                Customer Favorites
                            </p>

                            <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                                Popular Products
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Products loved by our customers.
                            </p>
                        </div>

                        {renderProducts(popularProducts)}
                    </div>
                </>
            )}

        </section>
    );
}
