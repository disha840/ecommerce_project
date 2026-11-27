

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

    const decodeHTML = (html) => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = html;
        return textarea.value;
    };

    // MAKE BANNER BUTTONS CLICKABLE
    const makeButtonsClickable = (html) => {
        const parser = new DOMParser();
        const documentHTML = parser.parseFromString(html, "text/html");

        const buttons = [
            "SHOP NOW",
            "EXPLORE NOW",
            "SHOP ESSENTIALS",
            "GRAB THE DEAL",
        ];

        const elements = documentHTML.querySelectorAll("span");

        elements.forEach((element) => {
            const text = element.textContent.trim().toUpperCase();

            if (buttons.some((button) => text.includes(button))) {
                const link = documentHTML.createElement("a");

                Array.from(element.attributes).forEach((attribute) => {
                    link.setAttribute(attribute.name, attribute.value);
                });

                link.href = "/products";
                link.style.cursor = "pointer";
                link.style.textDecoration = "none";

                while (element.firstChild) {
                    link.appendChild(element.firstChild);
                }

                element.replaceWith(link);
            }
        });

        return documentHTML.body.innerHTML;
    };

    if (banners.length === 0) {
        return null;
    }

    return (
        <div className="relative px-4 md:px-8 lg:px-12">

            <div
                key={banners[currentIndex]._id}
                dangerouslySetInnerHTML={{
                    __html: makeButtonsClickable(
                        decodeHTML(banners[currentIndex].htmlContent)
                    ),
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
