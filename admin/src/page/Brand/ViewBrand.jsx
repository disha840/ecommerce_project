import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiTag } from "react-icons/fi";

function ViewBrand() {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getBrand = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/brands/viewbrand/${id}`);
        setBrand(response.data.brand);
      } catch (error) {
        console.log("Get brand error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getBrand();
    }
  }, [id]);

  if (loading) {
    return (
      <p className="p-6 text-[#A17B86]">
        Loading brand details...
      </p>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-[#FFF9F6] p-6">
        <div className="mx-auto max-w-4xl rounded-xl border border-[#EBD9D9] bg-white p-6">
          <p className="text-[#713F50]">Brand not found.</p>

          <button
            type="button"
            onClick={() => navigate("/admin/brand")}
            className="mt-4 rounded-lg bg-[#96566A] px-4 py-2 text-white hover:bg-[#713F50]"
          >
            Back to Brands
          </button>
        </div>
      </div>
    );
  }

  const details = [
    ["Brand Name", brand.name],
    ["Slug", brand.slug],
    ["Description", brand.description],
    ["Status", brand.status],
    [
      "Created At",
      brand.createdAt
        ? new Date(brand.createdAt).toLocaleString()
        : "N/A",
    ],
    [
      "Updated At",
      brand.updatedAt
        ? new Date(brand.updatedAt).toLocaleString()
        : "N/A",
    ],
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F6] p-6">
      <div className="mx-auto max-w-4xl rounded-xl border border-[#EBD9D9] bg-white p-6 shadow-md">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0DDE1] text-[#96566A]">
              <FiTag size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#713F50]">
                Brand Details
              </h2>

              <p className="mt-1 text-sm text-[#A17B86]">
                Complete information about this brand
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/brand")}
            className="flex items-center gap-2 rounded-lg bg-[#96566A] px-4 py-2 text-white transition hover:bg-[#713F50]"
          >
            <FiArrowLeft size={18} />
            Back
          </button>
        </div>

        {/* BRAND IMAGE */}
        {brand.image && (
          <div className="mb-6">
            <img
              src={brand.image}
              alt={brand.name || "Brand"}
              className="h-28 w-28 rounded-xl border border-[#EBD9D9] bg-white object-contain p-2"
            />
          </div>
        )}

        {/* BRAND DETAILS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-[#EBD9D9] p-4"
            >
              <p className="text-sm text-[#A17B86]">{label}</p>

              <p className="mt-1  font-semibold text-[#713F50]">
                {value || "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewBrand;