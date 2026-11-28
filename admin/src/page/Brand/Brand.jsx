
import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";
import AddBrand from "../../components/Brand/AddBrand";
import api from "../../api";
import DeleteBrandModal from "../../components/Brand/DeleteBrand";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Brand = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const permissions = user?.permissions || [];

  const [createBrand, setCreateBrand] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // GET ALL BRANDS
  async function getdata() {
    try {
    

      const response = await api.get("/brands/showbrand");
      setData(response.data.brand || []);

    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Failed to fetch brands");
    } 
  }

  useEffect(() => {
    getdata();
  }, []);

  // CHANGE BRAND STATUS
  async function handleToggleStatus(id) {
    try {
      await api.patch(`/brands/change-status/${id}`);

      toast.success("Brand status updated successfully");

      await getdata();

    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to update brand status"
      );
    }
  }

  // VIEW BRAND
  function handleView(id) {
    navigate(`/admin/viewbrand/${id}`);
  }

  // SEARCH BRANDS
  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // STATUS COUNTS
  const activeBrands = data.filter(
    (item) => item.status === "Active"
  ).length;

  const inactiveBrands = data.filter(
    (item) => item.status !== "Active"
  ).length;

  // PAGE ACCESS
  if (!permissions.some((permission) => permission.includes("brand"))) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <>
      {/* ADD BRAND */}
      {createBrand && permissions.includes("brand:create") && (
        <AddBrand
          onClose={() => {
            setCreateBrand(false);
            setEditData(null);
          }}
          editData={editData}
          getdata={getdata}
        />
      )}

      {/* DELETE BRAND */}
      {showDelete && permissions.includes("brand:delete") && (
        <DeleteBrandModal
          brandId={deleteId}
          onClose={() => {
            setDeleteId(null);
            setShowDelete(false);
          }}
          onDeleted={async () => {
            await getdata();
          }}
        />
      )}

      <div className="min-h-screen bg-[#F0FAFC] p-4 text-[#102A43] sm:p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Brands
          </h1>

          <p className="mt-1 text-sm text-[#627D98]">
            Manage all your product brands
          </p>
        </div>

        {/* STATISTICS */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">
              Total Brands
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#102A43]">
              {data.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">
              Active Brands
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#087F95]">
              {activeBrands}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">
              Inactive Brands
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {inactiveBrands}
            </h2>
          </div>

        </div>

        {/* SEARCH + ADD */}
        <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#D9E8EF] bg-white p-4 shadow-sm sm:flex-row sm:items-center">

          <div className="relative w-full max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#087F95]"
              size={18}
            />

            <input
              type="text"
              placeholder="Search brand by name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] py-3 pl-10 pr-4 text-sm text-[#102A43] outline-none placeholder:text-[#829AB1] focus:border-[#22B8CF] focus:ring-2 focus:ring-[#D7F2F6]"
            />
          </div>

          {permissions.includes("brand:create") && (
            <button
              type="button"
              onClick={() => {
                setEditData(null);
                setCreateBrand(true);
              }}
              className="shrink-0 rounded-xl bg-[#087F95] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#066779]"
            >
              + Add Brand
            </button>
          )}

        </div>

        {/* BRAND TABLE */}
        <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">

          <div className="border-b border-[#D9E8EF] p-5">
            <h2 className="text-lg font-semibold text-[#102A43]">
              All Brands
            </h2>

            <p className="mt-1 text-sm text-[#627D98]">
              List of all product brands
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-[#EAF7FA] text-[#102A43]">
                <tr>
                  <th className="whitespace-nowrap px-5 py-4">
                    S.No
                  </th>

                  <th className="whitespace-nowrap px-5 py-4">
                    Brand Name
                  </th>

                  <th className="whitespace-nowrap px-5 py-4">
                    Description
                  </th>

                  <th className="whitespace-nowrap px-5 py-4">
                    Status
                  </th>

                  <th className="whitespace-nowrap px-5 py-4">
                    Created At
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center text-[#627D98]"
                    >
                      Loading brands...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center text-[#627D98]"
                    >
                      {search
                        ? "No brands found matching your search."
                        : "No brands available."}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-t border-[#EAF2F5] transition hover:bg-[#F4FBFC]"
                    >
                      <td className="whitespace-nowrap px-5 py-5">
                        {index + 1}
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 font-medium text-[#102A43]">
                        {item.name}
                      </td>

                      <td className="px-5 py-5 text-[#627D98]">
                        {item.description || "—"}
                      </td>

                      {/* STATUS TOGGLE */}
                      <td className="whitespace-nowrap px-5 py-5">

                        {permissions.includes("brand:update") ? (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item._id)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                              item.status === "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                            }`}
                            title="Click to change status"
                          >
                            {item.status}
                          </button>
                        ) : (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              item.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        )}

                      </td>

                      {/* CREATED AT */}
                      <td className="whitespace-nowrap px-5 py-5 text-[#627D98]">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </td>

                      {/* ACTIONS */}
                      <td className="whitespace-nowrap px-5 py-5">
                        <div className="flex justify-center gap-2">

                          {/* VIEW */}
                          {permissions.includes("brand:read") && (
                            <button
                              type="button"
                              title="View"
                              onClick={() => handleView(item._id)}
                              className="rounded-lg bg-[#D7F2F6] px-3 py-2 text-[#087F95] transition hover:bg-[#BCEAF0]"
                            >
                              <FiEye size={17} />
                            </button>
                          )}

                          {/* EDIT */}
                          {permissions.includes("brand:update") && (
                            <button
                              type="button"
                              title="Edit"
                              onClick={() => {
                                setEditData(item);
                                setCreateBrand(true);
                              }}
                              className="rounded-lg bg-[#EAF7FA] px-3 py-2 text-[#102A43] transition hover:bg-[#D7F2F6]"
                            >
                              <FiEdit2 size={17} />
                            </button>
                          )}

                          {/* DELETE */}
                          {permissions.includes("brand:delete") && (
                            <button
                              type="button"
                              title="Delete"
                              onClick={() => {
                                setDeleteId(item._id);
                                setShowDelete(true);
                              }}
                              className="rounded-lg bg-[#EAF7FA] px-3 py-2 text-[#102A43] transition hover:bg-red-100 hover:text-red-600"
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
    </>
  );
};

export default Brand;
