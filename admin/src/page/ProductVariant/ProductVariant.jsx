

import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import AddVariant from "../../components/ProductVariant/AddVariant";
import api from "../../api";
import DeleteVariantModal from "../../components/ProductVariant/DeleteVariant";

function ProductVariant() {
  const [showModal, setShowModal] = useState(false);
  const [variants, setVariants] = useState([]);
  const [deletemodal,setShowDelete]=useState(false);
  const [deleteId,setDeleteId]=useState(null)

  const getProductVariants = async () => {
    try {
      const response = await api.get("/productvariant/getproductvariants");
      console.log(response);
      setVariants(response.data.variants);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductVariants();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-6 text-[#102A43]">
      {showModal && (
        <AddVariant
          onClose={() => {
            setShowModal(false);
            getProductVariants();
          }}
        />
      )}
      {deletemodal&& <DeleteVariantModal variantId={deleteId} onClose={()=> setShowDelete(false)}  onDeleted={getProductVariants}/>}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#102A43]">
          Product Variants
        </h1>

        <p className="mt-1 text-sm text-[#627D98]">
          Manage your product variants.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Variants */}
        <div className="rounded-xl border border-[#D9E8EF] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">
                Total Variants
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {variants.length}
              </h2>
            </div>

            <div className="rounded-lg bg-[#D7F2F6] p-3 text-[#087F95]">
              <FiPackage size={22} />
            </div>
          </div>
        </div>

        {/* Active Variants */}
        <div className="rounded-xl border border-[#D9E8EF] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">
                Active Variants
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#087F95]">
                {
                  variants.filter(
                    (variant) => variant.status === "ACTIVE"
                  ).length
                }
              </h2>
            </div>

            <div className="rounded-lg bg-[#D7F2F6] p-3 text-[#087F95]">
              <FiTag size={22} />
            </div>
          </div>
        </div>

        {/* Total Selling Price */}
        <div className="rounded-xl border border-[#D9E8EF] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">
                Total Selling Price
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                ₹
                {variants.reduce(
                  (total, variant) =>
                    total + Number(variant.sellingPrice || 0),
                  0
                )}
              </h2>
            </div>

            <div className="rounded-lg bg-[#D7F2F6] p-3 text-[#087F95]">
              <FiDollarSign size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Add Variant */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#D9E8EF] bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:flex-1">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#627D98]"
            size={18}
          />

          <input
            type="text"
            placeholder="Search variants..."
            className="w-full rounded-lg border border-[#D9E8EF] bg-[#F8FCFD] py-3 pl-10 pr-4 text-sm text-[#102A43] outline-none placeholder:text-[#627D98] focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#087F95] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#066779]"
        >
          <FiPlus size={18} />
          Add Variant
        </button>
      </div>

      {/* Variants Table */}
      <div className="overflow-hidden rounded-xl border border-[#D9E8EF] bg-white">
        <div className="border-b border-[#D9E8EF] px-5 py-4">
          <h2 className="font-semibold text-[#102A43]">
            All Product Variants
          </h2>

          <p className="mt-1 text-xs text-[#627D98]">
            Product variant details and pricing
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#EAF7FA] text-[#102A43]">
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
              {variants.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-3 rounded-full bg-[#D7F2F6] p-4 text-[#087F95]">
                        <FiPackage size={28} />
                      </div>

                      <h3 className="font-semibold text-[#102A43]">
                        No variants to display
                      </h3>

                      <p className="mt-1 text-sm text-[#627D98]">
                        Product variants will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                variants.map((variant) => (
                  <tr
                    key={variant._id}
                    className="border-t border-[#D9E8EF] transition hover:bg-[#F8FCFD]"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-[#102A43]">
                      {variant.name}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-[#627D98]">
                      {variant.product?.name || "N/A"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-[#627D98]">
                      {variant.sku || "N/A"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-[#627D98]">
                      {variant.unitValue} {variant.unit}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-[#102A43]">
                      ₹{variant.mrp}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#087F95]">
                      ₹{variant.sellingPrice}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          variant.status === "ACTIVE"
                            ? "bg-[#D7F2F6] text-[#087F95]"
                            : "bg-[#EAF7FA] text-[#627D98]"
                        }`}
                      >
                        {variant.status}
                      </span>
                    </td>

                    {/* Action Icons */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="View Variant"
                          className="rounded-lg border border-[#D9E8EF] p-2 text-[#087F95] transition hover:bg-[#D7F2F6]"
                        >
                          <FiEye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Edit Variant"
                          className="rounded-lg border border-[#D9E8EF] p-2 text-[#087F95] transition hover:bg-[#D7F2F6]"
                        >
                          <FiEdit2 size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete Variant"
                          className="rounded-lg border border-[#D9E8EF] p-2 text-[#627D98] transition hover:bg-[#EAF7FA] hover:text-[#102A43]" onClick={()=>{
                            setShowDelete(true)
                            setDeleteId(variant._id)

                          }}
                        >
                          <FiTrash2 size={17} />
                        </button>
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
}

export default ProductVariant;