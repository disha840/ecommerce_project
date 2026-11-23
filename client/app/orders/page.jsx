

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
        color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    Delivered: {
        label: "Delivered",
        color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    Cancelled: {
        label: "Cancelled",
        color: "bg-red-50 text-red-700 border-red-100",
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

    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    const [deleteOrderId, setDeleteOrderId] = useState(null);
    const [deleting, setDeleting] = useState(false);

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

    // CANCEL ORDER API
    const handleCancelOrder = async () => {
        if (!cancelOrderId) return;

        try {
            setCancelling(true);

            const { data } = await api.put(
                `/order/cancel/${cancelOrderId}`
            );

            if (data.success) {
                setCancelOrderId(null);
                setExpandedOrder(null);
                await fetchOrders();
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to cancel order"
            );
        } finally {
            setCancelling(false);
        }
    };

    // DELETE ORDER API
    const handleDeleteOrder = async () => {
        if (!deleteOrderId) return;

        try {
            setDeleting(true);

            const { data } = await api.delete(
                `/order/delete/${deleteOrderId}`
            );

            if (data.success) {
                setDeleteOrderId(null);
                setExpandedOrder(null);
                await fetchOrders();
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete order"
            );
        } finally {
            setDeleting(false);
        }
    };

    const filteredOrders =
        filter === "All"
            ? orders
            : orders.filter((order) => order.orderStatus === filter);

    const toggleOrder = (id) => {
        setExpandedOrder((prev) => prev === id ? null : id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-5xl animate-pulse space-y-5">
                    <div className="h-10 w-52 rounded bg-emerald-50" />
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
        <div className="min-h-screen bg-gray-50 pb-16">

            {/* HEADER */}
            <header className="border-b border-gray-100 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
                    <Link
                        href="/"
                        className="text-2xl font-black tracking-tight text-gray-900"
                    >
                        QUICK <span className="text-emerald-600">KART</span>
                    </Link>

                    <Link
                        href="/"
                        className="text-sm font-semibold text-gray-600 transition hover:text-emerald-700"
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
                            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-700"
                        >
                            ← Back to Home
                        </Link>

                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                            My Orders
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Track and manage your purchases.
                        </p>
                    </div>

                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-bold text-gray-900 transition hover:border-emerald-200 hover:text-emerald-700"
                    >
                        ↻ Refresh
                    </button>
                </div>

                {/* ORDER SUMMARY */}
                <div className="mb-8 grid grid-cols-3 gap-3">

                    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <span className="text-xl">▤</span>
                        </div>

                        <p className="text-2xl font-extrabold text-gray-900">
                            {orders.length}
                        </p>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Total Orders
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <span className="text-xl">◷</span>
                        </div>

                        <p className="text-2xl font-extrabold text-gray-900">
                            {orders.filter(
                                (o) => o.orderStatus === "Placed"
                            ).length}
                        </p>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Placed
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <span className="text-xl">✓</span>
                        </div>

                        <p className="text-2xl font-extrabold text-gray-900">
                            {orders.filter(
                                (o) => o.orderStatus === "Delivered"
                            ).length}
                        </p>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Delivered
                        </p>
                    </div>

                </div>

                {/* FILTERS */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {["All", "Placed", "Delivered", "Cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                                filter === status
                                    ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                                    : "border border-gray-100 bg-white text-gray-600 hover:border-emerald-200 hover:text-emerald-700"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* EMPTY STATE */}
                {filteredOrders.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl text-emerald-700">
                            ▤
                        </div>

                        <h2 className="mt-5 text-xl font-extrabold text-gray-900">
                            {orders.length === 0
                                ? "No orders yet"
                                : "No orders found"}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {orders.length === 0
                                ? "Your shopping journey starts here."
                                : "No orders matching this status."}
                        </p>

                        {orders.length === 0 && (
                            <Link
                                href="/"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
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
                                color: "bg-gray-100 text-gray-700 border-gray-200",
                            };

                            const isExpanded = expandedOrder === order._id;
                            const items = order.items || [];
                            const currentStep = orderSteps.indexOf(order.orderStatus);

                            return (
                                <article
                                    key={order._id}
                                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:shadow-lg"
                                >

                                    {/* COMPACT ORDER CARD */}
                                    <div className="p-4 sm:p-5">

                                        {/* ORDER TOP */}
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-semibold tracking-wider text-gray-400">
                                                    ORDER ID
                                                </p>

                                                <h3 className="mt-1 font-extrabold text-gray-900">
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
                                                            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-emerald-50"
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
                                                                <div className="flex h-full items-center justify-center text-xl text-gray-400">
                                                                    ▤
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-gray-900">
                                                    {items.map((item) => item.productName).join(", ")}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {items.reduce(
                                                        (total, item) => total + Number(item.quantity || 0),
                                                        0
                                                    )} Items
                                                </p>
                                            </div>
                                        </div>

                                        {/* BOTTOM DETAILS */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                <div>
                                                    <p className="text-xs text-gray-400">
                                                        Order Date
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-gray-700">
                                                        {formatDate(order.placedAt || order.createdAt)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-400">
                                                        Total Amount
                                                    </p>

                                                    <p className="mt-1 text-base font-extrabold text-emerald-700">
                                                        {formatPrice(order.totalAmount)}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toggleOrder(order._id)}
                                                className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                                            >
                                                {isExpanded ? "Hide Details" : "View Details"}
                                                <span>{isExpanded ? "↑" : "→"}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* EXPANDED DETAILS */}
                                    {isExpanded && (
                                        <div className="space-y-6 border-t border-gray-100 bg-gray-50 p-4 sm:p-6">

                                            {/* TRACKING */}
                                            <section>
                                                <h3 className="mb-4 font-extrabold text-gray-900">
                                                    Order Tracking
                                                </h3>

                                                {order.orderStatus === "Cancelled" ? (
                                                    <p className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                                                        This order has been cancelled.
                                                    </p>
                                                ) : (
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
                                                                            ? "bg-emerald-600 text-white"
                                                                            : "bg-gray-200 text-gray-400"
                                                                    }`}>
                                                                        {completed ? "✓" : "◷"}
                                                                    </div>

                                                                    <span className={`text-xs font-bold ${
                                                                        completed
                                                                            ? "text-emerald-700"
                                                                            : "text-gray-400"
                                                                    }`}>
                                                                        {step}
                                                                    </span>

                                                                    {index === 0 && (
                                                                        <div className={`h-1 flex-1 rounded-full ${
                                                                            currentStep >= 1
                                                                                ? "bg-emerald-600"
                                                                                : "bg-gray-200"
                                                                        }`} />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </section>

                                            {/* DELIVERY OTP */}
                                            {order.deliveryOtp && order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled" && (
                                                <section className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                                                    <h3 className="font-extrabold text-gray-900">
                                                        Delivery OTP
                                                    </h3>

                                                    <p className="mt-1 text-sm text-gray-600">
                                                        Share this OTP with your delivery partner when they arrive to deliver your order.
                                                    </p>

                                                    <div className="mt-4 inline-flex rounded-xl border border-emerald-100 bg-white px-7 py-3">
                                                        <span className="text-2xl font-extrabold tracking-[0.4em] text-emerald-700">
                                                            {order.deliveryOtp}
                                                        </span>
                                                    </div>
                                                </section>
                                            )}

                                            {/* ORDERED ITEMS */}
                                            <section>
                                                <h3 className="mb-4 font-extrabold text-gray-900">
                                                    Ordered Items ({items.length})
                                                </h3>

                                                <div className="space-y-3">
                                                    {items.map((item) => {
                                                        const imageUrl = getImageUrl(item.product?.image);

                                                        return (
                                                            <div
                                                                key={item._id}
                                                                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3"
                                                            >
                                                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-emerald-50">
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
                                                                    <h4 className="font-bold text-gray-900">
                                                                        {item.productName}
                                                                    </h4>

                                                                    {item.variantName && (
                                                                        <p className="mt-1 text-xs text-gray-500">
                                                                            Variant: {item.variantName}
                                                                        </p>
                                                                    )}

                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        {formatPrice(item.price)} × {item.quantity}
                                                                    </p>
                                                                </div>

                                                                <p className="shrink-0 font-extrabold text-gray-900">
                                                                    {formatPrice(item.totalPrice)}
                                                                </p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </section>

                                            {/* DELIVERY ADDRESS */}
                                            <section className="rounded-xl border border-gray-100 bg-white p-4">
                                                <h3 className="mb-3 font-extrabold text-gray-900">
                                                    Delivery Address
                                                </h3>

                                                {order.address ? (
                                                    <>
                                                        <p className="font-bold text-gray-700">
                                                            {order.address.type}
                                                        </p>

                                                        <p className="mt-1 text-sm leading-6 text-gray-500">
                                                            {order.address.houseNumber}, {order.address.street}
                                                            {order.address.landmark && `, Near ${order.address.landmark}`}
                                                        </p>

                                                        <p className="text-sm text-gray-500">
                                                            {order.address.city}, {order.address.state} - {order.address.pincode}
                                                        </p>

                                                        <p className="text-sm text-gray-500">
                                                            {order.address.country}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-gray-400">
                                                        Address details unavailable.
                                                    </p>
                                                )}
                                            </section>

                                            {/* PAYMENT DETAILS */}
                                            <section className="rounded-xl border border-gray-100 bg-white p-4">
                                                <h3 className="mb-3 font-extrabold text-gray-900">
                                                    Payment Details
                                                </h3>

                                                <div className="space-y-3 text-sm">
                                                    <div className="flex justify-between gap-3">
                                                        <span className="text-gray-500">Payment Method</span>

                                                        <span className="font-bold text-gray-700">
                                                            {order.paymentMethod === "COD"
                                                                ? "Cash on Delivery"
                                                                : order.paymentMethod}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between gap-3">
                                                        <span className="text-gray-500">Payment Status</span>

                                                        <span className="font-bold text-gray-700">
                                                            {order.paymentStatus}
                                                        </span>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* PRICE BREAKDOWN */}
                                            <section className="rounded-xl border border-gray-100 bg-white p-4">
                                                <h3 className="mb-4 font-extrabold text-gray-900">
                                                    Price Breakdown
                                                </h3>

                                                <div className="ml-auto max-w-md space-y-3 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Subtotal</span>

                                                        <span className="font-semibold text-gray-700">
                                                            {formatPrice(order.subtotal)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Discount</span>

                                                        <span className="font-semibold text-emerald-700">
                                                            - {formatPrice(order.discount)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Delivery Fee</span>

                                                        <span className="font-semibold text-gray-700">
                                                            {order.deliveryFee === 0
                                                                ? "FREE"
                                                                : formatPrice(order.deliveryFee)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Tax</span>

                                                        <span className="font-semibold text-gray-700">
                                                            {formatPrice(order.tax)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between border-t border-gray-100 pt-4">
                                                        <span className="font-extrabold text-gray-900">
                                                            Total Amount
                                                        </span>

                                                        <span className="text-lg font-extrabold text-emerald-700">
                                                            {formatPrice(order.totalAmount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* CANCEL ORDER BUTTON */}
                                            {order.orderStatus === "Placed" && (
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => setCancelOrderId(order._id)}
                                                        className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                </div>
                                            )}

                                            {/* DELETE ORDER BUTTON */}
                                            {(order.orderStatus === "Delivered" || order.orderStatus === "Cancelled") && (
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => setDeleteOrderId(order._id)}
                                                        className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                                                    >
                                                        Delete Order
                                                    </button>
                                                </div>
                                            )}

                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* CANCEL CONFIRMATION POPUP */}
            {cancelOrderId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-600">
                            !
                        </div>

                        <h2 className="mt-4 text-center text-xl font-extrabold text-gray-900">
                            Cancel Order?
                        </h2>

                        <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                            Are you sure you want to cancel this order?
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setCancelOrderId(null)}
                                disabled={cancelling}
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                No, Keep Order
                            </button>

                            <button
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {cancelling ? "Cancelling..." : "Yes, Cancel"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION POPUP */}
            {deleteOrderId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-600">
                            !
                        </div>

                        <h2 className="mt-4 text-center text-xl font-extrabold text-gray-900">
                            Delete Order?
                        </h2>

                        <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                            Are you sure you want to remove this order from your order history?
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setDeleteOrderId(null)}
                                disabled={deleting}
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                No, Keep Order
                            </button>

                            <button
                                onClick={handleDeleteOrder}
                                disabled={deleting}
                                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
