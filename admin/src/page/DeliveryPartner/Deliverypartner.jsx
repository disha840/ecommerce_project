import React, { useState } from "react";
import FormModal from "../../components/DeliveryPartner/formModal";
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
} from "react-icons/fi";

const Deliverypartner = () => {
  const [showModal, setShowModal] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const permissions = user?.permissions || [];

  if (!permissions.some((permission) => permission.includes("delivery-partner"))) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-4 text-[#102A43] sm:p-6">
      {showModal && permissions.includes("delivery-partner:create") && (
        <FormModal onClose={() => setShowModal(false)} />
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

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">Total Partners</p>
              <h2 className="mt-2 text-3xl font-bold">0</h2>
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
              <h2 className="mt-2 text-3xl font-bold text-[#087F95]">0</h2>
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
              <h2 className="mt-2 text-3xl font-bold text-orange-500">0</h2>
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
              <h2 className="mt-2 text-3xl font-bold text-blue-600">0</h2>
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
              <h2 className="mt-2 text-3xl font-bold text-cyan-600">0</h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <FiActivity size={25} />
            </div>
          </div>
        </div>
      </div>

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
                placeholder="Search by name, email, vehicle or license..."
                className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-[#627D98]">
              Status
            </label>

            <select className="rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm outline-none focus:border-[#22B8CF]">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <label className="text-sm font-medium text-[#627D98]">
              Show
            </label>

            <select className="rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm outline-none focus:border-[#22B8CF]">
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>

            <span className="text-sm text-[#627D98]">entries</span>
          </div>
        </div>
      </div>

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
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="5" className="px-5 py-16 text-center">
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deliverypartner;