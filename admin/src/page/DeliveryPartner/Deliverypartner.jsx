
import React, { useState, useEffect } from "react";
import FormModal from "../../components/DeliveryPartner/formModal";
import api from "../../api";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiWifi,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const Deliverypartner = () => {
  const [showModal, setShowModal] = useState(false);

  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const [counts, setCounts] = useState({
    totalPartners: 0,
    activePartners: 0,
    inactivePartners: 0,
    onlinePartners: 0,
    availablePartners: 0,
    filteredTotal: 0,
    totalPages: 0,
  });

  const user = useSelector((state) => state.auth.user);
  const permissions = user?.permissions || [];

  if (!permissions.some((permission) => permission.includes("delivery-partner"))) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Get all delivery partners
  const getDeliveryPartners = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/deliverypartner/all", {
        params: {
          page,
          limit,
          search,
          status,
        },
      });

      if (response.data.success) {
        setDeliveryPartners(response.data.deliveryPartners || []);

        setCounts({
          totalPartners: response.data.totalPartners || 0,
          activePartners: response.data.activePartners || 0,
          inactivePartners: response.data.inactivePartners || 0,
          onlinePartners: response.data.onlinePartners || 0,
          availablePartners: response.data.availablePartners || 0,
          filteredTotal: response.data.filteredTotal || 0,
          totalPages: response.data.totalPages || 0,
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch delivery partners"
      );
      setDeliveryPartners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDeliveryPartners();
  }, [page, limit, search, status]);

  const getPartnerName = (partner) => {
    const firstName = partner.user?.firstName || "";
    const lastName = partner.user?.lastName || "";

    return `${firstName} ${lastName}`.trim() || "N/A";
  };

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-4 text-[#102A43] sm:p-6">
      {showModal && permissions.includes("delivery-partner:create") && (
        <FormModal
          onClose={() => setShowModal(false)}
          getdata={getDeliveryPartners}
        />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Delivery Partners</h1>
          <p className="mt-1 text-sm text-[#627D98]">
            Manage delivery partners, vehicles and their working status.
          </p>
        </div>

        {permissions.includes("delivery-partner:create") && (
          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-[#087F95] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#066779]"
            onClick={() => setShowModal(true)}
          >
            <FiPlus size={19} />
            Add Delivery Partner
          </button>
        )}
      </div>

      {/* Dashboard Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">Total Partners</p>
              <h2 className="mt-2 text-3xl font-bold">
                {counts.totalPartners}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D7F2F6] text-[#087F95]">
              <FiTruck size={25} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">Active Partners</p>
              <h2 className="mt-2 text-3xl font-bold text-[#087F95]">
                {counts.activePartners}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D7F2F6] text-[#087F95]">
              <FiCheckCircle size={25} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">Inactive Partners</p>
              <h2 className="mt-2 text-3xl font-bold text-orange-500">
                {counts.inactivePartners}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <FiXCircle size={25} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">Online Partners</p>
              <h2 className="mt-2 text-3xl font-bold text-blue-600">
                {counts.onlinePartners}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiWifi size={25} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">Available Partners</p>
              <h2 className="mt-2 text-3xl font-bold text-cyan-600">
                {counts.availablePartners}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <FiActivity size={25} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-5 rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-md">
            <label className="mb-2 block text-sm font-semibold">
              Search Delivery Partners
            </label>

            <div className="relative">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#627D98]"
                size={19}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, email, vehicle or license..."
                className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-[#627D98]">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm outline-none focus:border-[#22B8CF]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>

            <label className="text-sm font-medium text-[#627D98]">
              Show
            </label>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm outline-none focus:border-[#22B8CF]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <span className="text-sm text-[#627D98]">entries</span>
          </div>
        </div>
      </div>

      {/* Delivery Partner Table */}
      <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#D9E8EF] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Delivery Partner List</h2>
            <p className="mt-1 text-sm text-[#627D98]">
              Manage all registered delivery partners
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#EAF7FA]">
              <tr>
                <th className="px-5 py-4">Delivery Partner</th>
                <th className="px-5 py-4">Vehicle Details</th>
                <th className="px-5 py-4">Availability</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-16 text-center text-[#627D98]">
                    Loading delivery partners...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="px-5 py-16 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : deliveryPartners.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D7F2F6] text-[#087F95]">
                      <FiTruck size={30} />
                    </div>

                    <p className="mt-4 font-semibold text-[#102A43]">
                      No delivery partners found
                    </p>

                    <p className="mt-1 text-sm text-[#627D98]">
                      Add a delivery partner to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                deliveryPartners.map((partner) => (
                  <tr
                    key={partner._id}
                    className="border-t border-[#D9E8EF] hover:bg-[#F8FCFD]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#102A43]">
                        {getPartnerName(partner)}
                      </p>
                      <p className="mt-1 text-xs text-[#627D98]">
                        {partner.user?.email || "N/A"}
                      </p>
                      <p className="mt-1 text-xs text-[#627D98]">
                        {partner.user?.phone || "N/A"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium capitalize">
                        {partner.vehicleType || "N/A"}
                      </p>
                      <p className="mt-1 text-xs text-[#627D98]">
                        Vehicle: {partner.vehicleNumber || "N/A"}
                      </p>
                      <p className="mt-1 text-xs text-[#627D98]">
                        License: {partner.drivingLicenseNumber || "N/A"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p
                        className={`font-medium ${
                          partner.isOnline ? "text-blue-600" : "text-gray-500"
                        }`}
                      >
                        {partner.isOnline ? "Online" : "Offline"}
                      </p>
                      <p
                        className={`mt-1 text-xs ${
                          partner.isAvailable ? "text-green-600" : "text-orange-500"
                        }`}
                      >
                        {partner.isAvailable ? "Available" : "Not Available"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          partner.status === "active"
                            ? "bg-green-100 text-green-700"
                            : partner.status === "blocked"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {partner.status || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-[#D9E8EF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#627D98]">
            Showing {deliveryPartners.length > 0 ? (page - 1) * limit + 1 : 0}
            {" "}to {(page - 1) * limit + deliveryPartners.length}
            {" "}of {counts.filteredTotal} entries
          </p>

          <div className="flex items-center gap-3">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((previous) => previous - 1)}
              className="flex items-center gap-2 rounded-lg border border-[#D9E8EF] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiChevronLeft />
              Previous
            </button>

            <span className="text-sm text-[#102A43]">
              Page {page} of {counts.totalPages}
            </span>

            <button
              disabled={page >= counts.totalPages || loading || counts.totalPages === 0}
              onClick={() => setPage((previous) => previous + 1)}
              className="flex items-center gap-2 rounded-lg border border-[#D9E8EF] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deliverypartner;
