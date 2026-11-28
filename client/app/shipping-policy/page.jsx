
import Link from "next/link";
import {
    Truck,
    MapPin,
    Clock,
    Package,
    ShoppingBag,
    AlertCircle,
    CheckCircle,
    ArrowRight,
} from "lucide-react";

const shippingSections = [
    {
        icon: MapPin,
        title: "Delivery Availability",
        content:
            "QuickKart connects customers with nearby stores. Delivery availability depends on your selected location and the serviceable stores in your area. Please select your delivery location to explore available products.",
    },
    {
        icon: Clock,
        title: "Delivery Time",
        content:
            "Delivery time may vary depending on your location, store availability, order volume and other operational factors. The estimated delivery time, where available, will be displayed during the ordering process.",
    },
    {
        icon: Package,
        title: "Order Processing",
        content:
            "Once your order is placed successfully, the selected store will process your order. Orders are subject to product availability and store confirmation.",
    },
    {
        icon: Truck,
        title: "Delivery Charges",
        content:
            "Applicable delivery charges, if any, are calculated based on your delivery location and order details. The final delivery fee will be displayed at checkout before you confirm your order.",
    },
    {
        icon: ShoppingBag,
        title: "Order Tracking",
        content:
            "Customers can check the status of their orders through the My Orders section of their QuickKart account.",
    },
    {
        icon: AlertCircle,
        title: "Delivery Delays",
        content:
            "Unexpected situations such as bad weather, traffic, high order volume, store delays or other circumstances may affect delivery time. We appreciate your patience in such situations.",
    },
];

export default function ShippingPolicyPage() {
    return (
        <main className="bg-white text-gray-800">

            {/* HERO SECTION */}
            <section className="bg-emerald-50">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20 text-center">

                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                        <Truck size={34} className="text-emerald-600" />
                    </div>

                    <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mt-6">
                        QuickKart Delivery
                    </span>

                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-5">
                        Shipping <span className="text-emerald-600">Policy</span>
                    </h1>

                    <p className="text-gray-600 max-w-2xl mx-auto mt-5 leading-8">
                        Learn more about our delivery process, shipping
                        charges, order processing and delivery guidelines.
                        We aim to make your grocery shopping convenient.
                    </p>

                    <div className="flex justify-center items-center gap-2 mt-6 text-sm text-gray-500">
                        <Link href="/" className="hover:text-emerald-600">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-emerald-700 font-medium">
                            Shipping Policy
                        </span>
                    </div>
                </div>
            </section>

            {/* INTRODUCTION */}
            <section className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Introduction
                    </h2>

                    <p className="text-gray-600 leading-8 mt-4">
                        At QuickKart, we aim to provide a smooth and
                        convenient grocery delivery experience. Our
                        platform connects customers with nearby stores
                        so they can order everyday essentials online.
                        This Shipping Policy explains how orders are
                        processed and delivered through our platform.
                    </p>
                </div>
            </section>

            {/* SHIPPING DETAILS */}
            <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-16">
                <div className="text-center mb-12">
                    <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm">
                        Delivery Information
                    </span>

                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                        Our Shipping Guidelines
                    </h2>

                    <p className="text-gray-500 mt-4">
                        Everything you need to know about getting your
                        orders delivered.
                    </p>
                </div>

                <div className="space-y-6">
                    {shippingSections.map((section, index) => {
                        const Icon = section.icon;

                        return (
                            <div
                                key={index}
                                className="flex flex-col sm:flex-row gap-5 p-6 sm:p-7 border border-gray-100 rounded-2xl hover:border-emerald-200 hover:shadow-md transition"
                            >
                                <div className="w-14 h-14 shrink-0 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    <Icon
                                        size={27}
                                        className="text-emerald-600"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {index + 1}. {section.title}
                                    </h3>

                                    <p className="text-gray-600 mt-3 leading-8">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* IMPORTANT INFORMATION */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-5xl mx-auto px-5 sm:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Important Information
                        </h2>

                        <p className="text-gray-500 mt-3">
                            A few things to keep in mind when placing an order.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {[
                            {
                                title: "Correct Delivery Address",
                                content:
                                    "Please ensure that your delivery address and contact details are accurate when placing an order.",
                            },
                            {
                                title: "Availability of Products",
                                content:
                                    "Product availability may vary depending on the selected store and its current inventory.",
                            },
                            {
                                title: "Order Confirmation",
                                content:
                                    "Please review your order details carefully before completing the checkout process.",
                            },
                            {
                                title: "Customer Assistance",
                                content:
                                    "If you face any delivery-related issues, please contact our support team for assistance.",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-7 border border-gray-100"
                            >
                                <CheckCircle
                                    size={30}
                                    className="text-emerald-600"
                                />

                                <h3 className="font-bold text-lg mt-4">
                                    {item.title}
                                </h3>

                                <p className="text-gray-600 mt-3 leading-7">
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
                <div className="bg-emerald-600 rounded-3xl p-8 sm:p-12 text-center text-white">
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        Need Help With Your Delivery?
                    </h2>

                    <p className="text-emerald-50 mt-4 max-w-2xl mx-auto leading-8">
                        Have questions about your order or delivery?
                        Our team is here to help make your QuickKart
                        shopping experience better.
                    </p>

                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 mt-8 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3.5 rounded-xl font-bold transition"
                    >
                        Contact Us
                        <ArrowRight size={19} />
                    </Link>
                </div>
            </section>

            {/* FOOTER NOTE */}
            <section className="border-t border-gray-100 py-8">
                <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
                    <p className="text-sm text-gray-500">
                        QuickKart reserves the right to update this
                        Shipping Policy from time to time. Any changes
                        will be reflected on this page.
                    </p>

                    <p className="text-emerald-700 font-semibold mt-3">
                        QuickKart – Freshness at Your Doorstep.
                    </p>
                </div>
            </section>

        </main>
    );
}
