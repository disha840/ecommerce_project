import { useEffect, useState } from "react";
import api from "../../api";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import AddSubcategory from "../../components/Subcategory/AddSubcategory";
import { useNavigate } from "react-router-dom";
import DeleteSubcategoryModal from "../../components/Subcategory/DeleteSubCategory";

const Subcategory = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [edit, setshowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // GET ALL SUBCATEGORIES
  async function getdata() {
    try {
      const response = await api.get(
        "/subcategory/showsubcategories"
      );

      setData(
        response.data.subcategory ||
          response.data.subcategories ||
          response.data.data ||
          []
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError("Failed to load subcategories");
    }
  }

  useEffect(() => {
    getdata();
  }, []);

  // SEARCH SUBCATEGORIES
  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // VIEW SUBCATEGORY
  function viewHandler(id) {
    navigate(`/admin/viewsubcategory/${id}`);
  }

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-4 text-[#102A43] sm:p-6">

      {/* MODALS */}
      {showModal && (
        <AddSubcategory
          onClose={() => {
            setShowModal(false);
          }}
          getdata={getdata}
        />
      )}

      {deleting && (
        <DeleteSubcategoryModal
          onClose={() => {
            setDeleting(false);
          }}
          subId={deleteId}
          onDeleted={() => getdata()}
        />
      )}

      {edit && (
        <AddSubcategory
          onClose={() => setshowEdit(false)}
          getdata={getdata}
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
            {data.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#627D98]">
            Active Subcategories
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#087F95]">
            {data.filter(
              (item) =>
                item.status?.toLowerCase() === "active"
            ).length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#627D98]">
            Inactive Subcategories
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

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="shrink-0 rounded-xl bg-[#087F95] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#066779]"
        >
          <FiPlus className="mr-2 inline" size={16} />
          Add Subcategory
        </button>

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
              {filteredData.length === 0 ? (
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
                      {index + 1}
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

                    <td className="whitespace-nowrap px-5 py-5">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          item.status?.toLowerCase() === "active"
                            ? "bg-[#D7F2F6] text-[#087F95]"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status || "-"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-5 text-[#627D98]">
                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleDateString("en-GB")
                        : "-"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-5">
                      <div className="flex justify-center gap-2">

                        <button
                          type="button"
                          className="rounded-lg bg-[#D7F2F6] px-3 py-2 text-[#087F95] transition hover:bg-[#BCEAF0]"
                          title="View"
                          onClick={() => viewHandler(item._id)}
                        >
                          <FiEye size={17} />
                        </button>

                        <button
                          type="button"
                          className="rounded-lg bg-[#EAF7FA] px-3 py-2 text-[#102A43] transition hover:bg-[#D7F2F6]"
                          title="Edit"
                          onClick={() => {
                            setshowEdit(true);
                            setEditData(item);
                          }}
                        >
                          <FiEdit2 size={17} />
                        </button>

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

export default Subcategory;