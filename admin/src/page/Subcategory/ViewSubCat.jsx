import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiImage,
  FiLayers,
  FiGrid,
  FiActivity,
  FiFileText,
} from "react-icons/fi";

const ViewSubcategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [subcategory, setSubcategory] = useState(null);

  console.log(subcategory);
  

  useEffect(() => {
    const getSubcategory = async () => {
      try {
        const response = await api.get(
          `/subcategory/viewsubcategory/${id}`
        );
        console.log(response)

        setSubcategory(response.data.subcategory);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      getSubcategory();
    }
  }, [id]);

  if (!subcategory) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F6] p-6">
        <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-[#EBD9D9] bg-white p-8 text-center shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#96566A]/20 border-t-[#96566A]" />
          <p className="mt-4 font-medium text-[#A17B86]">
            Loading subcategory details...
          </p>

          <button
            onClick={() => navigate("/admin/subcategory")}
            className="mt-6 rounded-lg bg-[#96566A] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#713F50] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#96566A] focus-visible:ring-offset-2"
          >
            Back to Subcategories
          </button>
        </div>
      </div>
    );
  }

  // ---- UI helpers (sirf design ke liye) ----
  const parentName =
    subcategory.parentCategory?.name ||
    subcategory.parentCategory ||
    "N/A";

  const isActive =
    String(subcategory.status || "").toLowerCase() === "active";

  const StatusBadge = ({ className = "" }) => (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
        isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      } ${className}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {subcategory.status || "N/A"}
    </span>
  );

  const InfoCard = ({ icon: Icon, label, children, className = "" }) => (
    <div
      className={`flex items-start gap-3 rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] p-4 transition hover:border-[#96566A]/40 hover:shadow-sm ${className}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#96566A] shadow-sm">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-[#A17B86]">{label}</p>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F6] p-4 text-[#713F50] sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="rounded-xl border border-[#EBD9D9] bg-white p-2.5 text-[#713F50] shadow-sm transition hover:bg-[#96566A] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#96566A]"
            >
              <FiArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Subcategory Details
              </h1>
              <p className="text-sm text-[#A17B86]">
                View complete subcategory information
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="hidden rounded-lg bg-[#96566A] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#713F50] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#96566A] focus-visible:ring-offset-2 sm:block"
          >
            Back
          </button>
        </div>

        {/* Details Card */}
        <div className="overflow-hidden rounded-2xl border border-[#EBD9D9] bg-white shadow-sm">
          {/* Top band: image + name + badges */}
          <div className="flex flex-col items-center gap-5 border-b border-[#EBD9D9] bg-[#96566A]/5 p-6 text-center sm:flex-row sm:text-left">
            {subcategory.image ? (
              <img
                src={subcategory.image}
                alt={subcategory.name}
                className="h-32 w-32 shrink-0 rounded-2xl border-4 border-white object-cover shadow-md"
              />
            ) : (
              <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[#96566A]/30 bg-white text-xs text-[#A17B86]">
                <FiImage size={26} />
                <span>No image available</span>
              </div>
            )}

            <div className="min-w-0">
              <h2 className=" text-2xl font-semibold">
                {subcategory.name || "N/A"}
              </h2>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#96566A] px-3 py-1 text-sm font-medium text-white">
                  <FiLayers size={13} />
                  {parentName}
                </span>
                <StatusBadge />
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <InfoCard icon={FiGrid} label="Subcategory Name">
              <p className="mt-1 font-semibold">
                {subcategory.name || "N/A"}
              </p>
            </InfoCard>

            <InfoCard icon={FiLayers} label="Parent Category">
              <p className="mt-1 font-semibold">{parentName}</p>
            </InfoCard>

            <InfoCard icon={FiActivity} label="Status">
              <StatusBadge className="mt-1" />
            </InfoCard>

            <InfoCard
              icon={FiFileText}
              label="Description"
              className="sm:col-span-2"
            >
              <p className="mt-1 max-w-prose leading-relaxed">
                {subcategory.description || "No description"}
              </p>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSubcategory;