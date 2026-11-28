
import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";

function ViewInventory() {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getInventory = async () => {
      try {
        const response = await api.get(`/inventory/getinventory/${id}`);
        setInventory(response.data.inventory);
      } catch (error) {
        console.log(error);
        setError(
          error.response?.data?.message ||
          "Unable to load inventory details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getInventory();
    }
  }, [id]);

  if (loading) {
    return (
      <p className="min-h-screen bg-[#F0FAFC] p-6 text-[#627D98]">
        Loading inventory details...
      </p>
    );
  }

  if (error || !inventory) {
    return (
      <div className="min-h-screen bg-[#F0FAFC] p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#D9E8EF] bg-white p-6 shadow-sm">
          <p className="mb-4 text-[#087F95]">
            {error || "Inventory not found."}
          </p>

          <button
            onClick={() => navigate("/admin/inventory")}
            className="rounded-lg bg-[#087F95] px-4 py-2 text-white transition hover:bg-[#066779]"
          >
            Back to Inventory
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

  const getAddress = (address) => {
    if (!address) return "N/A";

    if (typeof address === "string") return address;

    if (typeof address === "object") {
      return [
        address.street,
        address.area,
        address.city,
        address.state,
        address.pincode,
      ]
        .filter(Boolean)
        .join(", ") || "N/A";
    }

    return "N/A";
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : "N/A";
  };

  const productImages = inventory.product?.images || [];
  const variantImages = inventory.variant?.images || [];

  const renderImages = (images, name) => {
    if (!images.length) {
      return (
        <p className="text-sm text-[#627D98]">
          No images available.
        </p>
      );
    }

    return (
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => {
          const imageUrl =
            typeof image === "string"
              ? image
              : image?.url || image?.secure_url;

          return imageUrl ? (
            <img
              key={index}
              src={imageUrl}
              alt={`${name} ${index + 1}`}
              className="h-28 w-28 rounded-xl border border-[#D9E8EF] object-cover"
            />
          ) : null;
        })}
      </div>
    );
  };

  const productDetails = [
    ["Product Name", getName(inventory.product)],
    ["Product Slug", inventory.product?.slug],
    ["Category", getName(inventory.product?.category)],
    ["Brand", getName(inventory.product?.brand)],
  ];

  const storeDetails = [
    ["Store Name", getName(inventory.store)],
    ["Store Code", inventory.store?.code],
    ["Store Address", getAddress(inventory.store?.address)],
    ["Store Status", inventory.store?.status],
  ];

  const variantDetails = [
    ["Variant Name", getName(inventory.variant)],
    ["Variant Slug", inventory.variant?.slug],
    ["SKU", inventory.variant?.sku],
    ["Unit", inventory.variant?.unit],
    ["Unit Value", inventory.variant?.unitValue],
    ["MRP", inventory.variant?.mrp],
    ["Selling Price", inventory.variant?.sellingPrice],
  ];

  const stockDetails = [
    ["Total Quantity", inventory.quantity],
    ["Reserved Quantity", inventory.reservedQuantity],
    ["Available Quantity", inventory.availableQuantity],
    ["Reorder Level", inventory.reorderLevel],
    ["Maximum Stock Level", inventory.maxStockLevel],
  ];

  const inventoryDetails = [
    ["Inventory Status", inventory.status],
    ["Created At", formatDate(inventory.createdAt)],
    ["Updated At", formatDate(inventory.updatedAt)],
  ];

  const DetailSection = ({ title, details }) => (
    <div className="mb-6">
      <h3 className="mb-3 text-lg font-bold text-[#102A43]">
        {title}
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div
            key={label}
            className={`rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] p-4 ${
              label === "Store Address" ? "sm:col-span-2" : ""
            }`}
          >
            <p className="text-sm text-[#627D98]">
              {label}
            </p>

            <p className="mt-1 break-words font-semibold text-[#102A43]">
              {value ?? "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0FAFC] p-6 text-[#102A43]">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#D9E8EF] bg-white p-6 shadow-sm">

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#102A43]">
              Inventory Details
            </h2>

            <p className="mt-1 text-sm text-[#627D98]">
              Complete information about this inventory
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/inventory")}
            className="rounded-lg bg-[#087F95] px-4 py-2 text-white transition hover:bg-[#066779]"
          >
            Back to Inventory
          </button>
        </div>

        {/* Product Images */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-[#102A43]">
            Product Images
          </h3>

          {renderImages(productImages, inventory.product?.name || "Product")}
        </div>

        {/* Product Details */}
        <DetailSection
          title="Product Information"
          details={productDetails}
        />

        {/* Store Details */}
        <DetailSection
          title="Store Information"
          details={storeDetails}
        />

        {/* Variant Images */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold text-[#102A43]">
            Variant Images
          </h3>

          {renderImages(variantImages, inventory.variant?.name || "Variant")}
        </div>

        {/* Variant Details */}
        <DetailSection
          title="Variant Information"
          details={variantDetails}
        />

        {/* Stock Details */}
        <DetailSection
          title="Stock Information"
          details={stockDetails}
        />

        {/* Inventory Details */}
        <DetailSection
          title="Inventory Information"
          details={inventoryDetails}
        />

      </div>
    </div>
  );
}

export default ViewInventory;
