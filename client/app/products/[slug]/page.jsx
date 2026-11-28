
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

    // Cart Items
    const cartItems = useSelector((state) => state.cart.items || []);

    const [inventories, setInventories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;

    const currentProducts = products.slice(
        startIndex,
        startIndex + productsPerPage
    );

    // Wishlist states
    const [wishlistVariants, setWishlistVariants] = useState([]);
    const [wishlistItemIds, setWishlistItemIds] = useState({});
    const [wishlistLoading, setWishlistLoading] = useState(null);

    // Check if variant already exists in cart
    const isVariantInCart = (variantId) => {
        return cartItems.some(
            (item) =>
                (item.variant?._id || item.variant) === variantId
        );
    };

    // GET WISHLIST
    const fetchWishlist = async () => {
        try {
            const response = await api.get("/wishlist/get", {
                params: {
                    storeId: storeId,
                },
            });

            if (response.data.success) {
                const wishlistItems = response.data.data || [];

                const variantIds = wishlistItems
                    .map((item) => item.variant?._id)
                    .filter(Boolean);

                const itemIds = {};

                wishlistItems.forEach((item) => {
                    if (item.variant?._id) {
                        itemIds[item.variant._id] = item._id;
                    }
                });

                setWishlistVariants(variantIds);
                setWishlistItemIds(itemIds);
            }
        } catch (error) {
            console.log("Get Wishlist Error:", error);
        }
    };

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
                            availableQuantity: inventory.availableQuantity,
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
                availableQuantity: inventory.availableQuantity,
            }));

        setVariants(availableVariants);
    };

    // FETCH VARIANTS
    useEffect(() => {
        setCurrentPage(1);

        if (slug && storeId) {
            fetchVariants();
        } else {
            setProducts([]);
            setVariants([]);
            setSelectedProduct(null);
            setLoading(false);
        }
    }, [slug, storeId]);

    // FETCH WISHLIST
    useEffect(() => {
        if (user && storeId) {
            fetchWishlist();
        } else {
            setWishlistVariants([]);
            setWishlistItemIds({});
        }
    }, [user, storeId]);

    // FETCH CART
    useEffect(() => {
        if (user && storeId) {
            dispatch(getCart());
        }
    }, [user, storeId, dispatch]);

    // ADD TO CART / GO TO CART
    const handleAddToCart = async (event, variant) => {
        event.stopPropagation();

        if (!user) {
            return dispatch(setShowLogin(true));
        }

        // Already in cart: navigate to cart page
        if (isVariantInCart(variant._id)) {
            router.push("/cart");
            return;
        }

        try {
            await api.post(`/cart/add/${storeId}`, {
                product: variant.product?._id,
                variant: variant._id,
                quantity: 1,
            });

            await dispatch(getCart());

            toast.success("Product added to cart!");
        } catch (error) {
            console.log("Add to cart error:", error);

            toast.error(
                error.response?.data?.message || "Unable to add product to cart"
            );
        }
    };

    // ADD / REMOVE FROM WISHLIST
    const handleAddToWishlist = async (event, variant) => {
        event.stopPropagation();

        if (!user) {
            return dispatch(setShowLogin(true));
        }

        try {
            setWishlistLoading(variant._id);

            // REMOVE FROM WISHLIST
            if (wishlistVariants.includes(variant._id)) {
                const wishlistItemId = wishlistItemIds[variant._id];

                if (!wishlistItemId) {
                    toast.error("Wishlist item not found");
                    return;
                }

                await api.delete(`/wishlist/remove/${wishlistItemId}`);

                setWishlistVariants((previous) =>
                    previous.filter((id) => id !== variant._id)
                );

                setWishlistItemIds((previous) => {
                    const updated = { ...previous };
                    delete updated[variant._id];
                    return updated;
                });

                toast.success("Product removed from wishlist!");
            }

            // ADD TO WISHLIST
            else {
                const response = await api.post("/wishlist/add", {
                    product: variant.product?._id,
                    variant: variant._id,
                });

                if (response.data.success) {
                    await fetchWishlist();
                    toast.success("Product added to wishlist!");
                }
            }
        } catch (error) {
            console.log("Wishlist Error:", error);

            toast.error(
                error.response?.data?.message || "Unable to update wishlist"
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

                    {/* Product Buttons */}

                    <div className="flex flex-wrap gap-3">
                        {currentProducts.map((product) => (
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

                    {/* Pagination */}

                    {totalPages > 1 && (
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

                            <p className="text-sm text-slate-500">
                                Showing {startIndex + 1} -{" "}
                                {Math.min(
                                    startIndex + productsPerPage,
                                    products.length
                                )}{" "}
                                of {products.length} products
                            </p>

                            <div className="flex items-center gap-3">

                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) => prev - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <span className="text-sm font-semibold text-slate-700">
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>

                            </div>
                        </div>
                    )}
                </div>

                {/* Heading */}

                <div className="mb-10 text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[3px] text-emerald-600">
                        Shop Your Favorites
                    </p>

                    <h1 className="text-xl font-bold text-slate-900">
                        Choose Your Variant
                    </h1>

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
                                            title={
                                                wishlistVariants.includes(variant._id)
                                                    ? "Remove from Wishlist"
                                                    : "Add to Wishlist"
                                            }
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

                                        {/* Add to Cart / Go to Cart */}

                                        <button
                                            onClick={(event) =>
                                                handleAddToCart(event, variant)
                                            }
                                            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95 ${
                                                isVariantInCart(variant._id)
                                                    ? "bg-slate-700 hover:bg-slate-800"
                                                    : "bg-emerald-600 hover:bg-emerald-700"
                                            }`}
                                        >
                                            {isVariantInCart(variant._id) ? (
                                                "Go to Cart"
                                            ) : (
                                                <>
                                                    <span className="text-lg">+</span>
                                                    Add to Cart
                                                </>
                                            )}
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
