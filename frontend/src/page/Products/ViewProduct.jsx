import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";

function ViewProduct() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await api.get(`/products/viewproduct/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.log(error.message);
        setError("Unable to load product details.");
        console.log(error.message)
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <p className="p-6 text-[#A17B86]">
        Loading product details...
      </p>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FFF9F6] p-6">
        <div className="mx-auto max-w-4xl rounded-xl border border-[#EBD9D9] bg-white p-6">
          <p className="mb-4 text-[#713F50]">
            {error || "Product not found."}
          </p>

          <button
            onClick={() => navigate("/admin/products")}
            className="rounded-lg bg-[#96566A] px-4 py-2 text-white transition hover:bg-[#713F50]"
          >
            Back to Products
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
    ["Product Name", product.name],
    ["Unit", product.unit],
    ["Category", getName(product.category)],
    ["Subcategory", getName(product.subcategory)],
    ["Brand", getName(product.brand)],
    ["Description", product.description],
    [
      "Tags",
      Array.isArray(product.tags)
        ? product.tags.join(", ")
        : "N/A",
    ],
    ["Featured", product.isFeatured ? "Yes" : "No"],
    ["Status", product.isActive ? "Active" : "Inactive"],
    ["Rating", product.rating ?? "N/A"],
    ["Total Reviews", product.totalReviews ?? 0],
    [
      "Created At",
      product.createdAt
        ? new Date(product.createdAt).toLocaleString()
        : "N/A",
    ],
    [
      "Updated At",
      product.updatedAt
        ? new Date(product.updatedAt).toLocaleString()
        : "N/A",
    ],
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F6] p-6">
      <div className="mx-auto max-w-5xl rounded-xl border border-[#EBD9D9] bg-white p-6 shadow-md">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#713F50]">
              Product Details
            </h2>

            <p className="mt-1 text-sm text-[#A17B86]">
              Complete information about this product
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/products")}
            className="rounded-lg bg-[#96566A] px-4 py-2 text-white transition hover:bg-[#713F50]"
          >
            Back
          </button>
        </div>

        {/* Product Images */}
        {product?.images?.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 font-semibold text-[#713F50]">
              Product Images
            </h3>

            <div className="flex flex-wrap gap-4">
              {product?.images.map((image, index) => {
                const imageUrl =
                  typeof image === "string"
                    ? image
                    : image?.url || image?.secure_url;

                return imageUrl ? (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`${product?.name} ${index + 1}`}
                    className="h-28 w-28 rounded-lg border border-[#EBD9D9] object-cover"
                  />
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Product Information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {details?.map(([label, value]) => (
            <div
              key={label}
              className={`rounded-lg border border-[#EBD9D9] p-4 ${
                label === "Description"
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
              <p className="text-sm text-[#A17B86]">
                {label}
              </p>

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

export default ViewProduct;