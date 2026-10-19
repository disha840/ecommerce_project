
import React, { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiPackage,
  FiDollarSign,
  FiTag,
} from "react-icons/fi";
import AddVariant from "../../components/ProductVariant/AddVariant";

function ProductVariant() {
    const [showModal,setShowModal]=useState(false);
  return (
    <div className="min-h-screen bg-[#FFF9F6] p-6">
        {showModal && <AddVariant onClose={()=> setShowModal(false)}/>}
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#713F50]">
          Product Variants
        </h1>
        <p className="mt-1 text-sm text-[#A17B86]">
          Manage your product variants
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-[#EBD9D9] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A17B86]">Total Variants</p>
              <h2 className="mt-2 text-2xl font-bold text-[#713F50]">
                Total Variants
              </h2>
            </div>
            <div className="rounded-lg bg-[#F0DDE1] p-3 text-[#96566A]">
              <FiPackage size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#EBD9D9] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A17B86]">Active Variants</p>
              <h2 className="mt-2 text-2xl font-bold text-green-600">
                Active Variants
              </h2>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <FiTag size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#EBD9D9] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A17B86]">Selling Price</p>
              <h2 className="mt-2 text-2xl font-bold text-[#713F50]">
                Selling Price
              </h2>
            </div>
            <div className="rounded-lg bg-[#F0DDE1] p-3 text-[#96566A]">
              <FiDollarSign size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Add Variant */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#EBD9D9] bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:flex-1">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A17B86]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search variants..."
            className="w-full rounded-lg border border-[#EBD9D9] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#96566A]"
          />
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#96566A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#713F50]" onClick={()=> {
            setShowModal(true)
          }}
        >
          <FiPlus size={18} />
          Add Variant
        </button>
      </div>

      {/* Variants Table */}
      <div className="overflow-hidden rounded-xl border border-[#EBD9D9] bg-white">
        <div className="border-b border-[#EBD9D9] px-5 py-4">
          <h2 className="font-semibold text-[#713F50]">
            All Product Variants
          </h2>
          <p className="mt-1 text-xs text-[#A17B86]">
            Product variant details and pricing
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F0DDE1] text-[#713F50]">
              <tr>
                <th className="whitespace-nowrap px-5 py-4 font-semibold">
                  Variant
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-semibold">
                  Product
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-semibold">
                  SKU
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-semibold">
                  Unit
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-semibold">
                  MRP
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-semibold">
                  Selling Price
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-semibold">
                  Status
                </th>
                <th className="whitespace-nowrap px-5 py-4 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="8" className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 rounded-full bg-[#F0DDE1] p-4 text-[#96566A]">
                      <FiPackage size={28} />
                    </div>
                    <h3 className="font-semibold text-[#713F50]">
                      No variants to display
                    </h3>
                    <p className="mt-1 text-sm text-[#A17B86]">
                      Product variants will appear here.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
       
      </div>
    </div>
  );
}

export default ProductVariant;
