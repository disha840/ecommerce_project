



"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import {
    getCart,
    updateCartQuantity,
    removeCartItem
} from "@/redux/Slices/cartSlice";

import Link from "next/link";

const CartPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    

    const user = useSelector((state) => state.auth.user);

    const [mounted, setMounted] = useState(false);

    const { cart, items, loading, updating } = useSelector(
        (state) => state.cart
    );

    // Login check and cart fetch
    useEffect(() => {
        setMounted(true);

        if (user === null) {
            router.replace("/");
            return;
        }

        if (user) {
            dispatch(getCart());
        }
    }, [dispatch, user, router]);

    // Quantity update
    const handleQuantity = (id, quantity) => {
        dispatch(updateCartQuantity({
            id: id,
            quantity: quantity
        }));
    };

    // Remove cart item
    const handleRemove = (id) => {
        dispatch(removeCartItem(id));
    };

    // Loading
    if (!mounted || !user || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading cart...
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-slate-50 px-5 py-12">

            <div className="mx-auto max-w-6xl">

                <h1 className="mb-8 text-3xl font-bold text-slate-900">
                    My Shopping Cart
                </h1>

                {items.length === 0 ? (

                    <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

                        <div className="mb-4 text-6xl">
                            🛒
                        </div>

                        <h2 className="text-xl font-bold text-slate-800">
                            Your Cart is Empty
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Add some products to your cart.
                        </p>

                        <Link
                            href="/"
                            className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                        >
                            Continue Shopping
                        </Link>

                    </div>

                ) : (

                    <div className="grid gap-8 lg:grid-cols-3">

                        {/* Cart Items */}

                        <div className="space-y-4 lg:col-span-2">

                            {items.map((item) => (

                                <div
                                    key={item._id}
                                    className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                                >

                                    {/* Product Image */}

                                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">

                                        {item.variant?.images?.[0]?.url ? (

                                            <img
                                                src={item.variant.images[0].url}
                                                alt={item.variant.name}
                                                className="h-full w-full object-cover"
                                            />

                                        ) : (

                                            <div className="flex h-full items-center justify-center text-4xl">
                                                🛒
                                            </div>

                                        )}

                                    </div>

                                    {/* Product Details */}

                                    <div className="flex-1">

                                        <h2 className="text-lg font-bold text-slate-800">
                                            {item.product?.name}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Variant: {item.variant?.name}
                                        </p>

                                        <p className="mt-2 font-semibold text-emerald-700">
                                            ₹{item.price}
                                        </p>

                                        {/* Quantity Buttons */}

                                        <div className="mt-3 flex items-center gap-3">

                                            <button
                                                onClick={() => handleQuantity(item._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1 || updating}
                                                className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
                                            >
                                                -
                                            </button>

                                            <span>
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => handleQuantity(item._id, item.quantity + 1)}
                                                disabled={updating}
                                                className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
                                            >
                                                +
                                            </button>

                                            {/* Remove Button */}

                                            <button
                                                onClick={() => handleRemove(item._id)}
                                                disabled={updating}
                                                className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-200 disabled:opacity-50"
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                    {/* Total Price */}

                                    <div className="text-left sm:text-right">

                                        <p className="text-lg font-bold text-slate-900">
                                            ₹{item.totalPrice}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                        {/* Order Summary */}

                        <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">

                            <h2 className="mb-5 text-xl font-bold text-slate-800">
                                Order Summary
                            </h2>

                            <div className="space-y-4">

                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>₹{cart?.subtotal || 0}</span>
                                </div>

                                <div className="flex justify-between text-slate-600">
                                    <span>Discount</span>
                                    <span>₹{cart?.discount || 0}</span>
                                </div>

                                <div className="flex justify-between text-slate-600">
                                    <span>Delivery Fee</span>
                                    <span>₹{cart?.deliveryFee || 0}</span>
                                </div>

                                <div className="flex justify-between text-slate-600">
                                    <span>Tax</span>
                                    <span>₹{cart?.tax || 0}</span>
                                </div>

                                <div className="border-t border-slate-200 pt-4">

                                    <div className="flex justify-between text-lg font-bold text-slate-900">
                                        <span>Total</span>
                                        <span>₹{cart?.totalAmount || 0}</span>
                                    </div>

                                </div>

                                <button
                                    onClick={() => router.push("/checkout")}
                                    className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700"
                                >
                                    Proceed to Checkout
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </section>
    );
};

export default CartPage;
