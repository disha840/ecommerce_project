
import React from "react";

const Inventory = () => {
  return (
    <div className="min-h-screen bg-[#F0FAFC] p-6 text-[#102A43]">

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
          { title: "Total Inventory", count: 0 },
          { title: "In Stock", count: 0 },
          { title: "Low Stock", count: 0 },
          { title: "Out of Stock", count: 0 },
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

      {/* Search */}
      <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#D9E8EF] bg-white p-4 shadow-sm sm:flex-row sm:items-center">

        <input
          type="text"
          placeholder="Search product by name..."
          className="w-full max-w-md rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#D7F2F6]"
        />

      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">

        <div className="border-b border-[#D9E8EF] p-5">
          <h2 className="text-lg font-semibold">
            All Inventory
          </h2>

          <p className="mt-1 text-sm text-[#627D98]">
            0 product(s) found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">

            <thead className="bg-[#EAF7FA]">
              <tr>
                {[
                  "Product",
                  "Category",
                  "Brand",
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
              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-16 text-center"
                >
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
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

export default Inventory;

