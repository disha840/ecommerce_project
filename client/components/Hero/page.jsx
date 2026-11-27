


"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Hero() {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const getBanners = async () => {
        try {
            const res = await axios.get(
                "https://ecommerce-project-wl3e.onrender.com/banner/get"
            );

            setBanners(res.data.banners || []);
        } catch (error) {
            console.log("Banner fetch error:", error);
        }
    };

    useEffect(() => {
        getBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((previousIndex) =>
                (previousIndex + 1) % banners.length
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [banners]);

    if (banners.length === 0) {
        return null;
    }

    return (
        <div className="relative">

            <div
                key={banners[currentIndex]._id}
                dangerouslySetInnerHTML={{
                    __html: banners[currentIndex].htmlContent,
                }}
            />

            {banners.length > 1 && (
                <div className="mt-3 flex justify-center gap-2">
                    {banners.map((banner, index) => (
                        <button
                            key={banner._id}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2.5 w-2.5 rounded-full transition ${
                                currentIndex === index
                                    ? "bg-emerald-700"
                                    : "bg-emerald-300"
                            }`}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}
