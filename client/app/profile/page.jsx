
"use client";

import EditProfileModal from "@/components/EditProfileModal";
import AddAddressModal from "@/components/AddAddressModal";
import api from "@/axios/api";
import { useState, useEffect } from "react";
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
    const [addresses, setAddresses] = useState([]);

    const { user } = useSelector((state) => state.auth);

    // Get Addresses
    const getAddresses = async () => {
        try {
            const response = await api.get("/address/get");
            setAddresses(response.data.addresses);
        } catch (error) {
            console.log(error.response?.data);
        }
    };

    useEffect(() => {
        getAddresses();
    }, []);

    // Delete Address
    const handleDelete = async (id) => {
        try {
            await api.delete(`/address/delete/${id}`);

            setAddresses((previousAddresses) =>
                previousAddresses.filter((item) => item._id !== id)
            );

        } catch (error) {
            console.log(error.response?.data);
        }
    };

    // Set Default Address
    const handleSetDefault = async (id) => {
        try {
            const response = await api.patch(
                `/address/set-default/${id}`
            );

            console.log(response.data.message);

            getAddresses();

        } catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    const initials =
        (user?.firstName?.[0] || "") +
        (user?.lastName?.[0] || "") || "U";

    return (

        <div className="min-h-screen bg-green-50 p-6 md:p-10">

            {/* Edit Profile Modal */}
            {showModal && (
                <EditProfileModal
                    closeModal={() => setShowModal(false)}
                />
            )}

            {/* Add Address Modal */}
            <AddAddressModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onAddressAdded={getAddresses}
            />

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
                    <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-center">

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    My Orders
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    View and track all your orders
                                </p>
                            </div>

                            <Link
                                href="/orders"
                                className="bg-emerald-700 text-white text-sm px-6 py-3 rounded-lg hover:bg-green-700 transition"
                            >
                                View My Orders →
                            </Link>

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

                        <InfoItem
                            label="First Name"
                            value={user?.firstName}
                        />

                        <InfoItem
                            label="Last Name"
                            value={user?.lastName}
                        />

                        <InfoItem
                            label="Email Address"
                            value={user?.email}
                        />

                        <InfoItem
                            label="Phone Number"
                            value={user?.phone}
                        />

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

                    {/* ADDRESS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {addresses.length > 0 ? (

                            addresses.map((address) => (

                                <div
                                    key={address._id}
                                    className={`border rounded-xl p-5 transition ${
                                        address.isDefault
                                            ? "border-emerald-500 bg-green-50/30"
                                            : "border-gray-200 hover:border-emerald-500"
                                    }`}
                                >

                                    {/* ADDRESS HEADER */}
                                    <div className="flex justify-between items-center mb-4">

                                        <h3 className="font-semibold text-gray-800">
                                            {address.type || "Address"}
                                        </h3>

                                        <div className="flex items-center gap-2">

                                            {address.isDefault && (
                                                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                                    Default Address
                                                </span>
                                            )}

                                            {/* RADIO CIRCLE */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSetDefault(address._id)
                                                }
                                                disabled={address.isDefault}
                                                title={
                                                    address.isDefault
                                                        ? "Default Address"
                                                        : "Set as Default"
                                                }
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                                                    address.isDefault
                                                        ? "border-emerald-600 bg-emerald-600 cursor-default"
                                                        : "border-gray-400 bg-white hover:border-emerald-600 cursor-pointer"
                                                }`}
                                            >
                                                {address.isDefault && (
                                                    <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                                                )}
                                            </button>

                                        </div>

                                    </div>

                                    {/* ADDRESS DETAILS */}
                                    <div className="space-y-2 text-sm text-gray-600">

                                        <p>
                                            <span className="font-medium text-gray-800">
                                                House / Flat:
                                            </span>{" "}
                                            {address.houseNumber || "-"}
                                        </p>

                                        <p>
                                            <span className="font-medium text-gray-800">
                                                Street / Area:
                                            </span>{" "}
                                            {address.street || "-"}
                                        </p>

                                        {address.landmark && (
                                            <p>
                                                <span className="font-medium text-gray-800">
                                                    Landmark:
                                                </span>{" "}
                                                {address.landmark}
                                            </p>
                                        )}

                                        <p>
                                            <span className="font-medium text-gray-800">
                                                City:
                                            </span>{" "}
                                            {address.city || "-"}
                                        </p>

                                        <p>
                                            <span className="font-medium text-gray-800">
                                                State:
                                            </span>{" "}
                                            {address.state || "-"}
                                        </p>

                                        <p>
                                            <span className="font-medium text-gray-800">
                                                Pincode:
                                            </span>{" "}
                                            {address.pincode || "-"}
                                        </p>

                                        {/* ACTION BUTTONS */}
                                        <div className="flex items-center gap-5 mt-5 pt-4 border-t border-gray-100">

                                            <button
                                                onClick={() =>
                                                    console.log("Edit Address:", address)
                                                }
                                                className="text-sm font-medium text-emerald-700 hover:underline"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(address._id)
                                                }
                                                className="text-sm font-medium text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))

                        ) : (

                            <p className="text-sm text-gray-500">
                                No saved addresses yet.
                            </p>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}
