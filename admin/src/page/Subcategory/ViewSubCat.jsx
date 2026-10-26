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

  useEffect(() => {
    const getSubcategory = async () => {
      try {
        const response = await api.get(
          `/subcategory/viewsubcategory/${id}`
        );

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
      <div className="flex min-h-screen items-center justify-center bg-[#F0FAFC] p-6">
        <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-[#D9E8EF] bg-white p-8 text-center shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#22B8CF]/20 border-t-[#087F95]" />

          <p className="mt-4 font-medium text-[#627D98]">
            Loading subcategory details...
          </p>

          <button
            onClick={() => navigate("/admin/subcategory")}
            className="mt-6 rounded-lg bg-[#087F95] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#066779] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22B8CF] focus-visible:ring-offset-2"
          >
            Back to Subcategories
          </button>
        </div>
      </div>
    );
  }

  const parentName =
    subcategory.parentCategory?.name ||
    subcategory.parentCategory ||
    "N/A";

  const isActive =
    String(subcategory.status || "").toLowerCase() === "active";

  const StatusBadge = ({ className = "" }) => (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
        isActive
          ? "bg-[#D7F2F6] text-[#087F95]"
          : "bg-gray-100 text-gray-600"
      } ${className}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isActive ? "bg-[#22B8CF]" : "bg-gray-400"
        }`}
      />
      {subcategory.status || "N/A"}
    </span>
  );

  const InfoCard = ({ icon: Icon, label, children, className = "" }) => (
    <div
      className={`flex items-start gap-3 rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] p-4 transition hover:border-[#22B8CF]/50 hover:shadow-sm ${className}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D7F2F6] text-[#087F95]">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-[#627D98]">{label}</p>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-4 text-[#102A43] sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="rounded-xl border border-[#D9E8EF] bg-white p-2.5 text-[#102A43] shadow-sm transition hover:bg-[#087F95] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22B8CF]"
            >
              <FiArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Subcategory Details
              </h1>

              <p className="text-sm text-[#627D98]">
                View complete subcategory information
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="hidden rounded-lg bg-[#087F95] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#066779] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22B8CF] focus-visible:ring-offset-2 sm:block"
          >
            Back
          </button>
        </div>

        {/* Details Card */}
        <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">
          {/* Image and basic details */}
          <div className="flex flex-col items-center gap-5 border-b border-[#D9E8EF] bg-[#EAF7FA] p-6 text-center sm:flex-row sm:text-left">
            {subcategory.image ? (
              <img
                src={subcategory.image}
                alt={subcategory.name || "Subcategory"}
                className="h-32 w-32 shrink-0 rounded-2xl border-4 border-white object-cover shadow-md"
              />
            ) : (
              <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[#22B8CF]/50 bg-white text-xs text-[#627D98]">
                <FiImage size={26} />
                <span>No image available</span>
              </div>
            )}

            <div className="min-w-0">
              <h2 className="text-2xl font-semibold">
                {subcategory.name || "N/A"}
              </h2>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#087F95] px-3 py-1 text-sm font-medium text-white">
                  <FiLayers size={13} />
                  {parentName}
                </span>

                <StatusBadge />
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <InfoCard icon={FiGrid} label="Subcategory Name">
              <p className="mt-1  font-semibold">
                {subcategory.name || "N/A"}
              </p>
            </InfoCard>

            <InfoCard icon={FiLayers} label="Parent Category">
              <p className="mt-1  font-semibold">
                {parentName}
              </p>
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
