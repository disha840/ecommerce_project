

import { useEffect, useState } from "react";
import CreateInventory from "../../components/Inventory/CreateInventory";
import api from "../../api";

const Inventory = () => {
  const [showCreateInventory, setShowCreateInventory] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // GET ALL INVENTORIES
  const getInventories = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory/getinventories");

      setInventories(response.data.inventories || []);
    } catch (error) {
      console.log("Get Inventory Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInventories();
  }, []);

  // SEARCH INVENTORY
  const filteredInventories = inventories.filter((item) =>
    item.product?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // STATISTICS
  const totalInventory = inventories.length;

  const inStock = inventories.filter(
    (item) => item.availableQuantity > item.reorderLevel
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

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-6 text-[#102A43]">

      {showCreateInventory && (
        <CreateInventory
          onClose={() => {
            setShowCreateInventory(false);
            getInventories();
          }}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="mt-1 text-sm text-[#627D98]">
          Manage your store product stock
        </p>
      </div>

      {/* Statistics */}
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
            <p className="text-sm text-[#627D98]">{item.title}</p>
            <h2 className="mt-2 text-3xl font-bold">{item.count}</h2>
          </div>
        ))}

      </div>

      {/* Search and Create Inventory */}
      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#D9E8EF] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <input
          type="text"
          placeholder="Search product by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#D7F2F6]"
        />

        <button
          type="button"
          onClick={() => setShowCreateInventory(true)}
          className="shrink-0 rounded-xl bg-[#087F95] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#066778]"
        >
          + Create Inventory
        </button>

      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">

        <div className="border-b border-[#D9E8EF] p-5">
          <h2 className="text-lg font-semibold">All Inventory</h2>

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

                    <h3 className="font-semibold">No Inventory Found</h3>

                    <p className="mt-1 text-sm text-[#627D98]">
                      Your inventory will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInventories.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-[#D9E8EF] hover:bg-[#F8FCFD]"
                  >
                    {/* Product */}
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {item.product?.name || "-"}
                    </td>

                    {/* Store Name */}
                    <td className="whitespace-nowrap px-5 py-4">
                      {item.store?.name || "-"}
                    </td>

                    {/* Unit */}
                    <td className="whitespace-nowrap px-5 py-4">
                      {item.variant?.unitValue || "-"}{" "}
                      {item.variant?.unit || ""}
                    </td>

                    {/* Available Stock */}
                    <td className="whitespace-nowrap px-5 py-4 font-semibold">
                      {item.availableQuantity ?? 0}
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.availableQuantity <= 0
                            ? "bg-red-100 text-red-700"
                            : item.availableQuantity <= item.reorderLevel
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.availableQuantity <= 0
                          ? "Out of Stock"
                          : item.availableQuantity <= item.reorderLevel
                          ? "Low Stock"
                          : item.status === "active"
                          ? "In Stock"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <button
                        type="button"
                        className="font-semibold text-[#087F95] hover:underline"
                      >
                        View
                      </button>
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
