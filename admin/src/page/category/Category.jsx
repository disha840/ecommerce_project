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
import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate = useNavigate();

  const [createcategory, setCreateCategory] = useState(false);
  const [deleteCat, setDelete] = useState(false);
  const [data, setData] = useState([]);
  const [catId, setCatid] = useState(null);
  const [search, setSearch] = useState("");
  const [editCat, setEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  // GET ALL CATEGORIES
  async function getdata() {
    try {
      setLoading(true);
      const response = await api.get("/category/showcategories");
      setData(response.data.category || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getdata();
  }, []);

  // SEARCH CATEGORIES
  async function SearchCategory(searchvalue = "") {
    try {
      const response = await api.get(
        `/category/searched?search=${encodeURIComponent(searchvalue)}`
      );
      setData(response.data.category || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        SearchCategory(search);
      } else {
        getdata();
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
        await getdata();
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

  return (
    <>
      {createcategory && (
        <AddCategory
          onClose={() => setCreateCategory(false)}
          getdata={getdata}
        />
      )}

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

      {deleteCat && (
        <DeleteCategoryModal
          catId={catId}
          onClose={() => {
            setCatid(null);
            setDelete(false);
          }}
          onDeleted={async () => {
            if (search.trim()) {
              await SearchCategory(search);
            } else {
              await getdata();
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
              {data.length}
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

          <button
            type="button"
            onClick={() => setCreateCategory(true)}
            className="shrink-0 rounded-xl bg-[#087F95] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#066779]"
          >
            + Add Category
          </button>

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
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center text-[#627D98]"
                    >
                      Loading categories...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
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
                      <td className="whitespace-nowrap px-5 py-5">
                        {index + 1}
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 font-medium text-[#102A43]">
                        {item.name}
                      </td>

                      <td className="px-5 py-5 text-[#627D98]">
                        {item.description || "—"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item._id)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            item.status === "ACTIVE"
                              ? "bg-[#D7F2F6] text-[#087F95] hover:bg-[#BCEAF0]"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          }`}
                        >
                          {item.status}
                        </button>
                      </td>

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

                      <td className="whitespace-nowrap px-5 py-5">
                        <div className="flex justify-center gap-2">

                          <button
                            type="button"
                            title="View"
                            onClick={() => handleView(item._id)}
                            className="rounded-lg bg-[#D7F2F6] px-3 py-2 text-[#087F95] transition hover:bg-[#BCEAF0]"
                          >
                            <FiEye size={17} />
                          </button>

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

export default Category;
