import React, { useState, useEffect } from "react";
import api from "../../api";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AssignDeliveryPartner from "../../components/DeliveryPartner/assignDeliveryPartners";

const Orders = () => {
  const user = useSelector((state) => state.auth.user);
  const permissions = user?.permissions || [];

  const isDeliveryPartner = user?.role === "delivery_partner";

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [isOnline, setIsOnline] = useState(false);
  const [locationError, setLocationError] = useState("");

  // OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedDeliveryOrder, setSelectedDeliveryOrder] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  // View Order Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [revenueSummary, setRevenueSummary] = useState({
    totalEarnings: 0,
    payableAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    completedDeliveries: 0,
  });

  // Permission Check
  if (
    !isDeliveryPartner &&
    !permissions.some((permission) => permission.includes("orders"))
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Get Orders
  async function getOrders() {
    try {
      const response = await api.get("/order/all");

      setData(response.data.orders || []);

      if (isDeliveryPartner) {
        setRevenueSummary(
          response.data.revenueSummary || {
            totalEarnings: 0,
            payableAmount: 0,
            paidAmount: 0,
            pendingAmount: 0,
            completedDeliveries: 0,
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Toggle Online / Offline
  const handleToggleStatus = async () => {
    try {
      const response = await api.patch(
        "/deliverypartner/delivery-partner/toggle-status"
      );

      setIsOnline(response.data.isOnline);
      setLocationError("");
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  // Update Delivery Partner Location
  const updateLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await api.patch("/deliverypartner/delivery-partner/update-location", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          setLocationError("");
        } catch (error) {
          console.log(error.response?.data?.message);
        }
      },
      (error) => {
        setLocationError(error.message);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  // Open OTP Modal
  function handlePlaceOrder(id) {
    setSelectedDeliveryOrder(id);
    setOtp("");
    setOtpError("");
    setShowOtpModal(true);
  }

  // Verify Delivery OTP
  const handleVerifyOtp = async () => {
    if (!/^\d{4}$/.test(otp)) {
      setOtpError("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setOtpError("");

      const response = await api.post("/order/verify-otp", {
        orderId: selectedDeliveryOrder,
        otp: otp,
      });

      if (response.data.success) {
        alert(response.data.message);

        setShowOtpModal(false);
        setSelectedDeliveryOrder(null);
        setOtp("");

        getOrders();
      }
    } catch (error) {
      setOtpError(
        error.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // View Single Order
  async function handleView(id) {
    try {
      setViewLoading(true);
      setSelectedOrder(null);
      setShowViewModal(true);

      const response = await api.get(`/order/single/${id}`);

      if (response.data.success) {
        setSelectedOrder(response.data.order);
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Unable to fetch order details"
      );

      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  }

  // Get Orders
  useEffect(() => {
    getOrders();
  }, []);

  // Update Location when Delivery Partner is Online
  useEffect(() => {
    if (!isDeliveryPartner || !isOnline) return;

    updateLocation();

    const interval = setInterval(() => {
      updateLocation();
    }, 30000);

    return () => clearInterval(interval);
  }, [isOnline, isDeliveryPartner]);

  // Search Orders
  const filteredData = data.filter(
    (item) =>
      item._id?.toLowerCase().includes(search.toLowerCase()) ||
      item.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      item.orderStatus?.toLowerCase().includes(search.toLowerCase())
  );

  // Admin Statistics
  const totalOrders = data.length;

  const pendingOrders = data.filter(
    (item) => item.orderStatus === "Pending"
  ).length;

  const completedOrders = data.filter(
    (item) => item.orderStatus === "Delivered"
  ).length;

  function handleAssign(id) {
    setSelectedOrderId(id);
    setShowAssignModal(true);
  }

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-4 text-[#102A43] sm:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {isDeliveryPartner ? "My Earnings" : "Orders"}
          </h1>

          <p className="mt-1 text-sm text-[#627D98]">
            {isDeliveryPartner
              ? "Your delivery earnings and payout overview."
              : "Manage and assign customer orders"}
          </p>
        </div>

        {/* Delivery Partner Online / Offline Button */}
        {isDeliveryPartner && (
          <div>
            <button
              onClick={handleToggleStatus}
              className={`rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
                isOnline
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isOnline ? "Go Offline" : "Go Online"}
            </button>

            <p className="mt-2 text-xs text-[#627D98]">
              Status: {isOnline ? "Online" : "Offline"}
            </p>

            {locationError && (
              <p className="mt-1 text-xs text-red-600">
                {locationError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Delivery Partner Earnings Cards */}
      {isDeliveryPartner ? (
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">Total Earnings</p>
            <h2 className="mt-3 text-2xl font-bold text-[#102A43]">
              ₹{formatAmount(revenueSummary.totalEarnings)}
            </h2>
            <p className="mt-2 text-xs text-[#627D98]">
              {revenueSummary.completedDeliveries || 0} Completed deliveries
            </p>
          </div>

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">Payable Amount</p>
            <h2 className="mt-3 text-2xl font-bold text-[#087F95]">
              ₹{formatAmount(revenueSummary.payableAmount)}
            </h2>
            <p className="mt-2 text-xs text-[#627D98]">
              Awaiting settlement
            </p>
          </div>

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">Paid Amount</p>
            <h2 className="mt-3 text-2xl font-bold text-[#087F95]">
              ₹{formatAmount(revenueSummary.paidAmount)}
            </h2>
            <p className="mt-2 text-xs text-[#627D98]">
              Already settled
            </p>
          </div>

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">Pending Amount</p>
            <h2 className="mt-3 text-2xl font-bold text-[#B7791F]">
              ₹{formatAmount(revenueSummary.pendingAmount)}
            </h2>
            <p className="mt-2 text-xs text-[#627D98]">
              Delivery not completed yet
            </p>
          </div>

        </div>
      ) : (

        /* Admin Statistics Cards */
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">Total Orders</p>
            <h2 className="mt-2 text-3xl font-bold">{totalOrders}</h2>
          </div>

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">Pending Orders</p>
            <h2 className="mt-2 text-3xl font-bold text-[#087F95]">
              {pendingOrders}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">Completed Orders</p>
            <h2 className="mt-2 text-3xl font-bold text-[#627D98]">
              {completedOrders}
            </h2>
          </div>

        </div>
      )}

      {/* Search */}
      <div className="mb-5 rounded-2xl border border-[#D9E8EF] bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by order ID, customer name or status..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm text-[#102A43] placeholder:text-[#627D98] outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20"
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">

        <div className="border-b border-[#D9E8EF] p-5">
          <h2 className="text-lg font-semibold">
            {isDeliveryPartner ? "My Assigned Orders" : "All Orders"}
          </h2>

          <p className="mt-1 text-sm text-[#627D98]">
            {isDeliveryPartner
              ? "List of orders assigned to you"
              : "List of all customer orders"}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">

            <thead className="bg-[#EAF7FA]">
              <tr>
                <th className="px-5 py-4">S.No</th>
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Total Amount</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Order Status</th>
                <th className="px-5 py-4">Created At</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-t border-[#D9E8EF] transition hover:bg-[#F0FAFC]"
                  >
                    <td className="px-5 py-5">{index + 1}</td>

                    <td className="px-5 py-5 font-medium">
                      {item.orderNumber}
                    </td>

                    <td className="px-5 py-5">
                      {`${item.user?.firstName || ""} ${
                        item.user?.lastName || ""
                      }`.trim() || "N/A"}
                    </td>

                    <td className="px-5 py-5 font-medium">
                      ₹{item.totalAmount || 0}
                    </td>

                    <td className="px-5 py-5">
                      {item.paymentMethod || "N/A"}
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.orderStatus === "Delivered"
                            ? "bg-[#D7F2F6] text-[#087F95]"
                            : item.orderStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.orderStatus === "Cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-[#EDF3F5] text-[#627D98]"
                        }`}
                      >
                        {item.orderStatus || "N/A"}
                      </span>
                    </td>

                    <td className="px-5 py-5 text-[#627D98]">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex justify-center gap-2">

                        {(isDeliveryPartner ||
                          permissions.includes("orders:read")) && (
                          <button
                            onClick={() => handleView(item._id)}
                            className="rounded-lg bg-[#D7F2F6] px-3 py-2 text-[#087F95] transition hover:bg-[#BDEAF0]"
                          >
                            View Order
                          </button>
                        )}

                        {isDeliveryPartner &&
                          item.orderStatus !== "Delivered" &&
                          item.orderStatus !== "Cancelled" && (
                            <button
                              onClick={() => handlePlaceOrder(item._id)}
                              className="rounded-lg bg-[#087F95] px-3 py-2 text-white transition hover:bg-[#066778]"
                            >
                              Place Order
                            </button>
                          )}

                        {!isDeliveryPartner &&
                          permissions.includes("orders:update") && (
                            item.deliveryPartner ? (
                              <button
                                disabled
                                className="cursor-not-allowed rounded-lg bg-green-100 px-3 py-2 text-green-700"
                              >
                                Assigned
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAssign(item._id)}
                                className="rounded-lg bg-[#EAF7FA] px-3 py-2 text-[#102A43] transition hover:bg-[#D7F2F6]"
                              >
                                Assign Order
                              </button>
                            )
                          )}

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-[#627D98]"
                  >
                    {search
                      ? "No orders found matching your search."
                      : "No orders available."}
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Assign Delivery Partner Popup - Admin Only */}
      {!isDeliveryPartner && (
        <AssignDeliveryPartner
          show={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedOrderId(null);
            getOrders();
          }}
          orderId={selectedOrderId}
        />
      )}

      {/* VIEW ORDER MODAL */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#102A43]">
                Order Details
              </h2>

              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedOrder(null);
                }}
                className="text-xl text-[#627D98] hover:text-red-600"
              >
                ✕
              </button>
            </div>

            {viewLoading ? (
              <p className="py-10 text-center text-[#627D98]">
                Loading order details...
              </p>
            ) : selectedOrder ? (
              <div className="space-y-5">

                {/* ORDER INFORMATION */}
                <div className="rounded-xl border border-[#D9E8EF] p-4">
                  <h3 className="mb-3 font-semibold text-[#087F95]">
                    Order Information
                  </h3>

                  <p>
                    <strong>Order ID:</strong>{" "}
                    {selectedOrder.orderNumber || "N/A"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedOrder.orderStatus || "N/A"}
                  </p>

                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {selectedOrder.paymentMethod || "N/A"}
                  </p>

                  <p>
                    <strong>Total Amount:</strong>{" "}
                    ₹{selectedOrder.totalAmount || 0}
                  </p>

                  <p>
                    <strong>Order Date:</strong>{" "}
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString("en-IN")
                      : "N/A"}
                  </p>
                </div>

                {/* CUSTOMER INFORMATION */}
                <div className="rounded-xl border border-[#D9E8EF] p-4">
                  <h3 className="mb-3 font-semibold text-[#087F95]">
                    Customer Information
                  </h3>

                  <p>
                    <strong>Name:</strong>{" "}
                    {`${selectedOrder.user?.firstName || ""} ${
                      selectedOrder.user?.lastName || ""
                    }`.trim() || "N/A"}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedOrder.user?.email || "N/A"}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedOrder.user?.phone || "N/A"}
                  </p>
                </div>

                {/* DELIVERY OTP */}
                {selectedOrder.deliveryOtp &&
                  selectedOrder.orderStatus !== "Delivered" && (
                    <div className="rounded-xl border border-[#B8E5ED] bg-[#E5F6FA] p-4">
                      <h3 className="font-semibold text-[#102A43]">
                        Delivery OTP
                      </h3>

                      <p className="mt-2 text-2xl font-bold tracking-[0.4em] text-[#087F95]">
                        {selectedOrder.deliveryOtp}
                      </p>
                    </div>
                  )}

                {/* DELIVERY ADDRESS */}
                <div className="rounded-xl border border-[#D9E8EF] p-4">
                  <h3 className="mb-3 font-semibold text-[#087F95]">
                    Delivery Address
                  </h3>

                  <p>
                    {[
                      selectedOrder.address?.houseNumber,
                      selectedOrder.address?.street,
                      selectedOrder.address?.landmark,
                      selectedOrder.address?.city,
                      selectedOrder.address?.state,
                      selectedOrder.address?.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Address not available"}
                  </p>
                </div>

                {/* ORDER ITEMS */}
                <div className="rounded-xl border border-[#D9E8EF] p-4">
                  <h3 className="mb-3 font-semibold text-[#087F95]">
                    Ordered Items
                  </h3>

                  <div className="space-y-3">
                    {selectedOrder.items?.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <div
                          key={item._id || index}
                          className="flex justify-between gap-3 border-b border-[#D9E8EF] pb-3 last:border-0"
                        >
                          <div>
                            <p className="font-medium text-[#102A43]">
                              {item.productName ||
                                item.product?.name ||
                                "Product"}
                            </p>

                            <p className="text-sm text-[#627D98]">
                              {item.variantName ||
                                item.variant?.name ||
                                ""}
                            </p>

                            <p className="text-sm text-[#627D98]">
                              Quantity: {item.quantity || 0}
                            </p>
                          </div>

                          <p className="font-semibold">
                            ₹{item.totalPrice || item.price || 0}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#627D98]">
                        No items found.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <p className="py-10 text-center text-[#627D98]">
                Order details not available.
              </p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedOrder(null);
                }}
                className="rounded-lg bg-[#087F95] px-5 py-2 text-white hover:bg-[#066778]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-bold text-[#102A43]">
              Verify Delivery OTP
            </h2>

            <p className="mt-2 text-sm text-[#627D98]">
              Enter the 4-digit OTP received from the customer.
            </p>

            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, ""));
                setOtpError("");
              }}
              placeholder="Enter 4-digit OTP"
              className="mt-5 w-full rounded-xl border border-[#D9E8EF] px-4 py-3 outline-none focus:border-[#22B8CF]"
            />

            {otpError && (
              <p className="mt-2 text-sm text-red-600">
                {otpError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-3">

              <button
                disabled={loading}
                onClick={() => {
                  setShowOtpModal(false);
                  setSelectedDeliveryOrder(null);
                  setOtp("");
                  setOtpError("");
                }}
                className="rounded-lg border border-[#D9E8EF] px-4 py-2 text-[#627D98]"
              >
                Cancel
              </button>

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="rounded-lg bg-[#087F95] px-4 py-2 text-white disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;
