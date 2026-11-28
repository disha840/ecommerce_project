
import { useEffect, useState } from "react";
import CreateInventory from "../../components/Inventory/CreateInventory";
import api from "../../api";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Inventory = () => {
  const user = useSelector((state) => state.auth.user);
  const permissions = user?.permissions || [];

  const [showCreateInventory, setShowCreateInventory] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  const [inventories, setInventories] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // DELETE POPUP STATE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInventoryId, setDeleteInventoryId] = useState(null);

  // GET ALL INVENTORIES
  const getInventories = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory/getinventories");

      setInventories(response.data.inventories || []);
    } catch (error) {
      console.log("Get Inventory Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch inventories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInventories();
  }, []);

  // OPEN CREATE INVENTORY FORM
  const handleCreateInventory = () => {
    setSelectedInventory(null);
    setShowCreateInventory(true);
  };

  // OPEN EDIT INVENTORY FORM
  const handleEditInventory = (item) => {
    setSelectedInventory(item);
    setShowCreateInventory(true);
  };

  // CLOSE INVENTORY FORM
  const handleCloseForm = () => {
    setShowCreateInventory(false);
    setSelectedInventory(null);
    getInventories();
  };

  // OPEN DELETE CONFIRMATION POPUP
  const handleDeleteClick = (id) => {
    setDeleteInventoryId(id);
    setShowDeleteModal(true);
  };

  // CLOSE DELETE POPUP
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteInventoryId(null);
  };

  // DELETE INVENTORY API
  const handleDeleteInventory = async () => {
    if (!deleteInventoryId) return;

    try {
      setDeleting(true);

      const response = await api.delete(
        `/inventory/deleteinventory/${deleteInventoryId}`
      );

      toast.success(
        response.data.message || "Inventory deleted successfully"
      );

      handleCloseDeleteModal();
      getInventories();

    } catch (error) {
      console.log("Delete Inventory Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete inventory"
      );
    } finally {
      setDeleting(false);
    }
  };

  // SEARCH INVENTORY
  const filteredInventories = inventories.filter((item) =>
    item.product?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // STATISTICS
  const totalInventory = inventories.length;

  const inStock = inventories.filter(
    (item) =>
      item.status === "active" &&
      item.availableQuantity > item.reorderLevel
  ).length;

  const lowStock = inventories.filter(
    (item) =>
      item.status === "active" &&
      item.availableQuantity > 0 &&
      item.availableQuantity <= item.reorderLevel
  ).length;

  const outOfStock = inventories.filter(
    (item) => item.availableQuantity <= 0
  ).length;

  // PAGE ACCESS
  if (!user?.permissions?.some((permission) => permission.includes("inventory"))) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-6 text-[#102A43]">

      {/* CREATE / EDIT INVENTORY FORM */}
      {showCreateInventory && (
        <CreateInventory
          onClose={handleCloseForm}
          inventory={selectedInventory}
          isEdit={!!selectedInventory}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* Modal Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#102A43]">
                Delete Inventory
              </h2>

              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mb-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <FiTrash2 className="text-2xl text-red-600" />
              </div>

              <p className="text-sm leading-6 text-[#627D98]">
                Are you sure you want to delete this inventory?
                This action cannot be undone.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="rounded-xl border border-[#D9E8EF] px-5 py-2.5 text-sm font-semibold text-[#486581] transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteInventory}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>

        <p className="mt-1 text-sm text-[#627D98]">
          Manage your store product stock
        </p>
      </div>

      {/* STATISTICS */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {[
          { title: "Total Inventory", count: totalInventory },
          { title: "In Stock", count: inStock },
          { title: "Low Stock", count: lowStock },
          { title: "Out of Stock", count: outOfStock },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-[#627D98]">
              {item.title}
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {item.count}
            </h2>
          </div>
        ))}

      </div>

      {/* SEARCH AND CREATE INVENTORY */}
      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#D9E8EF] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <input
          type="text"
          placeholder="Search product by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#D7F2F6]"
        />

        {permissions.includes("inventory:create") && (
          <button
            type="button"
            onClick={handleCreateInventory}
            className="shrink-0 rounded-xl bg-[#087F95] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#066778]"
          >
            + Create Inventory
          </button>
        )}

      </div>

      {/* INVENTORY TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">

        <div className="border-b border-[#D9E8EF] p-5">
          <h2 className="text-lg font-semibold">
            All Inventory
          </h2>

          <p className="mt-1 text-sm text-[#627D98]">
            {filteredInventories.length} product(s) found
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-[#EAF7FA]">
              <tr>
                {[
                  "Product",
                  "Store",
                  "Unit",
                  "Available Stock",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-5 py-4 font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    Loading inventories...
                  </td>
                </tr>
              ) : filteredInventories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center">

                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D7F2F6] text-3xl">
                      📦
                    </div>

                    <h3 className="font-semibold">
                      No Inventory Found
                    </h3>

                    <p className="mt-1 text-sm text-[#627D98]">
                      Your inventory will appear here.
                    </p>

                  </td>
                </tr>
              ) : (
                filteredInventories.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-[#D9E8EF] transition hover:bg-[#F8FCFD]"
                  >

                    {/* PRODUCT */}
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {item.product?.name || "-"}
                    </td>

                    {/* STORE */}
                    <td className="whitespace-nowrap px-5 py-4">
                      {item.store?.name || "-"}
                    </td>

                    {/* UNIT */}
                    <td className="whitespace-nowrap px-5 py-4">
                      {item.variant?.unitValue || "-"}{" "}
                      {item.variant?.unit || ""}
                    </td>

                    {/* AVAILABLE STOCK */}
                    <td className="whitespace-nowrap px-5 py-4 font-semibold">
                      {item.availableQuantity ?? 0}
                    </td>

                    {/* STATUS */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status !== "active"
                            ? "bg-gray-100 text-gray-600"
                            : item.availableQuantity <= 0
                            ? "bg-red-100 text-red-700"
                            : item.availableQuantity <= item.reorderLevel
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.status !== "active"
                          ? "Inactive"
                          : item.availableQuantity <= 0
                          ? "Out of Stock"
                          : item.availableQuantity <= item.reorderLevel
                          ? "Low Stock"
                          : "In Stock"}
                      </span>
                    </td>

                    {/* ACTION ICONS */}
                    <td className="whitespace-nowrap px-5 py-4">

                      <div className="flex items-center gap-3">

                        {/* VIEW */}
                        {permissions.includes("inventory:read") && (
                          <button
                            type="button"
                            disabled
                            title="View details coming soon"
                            className="cursor-not-allowed rounded-lg bg-blue-50 p-2 text-blue-500 opacity-60"
                          >
                            <FiEye size={17} />
                          </button>
                        )}

                        {/* EDIT */}
                        {permissions.includes("inventory:update") && (
                          <button
                            type="button"
                            onClick={() => handleEditInventory(item)}
                            title="Edit Inventory"
                            className="rounded-lg bg-[#E0F2FE] p-2 text-[#087F95] transition hover:bg-[#BAE6FD]"
                          >
                            <FiEdit2 size={17} />
                          </button>
                        )}

                        {/* DELETE */}
                        {permissions.includes("inventory:delete") && (
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(item._id)}
                            title="Delete Inventory"
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                          >
                            <FiTrash2 size={17} />
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

export default Inventory;
