
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Hero() {
    const [banners, setBanners] = useState([]);

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

    return (
        <>
            {banners.map((banner) => (
                <section
                    key={banner._id}
                    dangerouslySetInnerHTML={{
                        __html: banner.htmlContent,
                    }}
                />
            ))}
        </>
    );
}
