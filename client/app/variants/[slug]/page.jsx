

"use client";

import api from "../../../axios/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { getCart } from "@/redux/Slices/cartSlice";
import { setShowLogin } from "@/redux/Slices/uiSlice";
import toast from "react-hot-toast";

const Page = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const store = useSelector((state) => state.store.selectedStore);
  const storeId = store?._id;

  const user = useSelector((state) => state.auth.user);

  const [variant, setVariant] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Wishlist states
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // GET WISHLIST
  const getWishlist = async (variantId) => {
    try {
      const response = await api.get("/wishlist/get", {
        params: {
          storeId: storeId,
        },
      });

      if (response.data.success) {
        const wishlistItems = response.data.data || [];

        const wishlistItem = wishlistItems.find(
          (item) => item.variant?._id === variantId
        );

        setIsWishlisted(!!wishlistItem);
        setWishlistItemId(wishlistItem?._id || null);
      }

    } catch (error) {
      console.log("Get Wishlist Error:", error);
    }
  };

  // ADD / REMOVE FROM WISHLIST
  const handleWishlist = async () => {
    if (!user) {
      return dispatch(setShowLogin(true));
    }

    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);

      // REMOVE FROM WISHLIST
      if (isWishlisted) {
        const response = await api.delete(
          `/wishlist/remove/${wishlistItemId}`
        );

        if (response.data.success) {
          setIsWishlisted(false);
          setWishlistItemId(null);

          toast.success("Product removed from wishlist!");
        }

      } else {

        // ADD TO WISHLIST
        const response = await api.post("/wishlist/add", {
          product: variant.product?._id || variant.product,
          variant: variant._id,
        });

        if (response.data.success) {
          setIsWishlisted(true);

          // Get Wishlist Item ID
          await getWishlist(variant._id);

          toast.success("Product added to wishlist!");
        }
      }

    } catch (error) {
      console.log("Wishlist Error:", error);

      toast.error(
        error.response?.data?.message || "Unable to update wishlist"
      );

    } finally {
      setWishlistLoading(false);
    }
  };

  // ADD TO CART
  const handleAddToCart = async (variant) => {
    if (!user) {
      return dispatch(setShowLogin(true));
    }

    try {
      const response = await api.post(`/cart/add/${storeId}`, {
        product: variant.product?._id || variant.product,
        variant: variant._id,
        quantity: 1,
      });

      dispatch(getCart());

      toast.success("Product added to cart!");

      console.log(response.data);

    } catch (error) {
      console.log("Add to cart error:", error);

      toast.error(
        error.response?.data?.message || "Unable to add product to cart"
      );
    }
  };

  // GET VARIANT
  const getVariant = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/inventory/store/${storeId}`);

      const inventories = response.data.inventories || [];

      const selectedInventory = inventories.find(
        (item) => item.variant?.slug === slug
      );

      if (!selectedInventory) {
        setVariant(null);
        setImages([]);
        return;
      }

      const variantData = selectedInventory.variant;

      setVariant({
        ...variantData,
        product: selectedInventory.product,
        availableQuantity: selectedInventory.availableQuantity,
      });

      let imageArray = variantData.images || [];

      if (typeof imageArray === "string") {
        imageArray = [imageArray];
      }

      const imageUrls = imageArray
        .map((image) =>
          typeof image === "string" ? image : image?.url
        )
        .filter(Boolean);

      setImages(imageUrls);
      setSelectedImage(0);

    } catch (error) {
      console.log("Get variant error:", error);
      setVariant(null);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug && storeId) {
      getVariant();
    }
  }, [slug, storeId]);

  // CHECK IF VARIANT IS ALREADY IN WISHLIST
  useEffect(() => {
    if (user && storeId && variant?._id) {
      getWishlist(variant._id);
    } else {
      setIsWishlisted(false);
      setWishlistItemId(null);
    }
  }, [user, storeId, variant?._id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

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

  const savings = variant.mrp - variant.sellingPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50 p-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100 md:grid-cols-2">

        {/* Images */}
        <div>
          <div className="relative flex h-96 items-center justify-center rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-100">

            {variant.discountPercentage > 0 && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                {variant.discountPercentage}% OFF
              </span>
            )}

            {/* Wishlist Heart */}
            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              title={
                isWishlisted
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"
              }
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 disabled:opacity-50"
            >
              <Heart
                size={24}
                className={
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 hover:text-red-500"
                }
              />
            </button>

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

          <button
            onClick={() => handleAddToCart(variant)}
            className="mt-8 w-full rounded-xl bg-emerald-600 p-4 font-bold text-white shadow-lg hover:bg-emerald-700"
          >
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
