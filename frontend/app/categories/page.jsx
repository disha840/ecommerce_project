
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {

    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // FETCH ALL CATEGORIES
    const getCategories = async () => {

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3000/category/showcategories"
            );

            const data = await response.json();

            console.log("Categories:", data.category);

            if (response.ok && Array.isArray(data.category)) {

                // Only ACTIVE categories
                const activeCategories = data.category.filter(
                    (category) => category.status === "ACTIVE"
                );

                setCategories(activeCategories);

            } else {
                setCategories([]);
            }

        } catch (error) {
            console.log("Category fetch error:", error);
            setCategories([]);

        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        getCategories();
    }, []);

    // CATEGORY CLICK
    const handleCategoryClick = (category) => {
        router.push(`/categories/${category._id}`);
    };

    return (

        <div className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">

                {/* PAGE HEADING */}
                <div className="mb-8">

                    <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700 mb-2">
                        Explore QuickKart
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900">
                        All Categories
                    </h1>

                    <p className="text-gray-500 text-sm mt-2">
                        Explore all categories and find your everyday essentials.
                    </p>

                </div>

                {/* LOADING */}
                {loading ? (

                    <div className="text-center py-16 text-gray-500">
                        Loading categories...
                    </div>

                ) : categories.length > 0 ? (

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

                        {categories.map((category) => (

                            <div
                                key={category._id}
                                onClick={() => handleCategoryClick(category)}
                                className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition"
                            >

                                {/* CATEGORY IMAGE */}
                                <div className="h-40 sm:h-48 bg-emerald-50 flex items-center justify-center p-4">

                                    {category.image ? (

                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                                        />

                                    ) : (

                                        <span className="text-6xl">
                                            🛒
                                        </span>

                                    )}

                                </div>

                                {/* CATEGORY NAME */}
                                <div className="p-4 text-center">

                                    <h2 className="font-semibold text-gray-800 group-hover:text-emerald-700 transition">
                                        {category.name}
                                    </h2>

                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                        {category.description}
                                    </p>

                                    <p className="text-xs font-semibold text-emerald-700 mt-3">
                                        Explore →
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="text-center py-16">

                        <div className="text-5xl mb-4">
                            📦
                        </div>

                        <h2 className="text-lg font-semibold text-gray-800">
                            No Categories Found
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                            Categories will appear here when available.
                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}
