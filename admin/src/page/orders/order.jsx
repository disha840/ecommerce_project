
import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  async function getOrders() {
    try {
      const response = await api.get("/order/all");
      setData(response.data.orders || []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  const filteredData = data.filter((item) =>
    item._id?.toLowerCase().includes(search.toLowerCase()) ||
    item.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.orderStatus?.toLowerCase().includes(search.toLowerCase())
  );

  const totalOrders = data.length;

  const pendingOrders = data.filter(
    (item) => item.orderStatus === "Pending"
  ).length;

  const completedOrders = data.filter(
    (item) => item.orderStatus === "Delivered"
  ).length;

  function handleView(id) {
    navigate(`/admin/vieworder/${id}`);
  }

  function handleAssign(id) {
    navigate(`/admin/assignorder/${id}`);
  }

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-4 text-[#102A43] sm:p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="mt-1 text-sm text-[#627D98]">
          Manage and assign customer orders
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#627D98]">Total Orders</p>
          <h2 className="mt-2 text-3xl font-bold">
            {totalOrders}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#627D98]">Pending Orders</p>
          <h2 className="mt-2 text-3xl font-bold text-[#087F95]">
            {pendingOrders}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#D9E8EF]">Completed Orders</p>
          <h2 className="mt-2 text-3xl font-bold text-[#627D98]">
            {completedOrders}
          </h2>
        </div>

      </div>

      {/* Search */}
      <div className="mb-5 flex flex-col items-stretch gap-4 rounded-2xl border border-[#D9E8EF] bg-white p-4 shadow-sm">

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
          <h2 className="text-lg font-semibold">All Orders</h2>
          <p className="mt-1 text-sm text-[#627D98]">
            List of all customer orders
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

                    <td className="px-5 py-5">
                      {index + 1}
                    </td>

                    <td className="px-5 py-5 font-medium">
                      {item.orderNumber}
                    </td>

                    <td className="px-5 py-5">
                      {item.user?.firstName + " " + item.user?.lastName  || "N/A"}
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

                        <button
                          onClick={() => handleView(item._id)}
                          className="rounded-lg bg-[#D7F2F6] px-3 py-2 text-[#087F95] transition hover:bg-[#BDEAF0]"
                        >
                          View Order
                        </button>

                        <button
                          onClick={() => handleAssign(item._id)}
                          className="rounded-lg bg-[#EAF7FA] px-3 py-2 text-[#102A43] transition hover:bg-[#D7F2F6]"
                        >
                          Assign Order
                        </button>

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
    </div>
  );
};

export default Orders;
