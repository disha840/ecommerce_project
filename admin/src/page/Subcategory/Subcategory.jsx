
import { useEffect, useState } from "react";
import api from "../../api";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import AddSubcategory from "../../components/Subcategory/AddSubcategory";
import { useNavigate, Navigate } from "react-router-dom";
import DeleteSubcategoryModal from "../../components/Subcategory/DeleteSubCategory";
import { useSelector } from "react-redux";

const Subcategory = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const permissions = user?.permissions || [];

  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [edit, setshowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // PAGINATION STATES
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubcategories, setTotalSubcategories] = useState(0);
  const [loading, setLoading] = useState(false);

  // GET SUBCATEGORIES WITH PAGINATION
  async function getdata(pageNumber = page) {
    try {
      setLoading(true);

      const response = await api.get(
        "/subcategory/showsubcategories",
        {
          params: {
            page: pageNumber,
            limit: limit,
          },
        }
      );

      const subcategories = response.data.subcategory || [];

      setData(subcategories);

      setTotalSubcategories(
        response.data.pagination?.totalSubcategories || 0
      );

      setTotalPages(
        response.data.pagination?.totalPages || 1
      );

      setPage(pageNumber);
      setError("");
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError("Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getdata(1);
  }, []);

  // PREVIOUS PAGE
  function handlePrevious() {
    if (page > 1) {
      getdata(page - 1);
    }
  }

  // NEXT PAGE
  function handleNext() {
    if (page < totalPages) {
      getdata(page + 1);
    }
  }

  // CHANGE SUBCATEGORY STATUS
  async function handleToggleStatus(id) {
    try {
      await api.patch(`/subcategory/change-status/${id}`);
      getdata(page);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }

  // SEARCH SUBCATEGORIES
  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // VIEW SUBCATEGORY
  function viewHandler(id) {
    navigate(`/admin/viewsubcategory/${id}`);
  }

  // CLOSE EDIT MODAL
  function closeEditModal() {
    setshowEdit(false);
    setEditData(null);
  }

  // REFRESH AFTER DELETE
  function handleDeleted() {
    const nextPage =
      data.length === 1 && page > 1 ? page - 1 : page;

    setDeleting(false);
    setDeleteId(null);
    getdata(nextPage);
  }

  // PAGE ACCESS
  if (
    !user?.permissions?.some((permission) =>
      permission.includes("subcategories")
    )
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-4 text-[#102A43] sm:p-6">

      {/* ADD SUBCATEGORY MODAL */}
      {showModal && (
        <AddSubcategory
          onClose={() => setShowModal(false)}
          getdata={() => getdata(page)}
        />
      )}

      {/* DELETE SUBCATEGORY MODAL */}
      {deleting && (
        <DeleteSubcategoryModal
          onClose={() => {
            setDeleting(false);
            setDeleteId(null);
          }}
          subId={deleteId}
          onDeleted={handleDeleted}
        />
      )}

      {/* EDIT SUBCATEGORY MODAL */}
      {edit && (
        <AddSubcategory
          onClose={closeEditModal}
          getdata={() => getdata(page)}
          editData={editData}
        />
      )}

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#102A43]">
          Subcategories
        </h1>

        <p className="mt-1 text-sm text-[#627D98]">
          Manage all your product subcategories
        </p>
      </div>

      {/* STATISTICS */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#627D98]">
            Total Subcategories
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#102A43]">
            {totalSubcategories}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#627D98]">
            Active (Current Page)
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-700">
            {data.filter(
              (item) =>
                item.status?.toLowerCase() === "active"
            ).length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#627D98]">
            Inactive (Current Page)
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {data.filter(
              (item) =>
                item.status?.toLowerCase() !== "active"
            ).length}
          </h2>
        </div>

      </div>

      {/* SEARCH + ADD */}
      <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#D9E8EF] bg-white p-4 shadow-sm sm:flex-row sm:items-center">

        <div className="relative w-full max-w-md">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#087F95]"
            size={18}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subcategory by name..."
            className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] py-3 pl-11 pr-4 text-sm text-[#102A43] outline-none placeholder:text-[#829AB1] focus:border-[#22B8CF] focus:ring-2 focus:ring-[#D7F2F6]"
          />
        </div>

        {permissions.includes("subcategories:create") && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="shrink-0 rounded-xl bg-[#087F95] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#066779]"
          >
            <FiPlus className="mr-2 inline" size={16} />
            Add Subcategory
          </button>
        )}

      </div>

      {/* SUBCATEGORY TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">

        <div className="border-b border-[#D9E8EF] p-5">
          <h2 className="text-lg font-semibold text-[#102A43]">
            All Subcategories
          </h2>

          <p className="mt-1 text-sm text-[#627D98]">
            List of all product subcategories
          </p>
        </div>

        {error && (
          <p className="p-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">

            <thead className="bg-[#EAF7FA] text-[#102A43]">
              <tr>
                <th className="whitespace-nowrap px-5 py-4">S.No</th>
                <th className="whitespace-nowrap px-5 py-4">Subcategory Name</th>
                <th className="whitespace-nowrap px-5 py-4">Description</th>
                <th className="whitespace-nowrap px-5 py-4">Parent Category</th>
                <th className="whitespace-nowrap px-5 py-4">Status</th>
                <th className="whitespace-nowrap px-5 py-4">Created At</th>
                <th className="whitespace-nowrap px-5 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-[#627D98]">
                    Loading subcategories...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-[#627D98]"
                  >
                    {error
                      ? "Unable to load subcategories"
                      : "No subcategories to display"}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-t border-[#EAF2F5] transition hover:bg-[#F4FBFC]"
                  >
                    <td className="whitespace-nowrap px-5 py-5">
                      {(page - 1) * limit + index + 1}
                    </td>

                    <td className="whitespace-nowrap px-5 py-5 font-medium text-[#102A43]">
                      {item.name}
                    </td>

                    <td className="px-5 py-5 text-[#627D98]">
                      {item.description || "-"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-5 text-[#102A43]">
                      {item.parentCategory?.name || "-"}
                    </td>

                    {/* STATUS */}
                    <td className="whitespace-nowrap px-5 py-5">
                      {permissions.includes("subcategories:update") ? (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item._id)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer transition ${
                            item.status === "ACTIVE"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                          title="Click to change status"
                        >
                          {item.status || "-"}
                        </button>
                      ) : (
                        <span
                          className={`inline-block rounded-full px-3 py-1.5 text-xs font-semibold ${
                            item.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status || "-"}
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-5 text-[#627D98]">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-GB")
                        : "-"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-5">
                      <div className="flex justify-center gap-2">

                        {/* VIEW */}
                        {permissions.includes("subcategories:read") && (
                          <button
                            type="button"
                            className="rounded-lg bg-[#D7F2F6] px-3 py-2 text-[#087F95] transition hover:bg-[#BCEAF0]"
                            title="View"
                            onClick={() => viewHandler(item._id)}
                          >
                            <FiEye size={17} />
                          </button>
                        )}

                        {/* EDIT */}
                        {permissions.includes("subcategories:update") && (
                          <button
                            type="button"
                            className="rounded-lg bg-[#EAF7FA] px-3 py-2 text-[#102A43] transition hover:bg-[#D7F2F6]"
                            title="Edit"
                            onClick={() => {
                              setEditData(item);
                              setshowEdit(true);
                            }}
                          >
                            <FiEdit2 size={17} />
                          </button>
                        )}

                        {/* DELETE */}
                        {permissions.includes("subcategories:delete") && (
                          <button
                            type="button"
                            className="rounded-lg bg-[#EAF7FA] px-3 py-2 text-[#102A43] transition hover:bg-red-100 hover:text-red-600"
                            title="Delete"
                            onClick={() => {
                              setDeleteId(item._id);
                              setDeleting(true);
                            }}
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

        {/* PAGINATION */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#D9E8EF] bg-white px-5 py-4 sm:flex-row">

          <p className="text-sm text-[#627D98]">
            Showing {totalSubcategories === 0 ? 0 : (page - 1) * limit + 1}
            {" - "}
            {Math.min(page * limit, totalSubcategories)}
            {" of "}
            {totalSubcategories} subcategories
          </p>

          <div className="flex items-center gap-3">

            {/* PREVIOUS */}
            <button
              type="button"
              onClick={handlePrevious}
              disabled={page === 1 || loading}
              className="flex items-center justify-center rounded-lg border border-[#D9E8EF] bg-white p-2.5 text-[#087F95] transition hover:bg-[#EAF7FA] disabled:cursor-not-allowed disabled:opacity-40"
              title="Previous Page"
            >
              <FiChevronLeft size={20} />
            </button>

            <span className="text-sm font-medium text-[#102A43]">
              Page {page} of {totalPages}
            </span>

            {/* NEXT */}
            <button
              type="button"
              onClick={handleNext}
              disabled={page >= totalPages || loading}
              className="flex items-center justify-center rounded-lg border border-[#D9E8EF] bg-white p-2.5 text-[#087F95] transition hover:bg-[#EAF7FA] disabled:cursor-not-allowed disabled:opacity-40"
              title="Next Page"
            >
              <FiChevronRight size={20} />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Subcategory;
