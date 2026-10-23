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
    return <p className="p-6 text-[#A17B86]">Loading category details...</p>;
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
    <div className="min-h-screen bg-[#FFF9F6] p-6">
      <div className="mx-auto max-w-4xl rounded-xl border border-[#EBD9D9] bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#713F50]">
              Category Details
            </h2>
            <p className="mt-1 text-sm text-[#A17B86]">
              Complete information about this category
            </p>
          </div>

          <button
            onClick={() => backToCategories()}
            className="rounded-lg bg-[#96566A] px-4 py-2 text-white hover:bg-[#713F50] transition"
          >
            Back
          </button>
        </div>

        {category.image && (
          <div className="mb-6">
            <img
              src={
                category.image.startsWith("http")
                  ? category.image
                  : `http://localhost:5000${category.image}`
              }
              alt="Category"
              className="h-24 w-24 rounded-lg object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div
              key={label}
              className={`rounded-lg border border-[#EBD9D9] p-4 ${
                label === "Description" ? "sm:col-span-2" : ""
              }`}
            >
              <p className="text-sm text-[#A17B86]">{label}</p>
              <p className="mt-1 font-semibold text-[#713F50]">
                {value ?? "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewCategory;