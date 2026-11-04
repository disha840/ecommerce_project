

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/axios/api";

import {
    FiPackage,
    FiTruck,
    FiCheckCircle,
    FiClock,
    FiMapPin,
    FiCreditCard,
    FiChevronDown,
    FiChevronUp,
    FiShoppingBag,
    FiArrowLeft,
    FiXCircle,
    FiRefreshCw,
    FiCalendar,
} from "react-icons/fi";

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
        color: "bg-blue-50 text-blue-700",
    },
    Confirmed: {
        label: "Confirmed",
        color: "bg-indigo-50 text-indigo-700",
    },
    Processing: {
        label: "Processing",
        color: "bg-yellow-50 text-yellow-700",
    },
    Packed: {
        label: "Packed",
        color: "bg-purple-50 text-purple-700",
    },
    Shipped: {
        label: "Shipped",
        color: "bg-cyan-50 text-cyan-700",
    },
    "Out for Delivery": {
        label: "Out for Delivery",
        color: "bg-orange-50 text-orange-700",
    },
    Delivered: {
        label: "Delivered",
        color: "bg-green-50 text-green-700",
    },
    Cancelled: {
        label: "Cancelled",
        color: "bg-red-50 text-red-700",
    },
};

const orderSteps = [
    "Placed",
    "Confirmed",
    "Processing",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
];

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

    // Get My Orders
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
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-6xl animate-pulse space-y-5">
                    <div className="h-10 w-52 rounded bg-gray-200" />

                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-48 rounded-2xl bg-white"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-16">

            {/* HEADER */}
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
                    <Link href="/" className="text-2xl font-black text-green-700">
                        QUICK KART
                    </Link>

                    <Link
                        href="/"
                        className="text-sm font-semibold text-gray-600 hover:text-green-700"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 pt-8">

                {/* HEADING */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Link
                            href="/"
                            className="mb-3 flex items-center gap-2 text-sm text-gray-500"
                        >
                            <FiArrowLeft />
                            Back to Home
                        </Link>

                        <h1 className="text-3xl font-extrabold text-gray-900">
                            My Orders
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Track and manage all your purchases.
                        </p>
                    </div>

                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-bold hover:text-green-700"
                    >
                        <FiRefreshCw />
                        Refresh Orders
                    </button>
                </div>

                {/* ORDER STATISTICS */}
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        {
                            label: "Total Orders",
                            value: orders.length,
                            icon: FiShoppingBag,
                        },
                        {
                            label: "Active Orders",
                            value: orders.filter((o) =>
                                !["Delivered", "Cancelled"].includes(o.orderStatus)
                            ).length,
                            icon: FiClock,
                        },
                        {
                            label: "Delivered",
                            value: orders.filter(
                                (o) => o.orderStatus === "Delivered"
                            ).length,
                            icon: FiCheckCircle,
                        },
                        {
                            label: "Cancelled",
                            value: orders.filter(
                                (o) => o.orderStatus === "Cancelled"
                            ).length,
                            icon: FiXCircle,
                        },
                    ].map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className="rounded-2xl border bg-white p-5"
                            >
                                <Icon className="mb-3 text-xl text-green-700" />

                                <p className="text-2xl font-extrabold">
                                    {item.value}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {item.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* FILTERS */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                    {[
                        "All",
                        "Placed",
                        "Confirmed",
                        "Processing",
                        "Packed",
                        "Shipped",
                        "Delivered",
                        "Cancelled",
                    ].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold ${
                                filter === status
                                    ? "bg-green-700 text-white"
                                    : "border bg-white text-gray-600"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* EMPTY STATE */}
                {filteredOrders.length === 0 ? (
                    <div className="rounded-2xl border bg-white px-5 py-16 text-center">
                        <FiPackage
                            size={40}
                            className="mx-auto text-green-700"
                        />

                        <h2 className="mt-5 text-xl font-extrabold">
                            {orders.length === 0
                                ? "No orders yet"
                                : "No orders found"}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {orders.length === 0
                                ? "Start shopping and your orders will appear here."
                                : "No orders matching this status."}
                        </p>

                        {orders.length === 0 && (
                            <Link
                                href="/"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-bold text-white"
                            >
                                <FiShoppingBag />
                                Start Shopping
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">

                        {filteredOrders.map((order) => {
                            const status = statusConfig[order.orderStatus] || {
                                label: order.orderStatus,
                                color: "bg-gray-100 text-gray-700",
                            };

                            const isExpanded = expandedOrder === order._id;
                            const items = order.items || [];
                            const isCancelled = order.orderStatus === "Cancelled";
                            const currentStep = orderSteps.indexOf(order.orderStatus);

                            return (
                                <article
                                    key={order._id}
                                    className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                                >

                                    {/* ORDER HEADER */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                                <FiPackage size={24} />
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="font-extrabold">
                                                        {order.orderNumber}
                                                    </h2>

                                                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>

                                                <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                                    <FiCalendar />
                                                    Ordered on {formatDate(order.placedAt || order.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Total Amount
                                            </p>

                                            <p className="text-xl font-extrabold text-green-700">
                                                {formatPrice(order.totalAmount)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ORDER OVERVIEW */}
                                    <div className="grid gap-5 p-5 sm:grid-cols-3">
                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Items
                                            </p>

                                            <p className="mt-2 font-bold">
                                                {items.reduce(
                                                    (total, item) => total + item.quantity,
                                                    0
                                                )} Products
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Payment Method
                                            </p>

                                            <p className="mt-2 font-bold">
                                                {order.paymentMethod === "COD"
                                                    ? "Cash on Delivery"
                                                    : order.paymentMethod}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Payment Status
                                            </p>

                                            <p className="mt-2 font-bold">
                                                {order.paymentStatus}
                                            </p>
                                        </div>
                                    </div>

                                    {/* PRODUCT PREVIEW */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 border-t px-5 py-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            {items.slice(0, 4).map((item) => {
                                                const imageUrl = getImageUrl(item.product?.image);

                                                return (
                                                    <div
                                                        key={item._id}
                                                        className="relative h-14 w-14 overflow-hidden rounded-xl border bg-gray-50"
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
                                                            <FiPackage className="m-auto mt-4 text-gray-400" />
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            <p className="max-w-xs text-sm text-gray-500">
                                                {items.map((item) => item.productName).join(", ")}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => toggleOrder(order._id)}
                                            className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold hover:text-green-700"
                                        >
                                            {isExpanded ? "Hide Details" : "View Details"}

                                            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                                        </button>
                                    </div>

                                    {/* EXPANDED DETAILS */}
                                    {isExpanded && (
                                        <div className="space-y-7 border-t bg-gray-50/70 p-5 sm:p-7">

                                            {/* ORDER TRACKING */}
                                            <section>
                                                <h3 className="mb-5 flex items-center gap-2 font-extrabold">
                                                    <FiTruck className="text-green-700" />
                                                    Order Tracking
                                                </h3>

                                                {isCancelled ? (
                                                    <div className="rounded-xl bg-red-50 p-4 text-red-700">
                                                        <div className="flex items-center gap-2 font-bold">
                                                            <FiXCircle />
                                                            Order Cancelled
                                                        </div>

                                                        <p className="mt-2 text-sm">
                                                            {order.cancellationReason || "This order has been cancelled."}
                                                        </p>

                                                        <p className="mt-2 text-xs">
                                                            {formatDate(order.cancelledAt)}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                                                        {orderSteps.map((step, index) => {
                                                            const completed = currentStep >= index;

                                                            return (
                                                                <div key={step}>
                                                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                                        completed
                                                                            ? "bg-green-700 text-white"
                                                                            : "bg-gray-200 text-gray-400"
                                                                    }`}>
                                                                        {completed ? (
                                                                            <FiCheckCircle />
                                                                        ) : (
                                                                            <FiClock />
                                                                        )}
                                                                    </div>

                                                                    <p className={`mt-2 text-xs font-bold ${
                                                                        completed
                                                                            ? "text-green-700"
                                                                            : "text-gray-400"
                                                                    }`}>
                                                                        {step}
                                                                    </p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </section>

                                            {/* ORDERED ITEMS */}
                                            <section>
                                                <h3 className="mb-4 flex items-center gap-2 font-extrabold">
                                                    <FiShoppingBag className="text-green-700" />
                                                    Ordered Items ({items.length})
                                                </h3>

                                                <div className="space-y-3">
                                                    {items.map((item) => {
                                                        const imageUrl = getImageUrl(item.product?.image);

                                                        return (
                                                            <div
                                                                key={item._id}
                                                                className="flex flex-wrap items-center gap-4 rounded-xl border bg-white p-4"
                                                            >
                                                                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-50">
                                                                    {imageUrl && (
                                                                        <Image
                                                                            src={imageUrl}
                                                                            alt={item.productName}
                                                                            fill
                                                                            sizes="80px"
                                                                            className="object-contain p-2"
                                                                        />
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0 flex-1">
                                                                    <h4 className="font-bold">
                                                                        {item.productName}
                                                                    </h4>

                                                                    {item.variantName && (
                                                                        <p className="mt-1 text-sm text-gray-500">
                                                                            Variant: {item.variantName}
                                                                        </p>
                                                                    )}

                                                                    {item.sku && (
                                                                        <p className="mt-1 text-xs text-gray-400">
                                                                            SKU: {item.sku}
                                                                        </p>
                                                                    )}

                                                                    <p className="mt-2 text-sm text-gray-500">
                                                                        {formatPrice(item.price)} × {item.quantity}
                                                                    </p>
                                                                </div>

                                                                <div className="text-right">
                                                                    <p className="text-xs text-gray-500">
                                                                        Item Total
                                                                    </p>

                                                                    <p className="mt-1 font-extrabold">
                                                                        {formatPrice(item.totalPrice)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </section>

                                            {/* DELIVERY ADDRESS */}
                                            <section className="rounded-xl border bg-white p-5">
                                                <h3 className="mb-4 flex items-center gap-2 font-extrabold">
                                                    <FiMapPin className="text-green-700" />
                                                    Delivery Address
                                                </h3>

                                                {order.address ? (
                                                    <>
                                                        <p className="font-bold">
                                                            {order.address.type}
                                                        </p>

                                                        <p className="mt-2 text-sm leading-6 text-gray-600">
                                                            {order.address.houseNumber}, {order.address.street}
                                                            {order.address.landmark && `, Near ${order.address.landmark}`}
                                                        </p>

                                                        <p className="text-sm text-gray-600">
                                                            {order.address.city}, {order.address.state} - {order.address.pincode}
                                                        </p>

                                                        <p className="text-sm text-gray-600">
                                                            {order.address.country}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-gray-500">
                                                        Address details unavailable.
                                                    </p>
                                                )}
                                            </section>

                                            {/* PAYMENT DETAILS */}
                                            <section className="rounded-xl border bg-white p-5">
                                                <h3 className="mb-4 flex items-center gap-2 font-extrabold">
                                                    <FiCreditCard className="text-green-700" />
                                                    Payment Details
                                                </h3>

                                                <div className="space-y-3 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Method</span>
                                                        <span className="font-bold">
                                                            {order.paymentMethod}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Payment Status</span>
                                                        <span className="font-bold">
                                                            {order.paymentStatus}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between gap-3">
                                                        <span className="text-gray-500">Order ID</span>
                                                        <span className="max-w-36 truncate font-semibold">
                                                            {order._id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* PRICE BREAKDOWN */}
                                            <section className="rounded-xl border bg-white p-5">
                                                <h3 className="mb-4 font-extrabold">
                                                    Price Breakdown
                                                </h3>

                                                <div className="ml-auto max-w-md space-y-3 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Subtotal</span>
                                                        <span className="font-semibold">
                                                            {formatPrice(order.subtotal)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Discount</span>
                                                        <span className="font-semibold text-green-600">
                                                            - {formatPrice(order.discount)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Delivery Fee</span>
                                                        <span className="font-semibold">
                                                            {order.deliveryFee === 0
                                                                ? "FREE"
                                                                : formatPrice(order.deliveryFee)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Tax</span>
                                                        <span className="font-semibold">
                                                            {formatPrice(order.tax)}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between border-t pt-4">
                                                        <span className="font-extrabold">
                                                            Total Amount
                                                        </span>

                                                        <span className="text-xl font-extrabold text-green-700">
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
