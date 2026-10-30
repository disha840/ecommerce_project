
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { slug } = useParams();

  const [variant, setVariant] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  const getVariant = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/productvariant/getonevariant/${slug}`
      );

      const data = await response.json();

      if (response.ok) {
        setVariant(data.variant);

        // Backend images array
        let imageArray = data.variant.images || [];

        // Single image string aaye toh array banana
        if (typeof imageArray === "string") {
          imageArray = [imageArray];
        }

        // Image URL nikalna
        const imageUrls = [];

        imageArray.forEach((image) => {
          if (typeof image === "string") {
            imageUrls.push(image);
          } else if (image && image.url) {
            imageUrls.push(image.url);
          }
        });

        setImages(imageUrls);
        setSelectedImage(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (slug) {
      getVariant();
    }
  }, [slug]);

  if (!variant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-3xl bg-white px-12 py-14 text-center shadow-xl ring-1 ring-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Variant Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            The product you are looking for is unavailable.
          </p>
        </div>
      </div>
    );
  }

  // Discount se kitna paisa bacha
  const savings = variant.mrp - variant.sellingPrice;

  return (
    <div className="min-h-screen  from-emerald-50 to-gray-50 p-8">

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100 md:grid-cols-2">

        {/* Images */}
        <div>

          {/* Main Image */}
          <div className="relative flex h-96 items-center justify-center rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-100">

            {variant.discountPercentage > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                {variant.discountPercentage}% OFF
              </span>
            )}

            {images.length > 0 ? (
              <img
                src={images[selectedImage]}
                alt={variant.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <p className="text-gray-400">No Image Available</p>
            )}

          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-5 flex gap-3">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={variant.name}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 cursor-pointer rounded-xl border-2 object-cover ${
                    selectedImage === index
                      ? "border-emerald-600 ring-4 ring-emerald-100"
                      : "border-gray-200 opacity-70"
                  }`}
                />
              ))}
            </div>
          )}

        </div>

        {/* Variant Details */}
        <div>

          

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {variant.name}
          </h1>

          {/* Price Box */}
          <div className="my-6 rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-100">

            <div className="flex items-center gap-3">

              <span className="text-4xl font-bold text-emerald-700">
                ₹{variant.sellingPrice}
              </span>

              {variant.mrp && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{variant.mrp}
                </span>
              )}

              {variant.discountPercentage > 0 && (
                <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                  {variant.discountPercentage}% OFF
                </span>
              )}

            </div>

            {savings > 0 && (
              <p className="mt-2 text-sm font-medium text-emerald-700">
                You save ₹{savings}
              </p>
            )}

          </div>

          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Product Information
          </h2>

          {/* Product Information */}
          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
              <p className="text-xs text-gray-500">SKU</p>
              <p className="font-semibold">{variant.sku}</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
              <p className="text-xs text-gray-500">Barcode</p>
              <p className="font-semibold">{variant.barcode}</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
              <p className="text-xs text-gray-500">Unit Value</p>
              <p className="font-semibold">{variant.unitValue}</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
              <p className="text-xs text-gray-500">Unit</p>
              <p className="font-semibold">{variant.unit}</p>
            </div>

            

          </div>

          <button className="mt-8 w-full rounded-xl bg-emerald-600 p-4 font-bold text-white shadow-lg hover:bg-emerald-700">
            Add To Cart
          </button>

        </div>

      </div>

      {/* Description */}
      {variant.description && (
        <div className="mx-auto mt-8 max-w-6xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">

          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Product Description
          </h2>

          <p className="text-gray-600">
            {variant.description}
          </p>

        </div>
      )}

    </div>
  );
};

export default Page;