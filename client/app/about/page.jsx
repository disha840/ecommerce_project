
"use client";

import Link from "next/link";
import {
    Store,
    Leaf,
    Truck,
    ShoppingBasket,
    Heart,
    Target,
    Eye,
    ArrowRight,
    ShieldCheck,
    Clock,
    MapPin,
    ShoppingCart
} from "lucide-react";

const features = [
    {
        icon: Store,
        title: "Nearby Stores",
        description:
            "Shop from nearby stores and discover products available in your area."
    },
    {
        icon: Leaf,
        title: "Fresh Products",
        description:
            "Explore fresh fruits, vegetables, dairy products and everyday essentials."
    },
    {
        icon: Truck,
        title: "Home Delivery",
        description:
            "Get your daily groceries delivered conveniently to your doorstep."
    },
    {
        icon: ShoppingBasket,
        title: "Easy Shopping",
        description:
            "Enjoy a simple shopping experience with easy browsing and ordering."
    },
    {
        icon: ShieldCheck,
        title: "Reliable Service",
        description:
            "We aim to make your everyday grocery shopping smooth and convenient."
    },
    {
        icon: Clock,
        title: "Save Your Time",
        description:
            "Order your essentials online and spend more time on what matters."
    }
];

export default function AboutPage() {
    return (
        <main className="bg-white text-gray-800">

            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-emerald-50">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">

                    <div>
                        <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                            Welcome to QuickKart
                        </span>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                            Freshness at
                            <span className="text-emerald-600"> Your Doorstep.</span>
                        </h1>

                        <p className="mt-6 text-gray-600 text-base sm:text-lg leading-8 max-w-xl">
                            Your everyday grocery shopping just got easier.
                            Discover nearby stores, explore fresh products
                            and get your daily essentials delivered right
                            to your doorstep with QuickKart.
                        </p>

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 mt-8 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-emerald-200"
                        >
                            Start Shopping
                            <ArrowRight size={19} />
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-emerald-200 rounded-[2rem] rotate-3 opacity-50"></div>

                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000"
                            alt="Fresh groceries"
                            className="relative w-full h-[320px] sm:h-[420px] object-cover rounded-[2rem] shadow-xl"
                        />

                        <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg flex items-center gap-3">
                            <div className="bg-emerald-100 p-3 rounded-full">
                                <ShoppingBasket className="text-emerald-600" size={25} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    Your Daily Essentials
                                </h3>
                                <p className="text-sm text-gray-500">
                                    All in one place!
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>


            {/* ABOUT SECTION */}
            <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-24">

                <div className="grid md:grid-cols-2 gap-14 items-center">

                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
                            alt="Fresh vegetables and groceries"
                            className="w-full h-[350px] sm:h-[430px] object-cover rounded-3xl"
                        />

                        <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-emerald-600 text-white p-5 sm:p-7 rounded-2xl shadow-xl">
                            <Heart size={30} className="mb-2" />
                            <p className="font-bold text-lg">
                                Made for
                            </p>
                            <p className="text-emerald-100 text-sm">
                                Everyday Needs
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 md:mt-0">
                        <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm">
                            Who We Are
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 leading-tight">
                            Making Grocery Shopping Simple & Convenient
                        </h2>

                        <p className="text-gray-600 mt-6 leading-8">
                            At QuickKart, we believe grocery shopping
                            should be simple, convenient and hassle-free.
                            Our goal is to make everyday shopping easier
                            by connecting customers with nearby stores.
                        </p>

                        <p className="text-gray-600 mt-4 leading-8">
                            From fresh fruits and vegetables to dairy
                            products, snacks, beverages and household
                            essentials, QuickKart helps you find
                            everything you need in one place.
                        </p>

                        <p className="text-gray-600 mt-4 leading-8">
                            We are committed to creating a convenient
                            shopping experience where customers can
                            explore products, place orders and enjoy
                            doorstep delivery.
                        </p>
                    </div>

                </div>
            </section>


            {/* MISSION & VISION */}
            <section className="bg-emerald-50 py-20">

                <div className="max-w-7xl mx-auto px-5 sm:px-8">

                    <div className="text-center mb-12">
                        <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm">
                            Our Purpose
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                            What Drives Us
                        </h2>

                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                            Everything we do is focused on making
                            everyday grocery shopping better.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm hover:shadow-lg transition">
                            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                <Target size={30} className="text-emerald-600" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6">
                                Our Mission
                            </h3>

                            <p className="text-gray-600 mt-4 leading-8">
                                To make everyday grocery shopping
                                convenient, accessible and reliable by
                                connecting customers with nearby stores
                                and delivering quality products right
                                to their homes.
                            </p>
                        </div>

                        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm hover:shadow-lg transition">
                            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                <Eye size={30} className="text-emerald-600" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6">
                                Our Vision
                            </h3>

                            <p className="text-gray-600 mt-4 leading-8">
                                To become a trusted grocery delivery
                                platform that brings local stores and
                                customers closer through technology,
                                convenience and excellent service.
                            </p>
                        </div>

                    </div>
                </div>
            </section>


            {/* WHY CHOOSE US */}
            <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-24">

                <div className="text-center mb-14">
                    <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm">
                        Why QuickKart
                    </span>

                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                        Why Choose QuickKart?
                    </h2>

                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        We bring convenience, variety and a better
                        grocery shopping experience together.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={index}
                                className="group border border-gray-100 rounded-2xl p-7 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1 transition duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 transition">
                                    <Icon
                                        size={28}
                                        className="text-emerald-600 group-hover:text-white transition"
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mt-6">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-500 mt-3 leading-7">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}

                </div>
            </section>


            {/* GROCERY IMAGE SECTION */}
            <section className="px-5 sm:px-8 pb-20">
                <div className="max-w-7xl mx-auto relative overflow-hidden rounded-3xl">

                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400"
                        alt="Fresh grocery collection"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-emerald-950/75"></div>

                    <div className="relative text-center text-white px-6 py-20 sm:py-24">

                        <MapPin size={36} className="mx-auto text-emerald-300 mb-5" />

                        <h2 className="text-3xl sm:text-4xl font-bold">
                            Bringing Your Local Stores Closer
                        </h2>

                        <p className="text-emerald-50 max-w-2xl mx-auto mt-5 leading-8">
                            Discover the convenience of shopping from
                            nearby stores and getting your everyday
                            essentials delivered right to your doorstep.
                        </p>

                    </div>
                </div>
            </section>


            {/* CTA SECTION */}
            <section className="bg-emerald-600 py-16 px-5">

                <div className="max-w-4xl mx-auto text-center text-white">

                    <ShoppingCart size={42} className="mx-auto mb-5" />

                    <h2 className="text-3xl sm:text-4xl font-bold">
                        Ready to Shop Smarter?
                    </h2>

                    <p className="text-emerald-50 mt-5 leading-7">
                        Your everyday groceries are just a few clicks away.
                        Start exploring QuickKart today!
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mt-8 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3.5 rounded-xl font-bold transition"
                    >
                        Explore Products
                        <ArrowRight size={19} />
                    </Link>

                </div>
            </section>

        </main>
    );
}
