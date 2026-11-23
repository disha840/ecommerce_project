
"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import api from "@/axios/api";
import toast from "react-hot-toast";

export default function WishlistPage() {
    const user = useSelector((state) => state.auth.user);
    const store = useSelector((state) => state.store.selectedStore);

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const getWishlist = async () => {
        try {
            setLoading(true);

            const response = await api.get("/wishlist/get", {
                params: {
                    storeId: store._id,
                },
            });

            setWishlist(response.data.data || []);
        } catch (error) {
            console.log("Get Wishlist Error:", error);
            toast.error(
                error.response?.data?.message || "Unable to fetch wishlist"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && store?._id) {
            getWishlist();
        } else {
            setWishlist([]);
        }
    }, [user, store?._id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading wishlist...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">

                <div className="flex items-center gap-3 mb-8">
                    <Heart size={28} className="text-red-500" />

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            My Wishlist
                        </h1>

                        <p className="text-sm text-gray-500">
                            Your saved products
                        </p>
                    </div>
                </div>

                {!user ? (
                    <div className="bg-white rounded-xl p-10 text-center">
                        <Heart size={45} className="mx-auto text-gray-300 mb-3" />

                        <h2 className="text-lg font-semibold text-gray-700">
                            Please login to view your wishlist
                        </h2>
                    </div>
                ) : !store?._id ? (
                    <div className="bg-white rounded-xl p-10 text-center">
                        <ShoppingBag
                            size={45}
                            className="mx-auto text-gray-300 mb-3"
                        />

                        <h2 className="text-lg font-semibold text-gray-700">
                            Please select a store
                        </h2>
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="bg-white rounded-xl p-10 text-center">
                        <Heart
                            size={45}
                            className="mx-auto text-gray-300 mb-3"
                        />

                        <h2 className="text-lg font-semibold text-gray-700">
                            Your wishlist is empty
                        </h2>

                        <p className="text-gray-500 text-sm mt-2">
                            Products you save will appear here.
                        </p>

                        <Link
                            href="/categories"
                            className="inline-block mt-5 bg-green-600 text-white px-6 py-2 rounded-lg"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                        {wishlist.map((item) => {
                            const product = item.product;
                            const variant = item.variant;

                            const image = variant?.images?.[0]?.url;

                            return (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                                >
                                    <div className="relative h-48 bg-gray-100 flex items-center justify-center">

                                        {image ? (
                                            <img
                                                src={image}
                                                alt={variant?.name || "Product"}
                                                className="h-full w-full object-contain p-4"
                                            />
                                        ) : (
                                            <ShoppingBag
                                                size={45}
                                                className="text-gray-300"
                                            />
                                        )}

                                        <Heart
                                            size={22}
                                            fill="red"
                                            className="absolute top-3 right-3 text-red-500"
                                        />
                                    </div>

                                    <div className="p-4">

                                        <h2 className="font-semibold text-gray-800">
                                            {product?.name}
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {variant?.name}
                                        </p>

                                        <p className="font-bold text-gray-800 mt-3">
                                            ₹{variant?.sellingPrice}
                                        </p>

                                        {item.isAvailable ? (
                                            <p className="text-sm text-green-600 mt-3">
                                                In stock
                                            </p>
                                        ) : (
                                            <p className="text-sm text-red-500 mt-3">
                                                Not available in this store
                                            </p>
                                        )}

                                        <Link
                                            href={`/variants/${variant?.slug}`}
                                            className="block text-center mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                                        >
                                            View Product
                                        </Link>

                                    </div>
                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </div>
    );
}
