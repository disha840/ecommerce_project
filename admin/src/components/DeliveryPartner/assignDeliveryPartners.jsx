
import React, { useEffect, useState } from "react";
import api from "../../api";
import {
    FiX,
    FiTruck,
    FiMail,
    FiPhone,
    FiUser,
    FiSearch,
} from "react-icons/fi";

const AssignDeliveryPartner = ({ show, onClose, orderId }) => {
    const [deliveryPartners, setDeliveryPartners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [assigning, setAssigning] = useState("");

    useEffect(() => {
        if (show) {
            getAvailablePartners();
        }
    }, [show]);

    const getAvailablePartners = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                "/deliverypartner/available"
            );

            if (response.data.success) {
                setDeliveryPartners(
                    response.data.deliveryPartners || []
                );
            }
        } catch (error) {
            console.log("Get Delivery Partners Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to fetch delivery partners"
            );
        } finally {
            setLoading(false);
        }
    };

    // ASSIGN DELIVERY PARTNER
    const handleAssign = async (deliveryPartnerId) => {
        try {
            setAssigning(deliveryPartnerId);

            const response = await api.post(
                "/order/assign-delivery-partner",
                {
                    orderId: orderId,
                    deliveryPartnerId: deliveryPartnerId,
                }
            );

            if (response.data.success) {
                alert(response.data.message || "Delivery partner assigned successfully");

                onClose();
            }
        } catch (error) {
            console.log("Assign Delivery Partner Error:", error);
            console.log("Status:", error.response?.status);
console.log("Message:", error.response?.data?.message);
console.log("Response:", error.response?.data);

            alert(
                error.response?.data?.message ||
                "Failed to assign delivery partner"
            );
        } finally {
            setAssigning("");
        }
    };

    const filteredPartners = deliveryPartners.filter((partner) => {
        const name = `${partner.user?.firstName || ""} ${
            partner.user?.lastName || ""
        }`.toLowerCase();

        return (
            name.includes(search.toLowerCase()) ||
            partner.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
            partner.user?.phone?.includes(search)
        );
    });

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between p-6 border-b border-[#D9E8EF]">

                    <div>
                        <div className="flex items-center gap-3">
                            <div className="bg-[#D7F2F6] p-3 rounded-xl">
                                <FiTruck className="text-[#087F95] text-xl" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-[#102A43]">
                                    Assign Delivery Partner
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Select a delivery partner for this order
                                </p>
                            </div>
                        </div>

                        {orderId && (
                            <p className="text-xs text-gray-500 mt-3">
                                Order ID: {orderId}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                        <FiX size={22} />
                    </button>
                </div>

                {/* SEARCH */}
                <div className="p-5 border-b border-[#D9E8EF]">

                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-[#D9E8EF] rounded-xl outline-none focus:border-[#22B8CF]"
                        />
                    </div>

                </div>

                {/* PARTNER LIST */}
                <div className="p-5 overflow-y-auto flex-1">

                    {loading ? (
                        <div className="text-center py-12 text-gray-500">
                            Loading delivery partners...
                        </div>
                    ) : filteredPartners.length === 0 ? (
                        <div className="text-center py-12">
                            <FiTruck className="text-4xl text-gray-300 mx-auto mb-3" />

                            <p className="text-gray-600 font-medium">
                                No delivery partners found
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {filteredPartners.map((partner) => (
                                <div
                                    key={partner._id}
                                    className="border border-[#D9E8EF] rounded-xl p-5 hover:border-[#22B8CF] transition"
                                >

                                    <div className="flex items-start justify-between">

                                        <div className="flex items-center gap-3">

                                            <div className="w-12 h-12 rounded-full bg-[#D7F2F6] flex items-center justify-center">
                                                <FiUser className="text-[#087F95] text-xl" />
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-[#102A43]">
                                                    {partner.user?.firstName}{" "}
                                                    {partner.user?.lastName}
                                                </h3>

                                                <p className="text-xs text-gray-500">
                                                    Delivery Partner
                                                </p>
                                            </div>

                                        </div>

                                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                            Available
                                        </span>

                                    </div>

                                    <div className="mt-5 space-y-3">

                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <FiMail className="text-[#087F95]" />
                                            <span className="break-all">
                                                {partner.user?.email || "N/A"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <FiPhone className="text-[#087F95]" />
                                            <span>
                                                {partner.user?.phone || "N/A"}
                                            </span>
                                        </div>

                                    </div>

                                    <button
                                        onClick={() => handleAssign(partner._id)}
                                        disabled={assigning !== ""}
                                        className="w-full mt-5 bg-[#087F95] hover:bg-[#066778] disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
                                    >
                                        {assigning === partner._id
                                            ? "Assigning..."
                                            : "Assign Order"}
                                    </button>

                                </div>
                            ))}

                        </div>
                    )}

                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-[#D9E8EF] flex justify-end">

                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                        Close
                    </button>

                </div>

            </div>
        </div>
    );
};

export default AssignDeliveryPartner;