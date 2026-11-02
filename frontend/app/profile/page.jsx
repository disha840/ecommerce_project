


"use client";

import EditProfileModal from "@/components/EditProfileModal";
import { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

function InfoItem({ label, value }) {
    return (
        <div className="rounded-lg border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-gray-800 font-medium">{value || "-"}</p>
        </div>
    );
}

export default function ProfilePage() {

    const [showModal, setShowModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const { user } = useSelector((state) => state.auth);

    const initials =
        (user?.firstName?.[0] || "") +
        (user?.lastName?.[0] || "") || "U";

    // Yahan apna genuine address data daalna
    const addresses = [];

    return (

        <div className="min-h-screen bg-green-50 p-6 md:p-10">

            {showModal && (
                <EditProfileModal
                    closeModal={() => setShowModal(false)}
                />
            )}

            <div className="max-w-6xl mx-auto">

                {/* PAGE TITLE */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        My Profile
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        View and manage your account information
                    </p>
                </div>

                {/* PROFILE SUMMARY AND ORDERS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* PROFILE CARD */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center h-fit">

                        <div className="w-24 h-24 rounded-full bg-emerald-700 text-white text-3xl font-semibold flex items-center justify-center uppercase">
                            {initials}
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-gray-800">
                            {user?.firstName} {user?.lastName}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1 break-all">
                            {user?.email}
                        </p>

                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-6 w-full bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            Edit Profile
                        </button>

                    </div>

                    {/* MY ORDERS CARD */}
                    <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-6">

                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    My Orders
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Track and manage your orders
                                </p>
                            </div>

                            <Link
                                href="/my-orders"
                                className="text-sm font-medium text-emerald-700 hover:underline"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                            <div className="rounded-xl bg-green-50 p-5 text-center">
                                <div className="text-2xl mb-2">📦</div>
                                <h3 className="font-semibold text-gray-800">
                                    All Orders
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    View your orders
                                </p>
                            </div>

                            <div className="rounded-xl bg-blue-50 p-5 text-center">
                                <div className="text-2xl mb-2">🚚</div>
                                <h3 className="font-semibold text-gray-800">
                                    Processing
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Track your orders
                                </p>
                            </div>

                            <div className="rounded-xl bg-orange-50 p-5 text-center">
                                <div className="text-2xl mb-2">✓</div>
                                <h3 className="font-semibold text-gray-800">
                                    Delivered
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Completed orders
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* PERSONAL INFORMATION */}
                <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">

                    <div className="pb-4 mb-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Personal Information
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Your personal account details
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <InfoItem label="First Name" value={user?.firstName} />
                        <InfoItem label="Last Name" value={user?.lastName} />
                        <InfoItem label="Email Address" value={user?.email} />
                        <InfoItem label="Phone Number" value={user?.phone} />

                    </div>

                </div>

                {/* SAVED ADDRESSES */}
                <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-5 mb-5 border-b border-gray-200">

                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Saved Addresses
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage your delivery addresses
                            </p>
                        </div>

                        <button
                            onClick={() => setShowAddressModal(true)}
                            className="bg-emerald-700 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-green-700"
                        >
                            + Add New Address
                        </button>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {addresses.map((address) => (

                            <div
                                key={address.id}
                                className="border border-gray-200 rounded-xl p-5 hover:border-emerald-500 transition"
                            >

                                <div className="flex justify-between items-center mb-4">

                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">
                                            {address.type === "Home" ? "🏠" : "🏢"}
                                        </span>

                                        <h3 className="font-semibold text-gray-800">
                                            {address.type}
                                        </h3>
                                    </div>

                                    {address.isDefault && (
                                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                            Default
                                        </span>
                                    )}

                                </div>

                                <p className="font-medium text-gray-800">
                                    {address.name}
                                </p>

                                <p className="text-sm text-gray-600 mt-2">
                                    {address.address}
                                </p>

                                <p className="text-sm text-gray-600">
                                    {address.city}, {address.state} - {address.pincode}
                                </p>

                                <p className="text-sm text-gray-600 mt-2">
                                    Phone: {address.phone}
                                </p>

                                <div className="flex gap-4 mt-5 pt-4 border-t border-gray-100">

                                    <button className="text-sm text-emerald-700 font-medium hover:underline">
                                        Edit
                                    </button>

                                    <button className="text-sm text-red-600 font-medium hover:underline">
                                        Delete
                                    </button>

                                    {!address.isDefault && (
                                        <button className="text-sm text-gray-600 font-medium hover:underline">
                                            Set Default
                                        </button>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}