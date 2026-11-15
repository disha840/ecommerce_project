

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
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import DeleteStoreModal from "../../components/Store/DeleteStore";

const Store = () => {
  const [stores, setStores] = useState([]);
  const [showdelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [showmodel, setShowmodal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStores, setTotalStores] = useState(0);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // FETCH STORES
  const fetchStores = async (page = 1, searchValue = search) => {
    try {
      setLoading(true);

      let res;

      if (searchValue.trim()) {
        res = await api.get(
          `/store/searched?search=${encodeURIComponent(searchValue)}&page=${page}`
        );
      } else {
        res = await api.get(`/store/getstores?page=${page}`);
      }

      setStores(res.data.stores || []);
      setCurrentPage(res.data.currentPage || page);
      setTotalPages(res.data.totalPages || 1);
      setTotalStores(res.data.totalStores || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // SEARCH AND PAGINATION
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStores(currentPage, search);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, search]);

  // OPEN ADD STORE MODAL
  const handleAddStore = () => {
    setSelectedStore(null);
    setShowmodal(true);
  };

  // OPEN UPDATE STORE MODAL
  const handleEditStore = (store) => {
    setSelectedStore(store);
    setShowmodal(true);
  };

  // CLOSE STORE MODAL
  const handleCloseModal = () => {
    setShowmodal(false);
    setSelectedStore(null);
  };

  // TOGGLE STORE STATUS
  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/store/toggle-status/${id}`);
      fetchStores()
    } catch (error) {
      console.log(error);
    }
  };

  // AFTER CREATE OR UPDATE
  const handleStoreSaved = async () => {
    setShowmodal(false);
    setSelectedStore(null);

    if (currentPage === 1) {
      await fetchStores(1, search);
    } else {
      setCurrentPage(1);
    }
  };

  // AFTER DELETE
  const handleStoreDeleted = async () => {
    setShowDelete(false);
    setDeleteId(null);

    const remainingStores = totalStores - 1;
    const lastPage = Math.max(1, Math.ceil(remainingStores / 5));

    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
    } else {
      await fetchStores(currentPage, search);
    }
  };

  const startIndex = (currentPage - 1) * 5;

  return (
    <div className="min-h-screen space-y-6 bg-[#F0FAFC] p-6 text-[#102A43]">

      {/* ADD / UPDATE STORE MODAL */}
      {showmodel && (
        <FormModal
          store={selectedStore}
          onClose={handleCloseModal}
          onSaved={handleStoreSaved}
        />
      )}

      {/* DELETE STORE MODAL */}
      {showdelete && (
        <DeleteStoreModal
          storeId={deleteId}
          onClose={() => {
            setShowDelete(false);
            setDeleteId(null);
          }}
          onDeleted={handleStoreDeleted}
        />
      )}

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
              <h2 className="mt-2 text-3xl font-bold">{totalStores}</h2>
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
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search stores, code, phone..."
              className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] py-2.5 pl-10 pr-4 text-sm text-[#102A43] outline-none placeholder:text-[#829AB1] transition focus:border-[#087F95] focus:ring-2 focus:ring-[#22B8CF]/20"
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-[#087F95] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066779]"
            onClick={handleAddStore}
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
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">S.No.</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">Store</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">Store Code</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">Manager</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">Phone</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">Service Radius</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[#627D98]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#D9E8EF]">

              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#627D98]">
                    Loading stores...
                  </td>
                </tr>
              ) : (
                <>
                  {stores.map((store, index) => (
                    <tr key={store._id} className="transition hover:bg-[#F8FCFD]">

                      <td className="px-6 py-4 text-sm text-[#627D98]">
                        {startIndex + index + 1}
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

                      {/* STATUS TOGGLE */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(store._id)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                            store.status === "ACTIVE"
                              ? "bg-[#D7F2F6] text-[#087F95]"
                              : "bg-[#F0FAFC] text-[#627D98]"
                          }`}
                        >
                          {store.status}
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">

                          <button
                            onClick={() => handleEditStore(store)}
                            className="rounded-lg p-2 text-[#087F95] transition hover:bg-[#D7F2F6]"
                            title="Edit Store"
                          >
                            <FiEdit2 size={18} />
                          </button>

                          <button
                            onClick={() => {
                              setDeleteId(store._id);
                              setShowDelete(true);
                            }}
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
                      <td colSpan={8} className="py-8 text-center text-[#627D98]">
                        No stores found
                      </td>
                    </tr>
                  )}
                </>
              )}

            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalStores > 0 && (
          <div className="flex flex-col gap-4 border-t border-[#D9E8EF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-[#627D98]">
              Showing{" "}
              <span className="font-semibold text-[#102A43]">
                {startIndex + 1} - {Math.min(startIndex + stores.length, totalStores)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#102A43]">
                {totalStores}
              </span>{" "}
              stores
            </p>

            <div className="flex items-center justify-center gap-2">

              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1 || loading}
                className="rounded-lg border border-[#D9E8EF] p-2 text-[#087F95] transition hover:bg-[#D7F2F6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  disabled={loading}
                  className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                    currentPage === index + 1
                      ? "bg-[#087F95] text-white"
                      : "border border-[#D9E8EF] text-[#627D98] hover:bg-[#D7F2F6]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages || loading}
                className="rounded-lg border border-[#D9E8EF] p-2 text-[#087F95] transition hover:bg-[#D7F2F6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronRight size={18} />
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Store;
