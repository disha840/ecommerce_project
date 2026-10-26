import FormModal from "../../components/Store/formModal";
import api from "../../api";

import { useState, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";

const Store = () => {
  const [stores, setStores] = useState([]);

  const fetchStores = async () => {
    try {
      const res = await api.get("/store/getstores");
      setStores(res.data.stores);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const [showmodel, setShowmodal] = useState(false);

  return (
    <div className="min-h-screen space-y-6 bg-[#F0FAFC] p-6 text-[#102A43]">
      {showmodel && <FormModal onClose={() => setShowmodal(false)} />}

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Store Management</h1>
        <p className="mt-1 text-sm text-[#627D98]">
          Manage stores, managers, locations and status.
        </p>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">Total Stores</p>
              <h2 className="mt-2 text-3xl font-bold">{stores.length}</h2>
            </div>

            <div className="rounded-xl bg-[#D7F2F6] p-3 text-[#087F95]">
              <FiMapPin size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">Active Stores</p>
              <h2 className="mt-2 text-3xl font-bold text-[#087F95]">
                {stores.filter((store) => store.status === "ACTIVE").length}
              </h2>
            </div>

            <div className="rounded-xl bg-[#D7F2F6] p-3 text-[#087F95]">
              <FiCheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">Inactive Stores</p>
              <h2 className="mt-2 text-3xl font-bold text-[#627D98]">
                {stores.filter((store) => store.status !== "ACTIVE").length}
              </h2>
            </div>

            <div className="rounded-xl bg-[#F0FAFC] p-3 text-[#627D98]">
              <FiXCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BOX + ADD BUTTON */}
      <div className="rounded-2xl border border-[#D9E8EF] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#627D98]"
              size={19}
            />

            <input
              type="text"
              placeholder="Search stores, code, manager, phone..."
              className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] py-2.5 pl-10 pr-4 text-sm text-[#102A43] outline-none placeholder:text-[#829AB1] transition focus:border-[#087F95] focus:ring-2 focus:ring-[#22B8CF]/20"
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-[#087F95] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066779]"
            onClick={() => setShowmodal(true)}
          >
            <FiPlus size={19} />
            Add Store
          </button>
        </div>
      </div>

      {/* STORES TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">
        <div className="border-b border-[#D9E8EF] p-5">
          <h2 className="font-semibold text-[#102A43]">All Stores</h2>
          <p className="mt-1 text-sm text-[#627D98]">
            View and manage your registered stores.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-[#D9E8EF] bg-[#F8FCFD]">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">
                  S.No.
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">
                  Store
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">
                  Store Code
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">
                  Manager
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">
                  Phone
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">
                  Service Radius
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[#627D98]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#D9E8EF]">
              {stores.map((store, index) => (
                <tr
                  key={store._id}
                  className="transition hover:bg-[#F8FCFD]"
                >
                  <td className="px-6 py-4 text-sm text-[#627D98]">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4 font-semibold text-[#102A43]">
                    {store.name}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-[#D7F2F6] px-3 py-1.5 text-sm font-medium text-[#087F95]">
                      {store.code}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#102A43]">
                      <FiUsers className="text-[#087F95]" />

                      {store.manager
                        ? `${store.manager.firstName || ""} ${store.manager.lastName || ""}`.trim()
                        : "Not assigned"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#102A43]">
                    {store.phone}
                  </td>

                  <td className="px-6 py-4 text-sm text-[#102A43]">
                    {store.serviceRadius} km
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        store.status === "ACTIVE"
                          ? "bg-[#D7F2F6] text-[#087F95]"
                          : "bg-[#F0FAFC] text-[#627D98]"
                      }`}
                    >
                      {store.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => console.log("Edit store:", store._id)}
                        className="rounded-lg p-2 text-[#087F95] transition hover:bg-[#D7F2F6]"
                        title="Edit Store"
                      >
                        <FiEdit2 size={18} />
                      </button>

                      <button
                        onClick={() => console.log("Delete store:", store._id)}
                        className="rounded-lg p-2 text-[#627D98] transition hover:bg-[#F0FAFC]"
                        title="Delete Store"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {stores.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-[#627D98]"
                  >
                    No stores found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {/* Existing pagination remains commented out. */}
      </div>
    </div>
  );
};

export default Store;
