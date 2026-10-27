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
      <div className="min-h-screen bg-[#F0FAFC] p-6">
        <p className="text-[#627D98]">
          Loading brand details...
        </p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-[#F0FAFC] p-4 sm:p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#D9E8EF] bg-white p-6 shadow-sm">
          <p className="text-[#102A43]">
            Brand not found.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/brand")}
            className="mt-4 rounded-lg bg-[#087F95] px-4 py-2 text-white transition hover:bg-[#066779]"
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
    <div className="min-h-screen bg-[#F0FAFC] p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm sm:p-6">

        {/* HEADER */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
              <FiTag size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#102A43]">
                Brand Details
              </h2>

              <p className="mt-1 text-sm text-[#627D98]">
                Complete information about this brand
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/brand")}
            className="flex items-center justify-center gap-2 self-start rounded-lg bg-[#087F95] px-4 py-2 text-white transition hover:bg-[#066779] sm:self-auto"
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
              className="h-28 w-28 rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] object-contain p-2"
            />
          </div>
        )}

        {/* BRAND DETAILS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] p-4 transition hover:border-[#22B8CF]"
            >
              <p className="text-sm text-[#627D98]">
                {label}
              </p>

              <p className="mt-1  font-semibold text-[#102A43]">
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