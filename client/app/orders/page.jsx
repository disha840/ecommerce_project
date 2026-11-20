



"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/axios/api";

const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(price || 0));

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const statusConfig = {
    Placed: {
        label: "Order Placed",
        color: "bg-sky-50 text-sky-700 border-sky-100",
    },
    Delivered: {
        label: "Delivered",
        color: "bg-teal-50 text-teal-700 border-teal-100",
    },
};

const orderSteps = ["Placed", "Delivered"];

const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "string") return image;

    return image.url || "";
};

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [filter, setFilter] = useState("All");

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const { data } = await api.get("/order/my-orders");

            if (data.success) {
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders =
        filter === "All"
            ? orders
            : orders.filter((order) => order.orderStatus === filter);

    const toggleOrder = (id) => {
        setExpandedOrder((prev) => prev === id ? null : id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0FAFC] p-6">
                <div className="mx-auto max-w-5xl animate-pulse space-y-5">
                    <div className="h-10 w-52 rounded bg-slate-200" />
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-36 rounded-2xl bg-white"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0FAFC] pb-16">

            {/* HEADER */}
            <header className="border-b border-[#D7EAF0] bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
                    <Link href="/" className="text-2xl font-black tracking-tight text-[#102A43]">
                        QUICK <span className="text-[#0891A8]">KART</span>
                    </Link>

                    <Link
                        href="/"
                        className="text-sm font-semibold text-slate-600 transition hover:text-[#087F95]"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 pt-8">

                {/* PAGE HEADING */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Link
                            href="/"
                            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#087F95]"
                        >
                            ← Back to Home
                        </Link>

                        <h1 className="text-3xl font-extrabold tracking-tight text-[#102A43]">
                            My Orders
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Track and manage your purchases.
                        </p>
                    </div>

                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-2 rounded-xl border border-[#D7EAF0] bg-white px-4 py-3 text-sm font-bold text-[#102A43] transition hover:border-[#0891A8] hover:text-[#087F95]"
                    >
                        ↻ Refresh
                    </button>
                </div>

                {/* ORDER SUMMARY */}
                <div className="mb-8 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-[#D7EAF0] bg-white p-4 sm:p-5">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F6FA] text-[#087F95]">
                            <span className="text-xl">▤</span>
                        </div>
                        <p className="text-2xl font-extrabold text-[#102A43]">
                            {orders.length}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            Total Orders
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#D7EAF0] bg-white p-4 sm:p-5">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                            <span className="text-xl">◷</span>
                        </div>
                        <p className="text-2xl font-extrabold text-[#102A43]">
                            {orders.filter(
                                (o) => o.orderStatus === "Placed"
                            ).length}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            Placed
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#D7EAF0] bg-white p-4 sm:p-5">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                            <span className="text-xl">✓</span>
                        </div>
                        <p className="text-2xl font-extrabold text-[#102A43]">
                            {orders.filter(
                                (o) => o.orderStatus === "Delivered"
                            ).length}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            Delivered
                        </p>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="mb-6 flex gap-2">
                    {["All", "Placed", "Delivered"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                                filter === status
                                    ? "bg-[#102A43] text-white shadow-sm"
                                    : "border border-[#D7EAF0] bg-white text-slate-600 hover:border-[#0891A8] hover:text-[#087F95]"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* EMPTY STATE */}
                {filteredOrders.length === 0 ? (
                    <div className="rounded-2xl border border-[#D7EAF0] bg-white px-5 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F6FA] text-3xl text-[#087F95]">
                            ▤
                        </div>

                        <h2 className="mt-5 text-xl font-extrabold text-[#102A43]">
                            {orders.length === 0
                                ? "No orders yet"
                                : "No orders found"}
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {orders.length === 0
                                ? "Your shopping journey starts here."
                                : "No orders matching this status."}
                        </p>

                        {orders.length === 0 && (
                            <Link
                                href="/"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#087F95] px-6 py-3 font-bold text-white transition hover:bg-[#066B7D]"
                            >
                                Start Shopping →
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">

                        {filteredOrders.map((order) => {
                            const status = statusConfig[order.orderStatus] || {
                                label: order.orderStatus,
                                color: "bg-slate-100 text-slate-700 border-slate-200",
                            };

                            const isExpanded = expandedOrder === order._id;
                            const items = order.items || [];
                            const currentStep = orderSteps.indexOf(order.orderStatus);

                            return (
                                <article
                                    key={order._id}
                                    className="overflow-hidden rounded-2xl border border-[#D7EAF0] bg-white transition hover:shadow-[0_8px_30px_rgba(16,42,67,0.06)]"
                                >
                                    {/* COMPACT ORDER CARD */}
                                    <div className="p-4 sm:p-5">

                                        {/* ORDER TOP */}
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-semibold tracking-wider text-slate-400">
                                                    ORDER ID
                                                </p>
                                                <h3 className="mt-1 font-extrabold text-[#102A43]">
                                                    {order.orderNumber}
                                                </h3>
                                            </div>

                                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.color}`}>
                                                <span className="h-2 w-2 rounded-full bg-current" />
                                                {status.label}
                                            </span>
                                        </div>

                                        {/* PRODUCT PREVIEW */}
                                        <div className="my-5 flex items-center gap-3">
                                            <div className="flex -space-x-3">
                                                {items.slice(0, 3).map((item) => {
                                                    const imageUrl = getImageUrl(item.product?.image);

                                                    return (
                                                        <div
                                                            key={item._id}
                                                            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-[#F0FAFC]"
                                                        >
                                                            {imageUrl ? (
                                                                <Image
                                                                    src={imageUrl}
                                                                    alt={item.productName}
                                                                    fill
                                                                    sizes="56px"
                                                                    className="object-contain p-1"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center text-xl text-slate-400">
                                                                    ▤
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-[#102A43]">
                                                    {items.map((item) => item.productName).join(", ")}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {items.reduce(
                                                        (total, item) => total + Number(item.quantity || 0),
                                                        0
                                                    )} Items
                                                </p>
                                            </div>
                                        </div>

                                        {/* BOTTOM DETAILS */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8F0F3] pt-4">
                                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Order Date
                                                    </p>
                                                    <p className="mt-1 text-sm font-semibold text-[#334E68]">
                                                        {formatDate(order.placedAt || order.createdAt)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Total Amount
                                                    </p>
                                                    <p className="mt-1 text-base font-extrabold text-[#087F95]">
                                                        {formatPrice(order.totalAmount)}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toggleOrder(order._id)}
                                                className="flex items-center gap-2 rounded-xl bg-[#E5F6FA] px-4 py-2.5 text-sm font-bold text-[#087F95] transition hover:bg-[#D3EFF4]"
                                            >
                                                {isExpanded ? "Hide Details" : "View Details"}
                                                <span>{isExpanded ? "↑" : "→"}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* EXPANDED DETAILS */}
                                    {isExpanded && (
                                        <div className="space-y-6 border-t border-[#D7EAF0] bg-[#F7FBFC] p-4 sm:p-6">

                                            {/* TRACKING */}
                                            <section>
                                                <h3 className="mb-4 font-extrabold text-[#102A43]">
                                                    Order Tracking
                                                </h3>

                                                <div className="flex items-center gap-3">
                                                    {orderSteps.map((step, index) => {
                                                        const completed = currentStep >= index;

                                                        return (
                                                            <div
                                                                key={step}
                                                                className="flex flex-1 items-center gap-2"
                                                            >
                                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                                                    completed
                                                                        ? "bg-[#087F95] text-white"
                                                                        : "bg-slate-200 text-slate-400"
                                                                }`}>
                                                                    {completed ? "✓" : "◷"}
                                                                </div>

                                                                <span className={`text-xs font-bold ${
                                                                    completed
                                                                        ? "text-[#087F95]"
                                                                        : "text-slate-400"
                                                                }`}>
                                                                    {step}
                                                                </span>

                                                                {index === 0 && (
                                                                    <div className={`h-1 flex-1 rounded-full ${
                                                                        currentStep >= 1
                                                                            ? "bg-[#087F95]"
                                                                            : "bg-slate-200"
                                                                    }`} />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </section>

                                            {/* DELIVERY OTP */}
                                            {order.deliveryOtp && order.orderStatus !== "Delivered" && (
                                                <section className="rounded-xl border border-[#B8E5ED] bg-[#E5F6FA] p-5">
                                                    <h3 className="font-extrabold text-[#102A43]">
                                                        Delivery OTP
                                                    </h3>

                                                    <p className="mt-1 text-sm text-slate-600">
                                                        Share this OTP with your delivery partner when they arrive to deliver your order.
                                                    </p>

                                                    <div className="mt-4 inline-flex rounded-xl border border-[#B8E5ED] bg-white px-7 py-3">
                                                        <span className="text-2xl font-extrabold tracking-[0.4em] text-[#087F95]">
                                                            {order.deliveryOtp}
                                                        </span>
                                                    </div>
                                                </section>
                                            )}

                                            {/* ORDERED ITEMS */}
                                            <section>
                                                <h3 className="mb-4 font-extrabold text-[#102A43]">
                                                    Ordered Items ({items.length})
                                                </h3>

                                                <div className="space-y-3">
                                                    {items.map((item) => {
                                                        const imageUrl = getImageUrl(item.product?.image);

                                                        return (
                                                            <div
                                                                key={item._id}
                                                                className="flex items-center gap-4 rounded-xl border border-[#D7EAF0] bg-white p-3"
                                                            >
                                                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F0FAFC]">
                                                                    {imageUrl && (
                                                                        <Image
                                                                            src={imageUrl}
                                                                            alt={item.productName}
                                                                            fill
                                                                            sizes="64px"
                                                                            className="object-contain p-1"
                                                                        />
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0 flex-1">
                                                                    <h4 className="font-bold text-[#102A43]">
                                                                        {item.productName}
                                                                    </h4>

                                                                    {item.variantName && (
                                                                        <p className="mt-1 text-xs text-slate-500">
                                                                            Variant: {item.variantName}
                                                                        </p>
                                                                    )}

                                                                    <p className="mt-1 text-sm text-slate-500">
                                                                        {formatPrice(item.price)} × {item.quantity}
                                                                    </p>
                                                                </div>

                                                                <p className="shrink-0 font-extrabold text-[#102A43]">
                                                                    {formatPrice(item.totalPrice)}
                                                                </p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </section>

                                            {/* DELIVERY ADDRESS */}
                                            <section className="rounded-xl border border-[#D7EAF0] bg-white p-4">
                                                <h3 className="mb-3 font-extrabold text-[#102A43]">
                                                    Delivery Address
                                                </h3>

                                                {order.address ? (
                                                    <>
                                                        <p className="font-bold text-[#334E68]">
                                                            {order.address.type}
                                                        </p>

                                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                                            {order.address.houseNumber}, {order.address.street}
                                                            {order.address.landmark && `, Near ${order.address.landmark}`}
                                                        </p>

                                                        <p className="text-sm text-slate-600">
                                                            {order.address.city}, {order.address.state} - {order.address.pincode}
                                                        </p>

                                                        <p className="text-sm text-slate-600">
                                                            {order.address.country}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-slate-500">
                                                        Address details unavailable.
                                                    </p>
                                                )}
                                            </section>

                                            {/* PAYMENT DETAILS */}
                                            <section className="rounded-xl border border-[#D7EAF0] bg-white p-4">
                                                <h3 className="mb-3 font-extrabold text-[#102A43]">
                                                    Payment Details
                                                </h3>

                                                <div className="space-y-3 text-sm">
                                                    <div className="flex justify-between gap-3">
                                                        <span className="text-slate-500">Payment Method</span>
                                                        <span className="font-bold text-[#334E68]">
                                                            {order.paymentMethod === "COD"
                                                                ? "Cash on Delivery"
                                                                : order.paymentMethod}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between gap-3">
                                                        <span className="text-slate-500">Payment Status</span>
                                                        <span className="font-bold text-[#334E68]">
                                                            {order.paymentStatus}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between gap-3">
                                                        <span className="text-slate-500">Order ID</span>
                                                        <span className="max-w-36 truncate font-semibold text-[#334E68]">
                                                            {order._id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* PRICE BREAKDOWN */}
                                            <section className="rounded-xl border border-[#D7EAF0] bg-white p-4">
                                                <h3 className="mb-4 font-extrabold text-[#102A43]">
                                                    Price Breakdown
                                                </h3>

                                                <div className="ml-auto max-w-md space-y-3 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Subtotal</span>
                                                        <span className="font-semibold text-[#334E68]">
                                                            {formatPrice(order.subtotal)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Discount</span>
                                                        <span className="font-semibold text-teal-600">
                                                            - {formatPrice(order.discount)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Delivery Fee</span>
                                                        <span className="font-semibold text-[#334E68]">
                                                            {order.deliveryFee === 0
                                                                ? "FREE"
                                                                : formatPrice(order.deliveryFee)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Tax</span>
                                                        <span className="font-semibold text-[#334E68]">
                                                            {formatPrice(order.tax)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between border-t border-[#D7EAF0] pt-4">
                                                        <span className="font-extrabold text-[#102A43]">
                                                            Total Amount
                                                        </span>

                                                        <span className="text-lg font-extrabold text-[#087F95]">
                                                            {formatPrice(order.totalAmount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
