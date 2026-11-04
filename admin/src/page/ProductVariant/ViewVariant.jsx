
import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";

function ViewVariant() {
  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getVariant = async () => {
      try {
        const response = await api.get(
          `/productvariant/viewvariant/${id}`
        );

        setVariant(response.data.variant);
      } catch (error) {
        console.log(error.message);
        setError("Unable to load variant details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getVariant();
    }
  }, [id]);

  if (loading) {
    return (
      <p className="min-h-screen bg-[#F0FAFC] p-6 text-[#627D98]">
        Loading variant details...
      </p>
    );
  }

  if (error || !variant) {
    return (
      <div className="min-h-screen bg-[#F0FAFC] p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#D9E8EF] bg-white p-6 shadow-sm">
          <p className="mb-4 text-[#087F95]">
            {error || "Variant not found."}
          </p>

          <button
            onClick={() => navigate("/admin/productvariant")}
            className="rounded-lg bg-[#087F95] px-4 py-2 text-white transition hover:bg-[#066779]"
          >
            Back to Variants
          </button>
        </div>
      </div>
    );
  }

  const getName = (value) => {
    if (!value) return "N/A";

    if (typeof value === "object") {
      return value.name || "N/A";
    }

    return value;
  };

  const details = [
    ["Product Name", getName(variant.product)],
    ["Variant Name", variant.name],
    ["SKU", variant.sku],
    ["Barcode", variant.barcode],
    ["Unit Value", variant.unitValue],
    ["Unit", variant.unit],
    ["MRP", variant.mrp],
    ["Selling Price", variant.sellingPrice],
    ["Discount Percentage", variant.discountPercentage != null
      ? `${variant.discountPercentage}%`
      : "N/A"],
    ["Weight", variant.weight],
    ["Length", variant.length],
    ["Width", variant.width],
    ["Height", variant.height],
    ["Status", variant.status],
    [
      "Created At",
      variant.createdAt
        ? new Date(variant.createdAt).toLocaleString()
        : "N/A",
    ],
    [
      "Updated At",
      variant.updatedAt
        ? new Date(variant.updatedAt).toLocaleString()
        : "N/A",
    ],
  ];

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-6 text-[#102A43]">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#D9E8EF] bg-white p-6 shadow-sm">

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#102A43]">
              Variant Details
            </h2>

            <p className="mt-1 text-sm text-[#627D98]">
              Complete information about this variant
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/productvariant")}
            className="rounded-lg bg-[#087F95] px-4 py-2 text-white transition hover:bg-[#066779]"
          >
            Back
          </button>
        </div>

        {/* Variant Images */}
        {variant.images?.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 font-semibold text-[#102A43]">
              Variant Images
            </h3>

            <div className="flex flex-wrap gap-4">
              {variant.images.map((image, index) => {
                const imageUrl =
                  typeof image === "string"
                    ? image
                    : image?.url || image?.secure_url;

                return imageUrl ? (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`${variant.name} ${index + 1}`}
                    className="h-28 w-28 rounded-xl border border-[#D9E8EF] object-cover"
                  />
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Variant Information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] p-4"
            >
              <p className="text-sm text-[#627D98]">
                {label}
              </p>

              <p className="mt-1 font-semibold text-[#102A43]">
                {value ?? "N/A"}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ViewVariant;
