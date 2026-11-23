

"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    Heart,
    ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import api from "@/axios/api";
import toast from "react-hot-toast";

export default function WishlistPage() {

    const user = useSelector((state) => state.auth.user);
    const store = useSelector((state) => state.store.selectedStore);

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [removingId, setRemovingId] = useState(null);

    // GET WISHLIST
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
                error.response?.data?.message ||
                "Unable to fetch wishlist"
            );

        } finally {
            setLoading(false);
        }
    };


    // REMOVE FROM WISHLIST
    const removeFromWishlist = async (itemId) => {
        try {
            setRemovingId(itemId);

            const response = await api.delete(
                `/wishlist/remove/${itemId}`
            );

            if (response.data.success) {
                setWishlist((previousWishlist) =>
                    previousWishlist.filter(
                        (item) => item._id !== itemId
                    )
                );

                toast.success(response.data.message);
            }

        } catch (error) {
            console.log("Remove Wishlist Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to remove product"
            );

        } finally {
            setRemovingId(null);
        }
    };


    // FETCH WISHLIST
    useEffect(() => {
        if (user && store?._id) {
            getWishlist();
        } else {
            setWishlist([]);
        }
    }, [user, store?._id]);


    if (loading) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center">
                <p className="text-emerald-700 font-medium">
                    Loading wishlist...
                </p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-green-50 py-8 px-4">

            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-3 mb-8">

                    <Heart
                        size={28}
                        className="text-emerald-700"
                    />

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

                    <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">

                        <Heart
                            size={45}
                            className="mx-auto text-emerald-600 mb-3"
                        />

                        <h2 className="text-lg font-semibold text-gray-800">
                            Please login to view your wishlist
                        </h2>

                    </div>

                ) : !store?._id ? (

                    <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">

                        <ShoppingBag
                            size={45}
                            className="mx-auto text-emerald-600 mb-3"
                        />

                        <h2 className="text-lg font-semibold text-gray-800">
                            Please select a store
                        </h2>

                    </div>

                ) : wishlist.length === 0 ? (

                    <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">

                        <Heart
                            size={45}
                            className="mx-auto text-emerald-600 mb-3"
                        />

                        <h2 className="text-lg font-semibold text-gray-800">
                            Your wishlist is empty
                        </h2>

                        <p className="text-gray-500 text-sm mt-2">
                            Products you save will appear here.
                        </p>

                        <Link
                            href="/categories"
                            className="inline-block mt-5 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-lg transition"
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
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition"
                                >

                                    {/* PRODUCT IMAGE */}
                                    <div className="relative h-48 bg-emerald-50 flex items-center justify-center">

                                        {image ? (

                                            <img
                                                src={image}
                                                alt={variant?.name || "Product"}
                                                className="h-full w-full object-contain p-4"
                                            />

                                        ) : (

                                            <ShoppingBag
                                                size={45}
                                                className="text-emerald-300"
                                            />

                                        )}

                                        {/* WISHLIST HEART */}
                                        <button
                                            onClick={() => removeFromWishlist(item._id)}
                                            disabled={removingId === item._id}
                                            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-emerald-50 transition disabled:opacity-50"
                                            title="Remove from wishlist"
                                        >
                                            <Heart
                                                size={21}
                                                fill="#047857"
                                                className="text-emerald-700"
                                            />
                                        </button>

                                    </div>


                                    {/* PRODUCT DETAILS */}
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


                                        {/* AVAILABILITY */}
                                        {item.isAvailable ? (

                                            <p className="text-sm text-emerald-700 mt-3 font-medium">
                                                In Stock
                                            </p>

                                        ) : (

                                            <p className="text-sm text-red-500 mt-3 font-medium">
                                                Out of Stock
                                            </p>

                                        )}


                                        

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
