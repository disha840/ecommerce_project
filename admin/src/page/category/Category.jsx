
import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";
import AddCategory from "../../components/Category/AddCategory";
import DeleteCategoryModal from "../../components/Category/DelateCategory";
import api from "../../api";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Category = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const permissions = user?.permissions || [];

  const [createcategory, setCreateCategory] = useState(false);
  const [deleteCat, setDelete] = useState(false);
  const [data, setData] = useState([]);
  const [catId, setCatid] = useState(null);
  const [search, setSearch] = useState("");
  const [editCat, setEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  const limit = 5;

  // GET ALL CATEGORIES WITH PAGINATION
  async function getdata(page = 1) {
    try {
      const response = await api.get(
        `/category/showcategories?page=${page}&limit=${limit}`
      );

      setData(response.data.category || []);
      setCurrentPage(Number(response.data.currentPage) || page);
      setTotalPages(Number(response.data.totalPages) || 1);
      setTotalCategories(Number(response.data.totalCategories) || 0);

    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Failed to fetch categories");
    }
  }

  // INITIAL FETCH
  useEffect(() => {
    getdata(1);
  }, []);

  // SEARCH CATEGORIES
  async function SearchCategory(searchvalue = "") {
    try {
      const response = await api.get(
        `/category/searched?search=${encodeURIComponent(searchvalue)}`
      );

      const categories = response.data.category || [];

      setData(categories);
      setTotalCategories(categories.length);
      setCurrentPage(1);
      setTotalPages(1);

    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Failed to search categories");
    }
  }

  // SEARCH DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        SearchCategory(search);
      } else {
        getdata(1);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // VIEW CATEGORY
  function handleView(id) {
    navigate(`/admin/viewcategory/${id}`);
  }

  // TOGGLE STATUS
  async function handleStatusChange(id) {
    try {
      await api.put(`/category/toggle-status/${id}`);

      toast.success("Category status updated");

      if (search.trim()) {
        await SearchCategory(search);
      } else {
        await getdata(currentPage);
      }

    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Failed to update status");
    }
  }

  // STATUS COUNTS
  const activeCategories = data.filter(
    (cat) => cat.status === "ACTIVE"
  ).length;

  const inactiveCategories = data.filter(
    (cat) => cat.status === "INACTIVE"
  ).length;

  // PAGE ACCESS
  if (
    !user?.permissions?.some((permission) =>
      permission.includes("categories")
    )
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <>
      {/* ADD CATEGORY */}
      {createcategory && (
        <AddCategory
          onClose={() => setCreateCategory(false)}
          getdata={getdata}
        />
      )}

      {/* EDIT CATEGORY */}
      {editCat && (
        <AddCategory
          onClose={() => {
            setEdit(false);
            setEditData(null);
          }}
          getdata={getdata}
          editData={editData}
        />
      )}

      {/* DELETE CATEGORY */}
      {deleteCat && (
        <DeleteCategoryModal
          catId={catId}
          onClose={() => {
            setCatid(null);
            setDelete(false);
          }}
          onDeleted={async () => {
            setDelete(false);
            setCatid(null);

            if (search.trim()) {
              await SearchCategory(search);
            } else {
              const pageToLoad =
                data.length === 1 && currentPage > 1
                  ? currentPage - 1
                  : currentPage;

              await getdata(pageToLoad);
            }
          }}
        />
      )}

      <div className="min-h-screen bg-[#F0FAFC] p-4 text-[#102A43] sm:p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Categories
          </h1>

          <p className="mt-1 text-sm text-[#627D98]">
            Manage all your product categories
          </p>
        </div>

        {/* STATISTICS */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">
              Total Categories
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#102A43]">
              {totalCategories}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">
              Active Categories
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#087F95]">
              {activeCategories}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#627D98]">
              Inactive Categories
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {inactiveCategories}
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
              placeholder="Search category by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] py-3 pl-10 pr-4 text-sm text-[#102A43] outline-none placeholder:text-[#829AB1] focus:border-[#22B8CF] focus:ring-2 focus:ring-[#D7F2F6]"
            />
          </div>

          {permissions.includes("categories:create") && (
            <button
              type="button"
              onClick={() => setCreateCategory(true)}
              className="shrink-0 rounded-xl bg-[#087F95] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#066779]"
            >
              + Add Category
            </button>
          )}

        </div>

        {/* CATEGORY TABLE */}
        <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">

          <div className="border-b border-[#D9E8EF] p-5">
            <h2 className="text-lg font-semibold text-[#102A43]">
              All Categories
            </h2>

            <p className="mt-1 text-sm text-[#627D98]">
              List of all product categories
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-[#EAF7FA] text-[#102A43]">
                <tr>
                  <th className="whitespace-nowrap px-5 py-4">S.No</th>
                  <th className="whitespace-nowrap px-5 py-4">Category Name</th>
                  <th className="whitespace-nowrap px-5 py-4">Description</th>
                  <th className="whitespace-nowrap px-5 py-4">Status</th>
                  <th className="whitespace-nowrap px-5 py-4">Created At</th>
                  <th className="whitespace-nowrap px-5 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center text-[#627D98]"
                    >
                      {search
                        ? "No matching categories found"
                        : "No categories found"}
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-t border-[#EAF2F5] transition hover:bg-[#F4FBFC]"
                    >
                      {/* SERIAL NUMBER */}
                      <td className="whitespace-nowrap px-5 py-5">
                        {search.trim()
                          ? index + 1
                          : (currentPage - 1) * limit + index + 1}
                      </td>

                      {/* CATEGORY NAME */}
                      <td className="whitespace-nowrap px-5 py-5 font-medium text-[#102A43]">
                        {item.name}
                      </td>

                      {/* DESCRIPTION */}
                      <td className="px-5 py-5 text-[#627D98]">
                        {item.description || "—"}
                      </td>

                      {/* STATUS */}
                      <td className="whitespace-nowrap px-5 py-5">
                        {permissions.includes("categories:update") ? (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item._id)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                              item.status === "ACTIVE"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                            }`}
                          >
                            {item.status}
                          </button>
                        ) : (
                          <span>{item.status}</span>
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

                          {permissions.includes("categories:read") && (
                            <button
                              type="button"
                              title="View"
                              onClick={() => handleView(item._id)}
                              className="rounded-lg bg-[#D7F2F6] px-3 py-2 text-[#087F95] transition hover:bg-[#BCEAF0]"
                            >
                              <FiEye size={17} />
                            </button>
                          )}

                          {permissions.includes("categories:update") && (
                            <button
                              type="button"
                              title="Edit"
                              onClick={() => {
                                setEditData(item);
                                setEdit(true);
                              }}
                              className="rounded-lg bg-[#EAF7FA] px-3 py-2 text-[#102A43] transition hover:bg-[#D7F2F6]"
                            >
                              <FiEdit2 size={17} />
                            </button>
                          )}

                          {permissions.includes("categories:delete") && (
                            <button
                              type="button"
                              title="Delete"
                              onClick={() => {
                                setCatid(item._id);
                                setDelete(true);
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

          {/* PAGINATION */}
          {!search.trim() && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-[#D9E8EF] px-5 py-4 sm:flex-row">

              <p className="text-sm text-[#627D98]">
                Showing{" "}
                {data.length > 0
                  ? (currentPage - 1) * limit + 1
                  : 0}
                {" - "}
                {(currentPage - 1) * limit + data.length}
                {" of "}
                {totalCategories} categories
              </p>

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  onClick={() => getdata(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="rounded-lg border border-[#D9E8EF] bg-white px-4 py-2 text-sm font-medium text-[#102A43] transition hover:bg-[#EAF7FA] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm font-medium text-[#102A43]">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => getdata(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="rounded-lg border border-[#D9E8EF] bg-white px-4 py-2 text-sm font-medium text-[#102A43] transition hover:bg-[#EAF7FA] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Category;
