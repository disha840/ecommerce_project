

"use client";

import api from "../../../axios/api";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

import { getCart } from "@/redux/Slices/cartSlice";
import { setShowLogin } from "@/redux/Slices/uiSlice";

const Page = () => {
    const { slug } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const store = useSelector((state) => state.store.selectedStore);
    const storeId = store?._id;
    const user = useSelector((state) => state.auth.user);

    const [inventories, setInventories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Wishlist states
    const [wishlistVariants, setWishlistVariants] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState(null);

    // Get All Products And Variants
    const fetchVariants = async () => {
        try {
            if (!storeId || !slug) return;

            setLoading(true);

            const response = await api.get(`/inventory/store/${storeId}`);

            if (response.data.success) {
                const inventoryData = response.data.inventories || [];

                setInventories(inventoryData);

                // Get All Unique Products
                const allProducts = [];

                inventoryData.forEach((inventory) => {
                    const product = inventory.product;

                    if (
                        product &&
                        !allProducts.some(
                            (item) => item._id === product._id
                        )
                    ) {
                        allProducts.push(product);
                    }
                });

                setProducts(allProducts);

                // Find Product Using URL Slug
                const currentProduct = inventoryData.find(
                    (inventory) => inventory.product?.slug === slug
                )?.product;

                if (currentProduct) {
                    setSelectedProduct(currentProduct);

                    // Automatically Show Its Variants
                    const availableVariants = inventoryData
                        .filter(
                            (inventory) =>
                                inventory.product?._id === currentProduct._id &&
                                inventory.variant
                        )
                        .map((inventory) => ({
                            ...inventory.variant,
                            product: inventory.product,
                            availableQuantity: inventory.availableQuantity
                        }));

                    setVariants(availableVariants);
                } else {
                    setSelectedProduct(null);
                    setVariants([]);
                }
            } else {
                setProducts([]);
                setVariants([]);
                setSelectedProduct(null);
            }

        } catch (error) {
            console.log("Error fetching variants:", error);
            setProducts([]);
            setVariants([]);
            setSelectedProduct(null);
        } finally {
            setLoading(false);
        }
    };

    // Product Click
    const handleProductClick = (product) => {
        setSelectedProduct(product);

        const availableVariants = inventories
            .filter(
                (inventory) =>
                    inventory.product?._id === product._id &&
                    inventory.variant
            )
            .map((inventory) => ({
                ...inventory.variant,
                product: inventory.product,
                availableQuantity: inventory.availableQuantity
            }));

        setVariants(availableVariants);
    };

    useEffect(() => {
        if (slug && storeId) {
            fetchVariants();
        }
    }, [slug, storeId]);

    // ADD TO CART
    const handleAddToCart = async (event, variant) => {
        event.stopPropagation();

        if (!user) {
            return dispatch(setShowLogin(true));
        }

        try {
            const response = await api.post(`/cart/add/${storeId}`, {
                product: variant.product?._id,
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

    // ADD TO WISHLIST
    const handleAddToWishlist = async (event, variant) => {
        event.stopPropagation();

        if (!user) {
            return dispatch(setShowLogin(true));
        }

        try {
            setWishlistLoading(variant._id);

            const response = await api.post("/wishlist/add", {
                product: variant.product?._id,
                variant: variant._id
            });

            if (response.data.success) {
                setWishlistVariants((previous) => [
                    ...previous,
                    variant._id
                ]);

                toast.success("Product added to wishlist!");
            }

        } catch (error) {
            console.log("Add to wishlist error:", error);

            toast.error(
                error.response?.data?.message || "Unable to add to wishlist"
            );

        } finally {
            setWishlistLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg font-semibold text-slate-600">
                    Loading variants...
                </p>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-5 py-12 md:px-10">

                {/* All Products */}

                <div className="mb-12">
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-bold uppercase tracking-[3px] text-emerald-600">
                            Explore Products
                        </p>

                        <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                            All Products
                        </h1>

                        <div className="mt-4 h-1 w-16 rounded-full bg-emerald-500"></div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {products.map((product) => (
                            <button
                                key={product._id}
                                onClick={() => handleProductClick(product)}
                                className={`rounded-xl border px-5 py-3 text-sm font-bold transition ${
                                    selectedProduct?._id === product._id
                                        ? "border-emerald-600 bg-emerald-600 text-white"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
                                }`}
                            >
                                {product.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Heading */}

                <div className="mb-10 text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[3px] text-emerald-600">
                        Shop Your Favorites
                    </p>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                        Choose Your Variant
                    </h1>

                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 md:text-base">
                        Explore available options and select the one that suits you best.
                    </p>

                    <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-emerald-500"></div>
                </div>

                {/* Variants */}

                {variants.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-20 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">
                            🛒
                        </div>

                        <h2 className="text-xl font-bold text-slate-800">
                            No Variants Available
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Currently, no variants are available for this product.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">
                                {selectedProduct?.name} - Available Options
                            </h2>

                            <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                                {variants.length} Variants
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                            {variants.map((variant) => (
                                <div
                                    key={variant._id}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                                    onClick={() => {
                                        if (variant.slug) {
                                            router.push(`/variants/${variant.slug}`);
                                        }
                                    }}
                                >

                                    {/* Image */}

                                    <div className="relative flex h-40 items-center justify-center overflow-hidden bg-slate-100 sm:h-52">

                                        {variant.images?.[0]?.url ? (
                                            <img
                                                src={variant.images[0].url}
                                                alt={variant.name}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <span className="text-6xl">🛒</span>
                                        )}

                                        {/* Wishlist Icon */}

                                        <button
                                            onClick={(event) =>
                                                handleAddToWishlist(event, variant)
                                            }
                                            disabled={wishlistLoading === variant._id}
                                            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 disabled:opacity-50"
                                            title="Add to Wishlist"
                                        >
                                            <Heart
                                                size={21}
                                                className={
                                                    wishlistVariants.includes(variant._id)
                                                        ? "fill-red-500 text-red-500"
                                                        : "text-slate-700"
                                                }
                                            />
                                        </button>

                                        {variant.discountPercentage > 0 && (
                                            <span className="absolute left-3 top-3 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                                                {variant.discountPercentage}% OFF
                                            </span>
                                        )}

                                    </div>

                                    {/* Details */}

                                    <div className="p-3 sm:p-4">

                                        <h2 className="truncate text-base font-bold text-slate-800 sm:text-lg">
                                            {variant.name}
                                        </h2>

                                        {variant.barcode && (
                                            <p className="mt-2 truncate text-xs text-slate-400">
                                                Barcode:{" "}
                                                <span className="font-medium text-slate-600">
                                                    {variant.barcode}
                                                </span>
                                            </p>
                                        )}

                                        {/* Price */}

                                        <div className="mt-4 flex min-h-9 items-center justify-between gap-2 border-t border-slate-100 pt-3">

                                            {variant.sellingPrice != null ? (
                                                <span className="text-lg font-extrabold text-emerald-700">
                                                    ₹{variant.sellingPrice}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-slate-400">
                                                    Price unavailable
                                                </span>
                                            )}

                                        </div>

                                        {/* Add to Cart */}

                                        <button
                                            onClick={(event) =>
                                                handleAddToCart(event, variant)
                                            }
                                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                                        >
                                            <span className="text-lg">+</span>
                                            Add to Cart
                                        </button>

                                    </div>
                                </div>
                            ))}

                        </div>
                    </>
                )}

            </div>
        </section>
    );
};

export default Page;
