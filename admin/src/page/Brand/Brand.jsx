
import React, { useState, useEffect } from "react";
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

  async function getdata() {
    try {
      const response = await api.get("/brands/showbrand");
      setData(response.data.brand);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getdata();
  }, []);

  // Change Brand Status
  async function handleToggleStatus(id) {
    try {
      await api.patch(`/brands/change-status/${id}`);
      getdata();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }

  function handleView(id) {
    navigate(`/admin/viewbrand/${id}`);
  }

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const activeBrands = data.filter(
    (item) => item.status === "Active"
  ).length;

  const inactiveBrands = data.filter(
    (item) => item.status !== "Active"
  ).length;

  if (!permissions.some((permission) => permission.includes("brand"))) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <>
      {createBrand && permissions.includes("brand:create") && (
        <AddBrand
          onClose={() => setCreateBrand(false)}
          editData={editData}
          getdata={getdata}
        />
      )}

      {showDelete && permissions.includes("brand:delete") && (
        <DeleteBrandModal
          brandId={deleteId}
          onClose={() => {
            setDeleteId(null);
            setShowDelete(false);
          }}
          onDeleted={getdata}
        />
      )}

      <div className="min-h-screen bg-[#F0FAFC] p-4 text-[#102A43] sm:p-6">

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Brands</h1>
          <p className="mt-1 text-sm text-[#627D98]">
            Manage all your product brands
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">Total Brands</p>
            <h2 className="mt-2 text-3xl font-bold">{data.length}</h2>
          </div>

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">Active Brands</p>
            <h2 className="mt-2 text-3xl font-bold text-[#087F95]">
              {activeBrands}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">Inactive Brands</p>
            <h2 className="mt-2 text-3xl font-bold text-[#627D98]">
              {inactiveBrands}
            </h2>
          </div>
        </div>

        <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#D9E8EF] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search brand by name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full max-w-md rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] px-4 py-3 text-sm text-[#102A43] placeholder:text-[#627D98] outline-none focus:border-[#22B8CF] focus:ring-2 focus:ring-[#22B8CF]/20"
          />

          {permissions.includes("brand:create") && (
            <button
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

        <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">
          <div className="border-b border-[#D9E8EF] p-5">
            <h2 className="text-lg font-semibold">All Brands</h2>
            <p className="mt-1 text-sm text-[#627D98]">
              List of all product brands
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#EAF7FA]">
                <tr>
                  <th className="px-5 py-4">S.No</th>
                  <th className="px-5 py-4">Brand Name</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created At</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-t border-[#D9E8EF] transition hover:bg-[#F0FAFC]"
                    >
                      <td className="px-5 py-5">{index + 1}</td>

                      <td className="px-5 py-5 font-medium">
                        {item.name}
                      </td>

                      <td className="px-5 py-5 text-[#627D98]">
                        {item.description || "—"}
                      </td>

                      {/* Status Toggle */}
                      <td className="px-5 py-5">
                        {permissions.includes("brand:update") ? (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item._id)}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer transition ${
                              item.status === "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                            title="Click to change status"
                          >
                            {item.status}
                          </button>
                        ) : (
                          <span
                            className={`inline-block rounded-full px-3 py-1.5 text-xs font-semibold ${
                              item.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-5 text-[#627D98]">
                        {new Date(item.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex justify-center gap-2">
                          {permissions.includes("brand:read") && (
                            <button
                              onClick={() => handleView(item._id)}
                              className="rounded-lg bg-[#D7F2F6] px-3 py-2 text-[#087F95] transition hover:bg-[#BDEAF0]"
                            >
                              View
                            </button>
                          )}

                          {permissions.includes("brand:update") && (
                            <button
                              onClick={() => {
                                setEditData(item);
                                setCreateBrand(true);
                              }}
                              className="rounded-lg bg-[#EAF7FA] px-3 py-2 text-[#102A43] transition hover:bg-[#D7F2F6]"
                            >
                              Edit
                            </button>
                          )}

                          {permissions.includes("brand:delete") && (
                            <button
                              onClick={() => {
                                setDeleteId(item._id);
                                setShowDelete(true);
                              }}
                              className="rounded-lg bg-[#EDF3F5] px-3 py-2 text-[#627D98] transition hover:bg-[#D9E8EF]"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
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
