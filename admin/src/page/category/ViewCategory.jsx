import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";

function ViewCategory() {
  const [category, setCategory] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await api.get(`/category/viewcategory/${id}`);
        setCategory(response.data.category);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (id) {
      getCategory();
    }
  }, [id]);

  if (!category) {
    return (
      <div className="min-h-screen bg-[#F0FAFC] p-6">
        <p className="text-[#627D98]">
          Loading category details...
        </p>
      </div>
    );
  }

  const details = [
    ["Category Name", category.name],
    ["Status", category.status],
    ["Description", category.description],
    [
      "Created At",
      category.createdAt
        ? new Date(category.createdAt).toLocaleString()
        : "N/A",
    ],
    [
      "Updated At",
      category.updatedAt
        ? new Date(category.updatedAt).toLocaleString()
        : "N/A",
    ],
  ];

  function backToCategories() {
    navigate("/admin/category");
  }

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-4 text-[#102A43] sm:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm sm:p-7">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#102A43]">
              Category Details
            </h2>

            <p className="mt-1 text-sm text-[#627D98]">
              Complete information about this category
            </p>
          </div>

          <button
            type="button"
            onClick={() => backToCategories()}
            className="rounded-xl bg-[#087F95] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#066779]"
          >
            Back
          </button>
        </div>

        {/* CATEGORY IMAGE */}
        {category.image && (
          <div className="mb-6">
            <img
              src={
                category.image.startsWith("http")
                  ? category.image
                  : `http://localhost:5000${category.image}`
              }
              alt="Category"
              className="h-28 w-28 rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] object-cover"
            />
          </div>
        )}

        {/* CATEGORY DETAILS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div
              key={label}
              className={`rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] p-4 transition hover:border-[#22B8CF] ${
                label === "Description" ? "sm:col-span-2" : ""
              }`}
            >
              <p className="text-sm font-medium text-[#627D98]">
                {label}
              </p>

              <p className="mt-2  font-semibold text-[#102A43]">
                {value ?? "N/A"}
              </p>

              {label === "Status" && (
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    value === "ACTIVE"
                      ? "bg-[#D7F2F6] text-[#087F95]"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {value ?? "N/A"}
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ViewCategory;
