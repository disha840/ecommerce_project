
"use client";

import { useState } from "react";
import Link from "next/link";

import {
    Mail,
    Phone,
    MapPin,
    Clock,
    MessageCircle,
    Headphones,
    ArrowRight,
    ChevronDown,
} from "lucide-react";


const contactDetails = [
    {
        icon: Mail,
        title: "Email Us",
        value: "support@quickkart.com",
        description: "Send us your queries anytime.",
    },
    {
        icon: Phone,
        title: "Call Us",
        value: "+91 98765 43210",
        description: "We're here to help you.",
    },
    {
        icon: MapPin,
        title: "Our Location",
        value: "India",
        description: "Serving customers through nearby stores.",
    },
    {
        icon: Clock,
        title: "Working Hours",
        value: "Monday - Saturday",
        description: "9:00 AM - 6:00 PM",
    },
];


const faqs = [
    {
        question: "How can I place an order on QuickKart?",
        answer:
            "Simply select your delivery location, browse available products, add your favourite items to the cart and proceed to checkout.",
    },
    {
        question: "How can I track my order?",
        answer:
            "You can check your order status from the My Orders section of your account.",
    },
    {
        question: "What should I do if I receive a wrong or damaged product?",
        answer:
            "Please contact our support team with your order details so we can assist you.",
    },
    {
        question: "How can I contact QuickKart support?",
        answer:
            "You can reach us using the contact details provided on this page.",
    },
];


export default function ContactPage() {

    const [openFaq, setOpenFaq] = useState(0);

    return (
        <main className="bg-white text-gray-800">

            {/* HERO SECTION */}
            <section className="bg-emerald-50 relative overflow-hidden">

                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20 text-center">

                    <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                        We'd Love to Hear From You
                    </span>

                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-6">
                        Get in{" "}
                        <span className="text-emerald-600">
                            Touch
                        </span>
                    </h1>

                    <p className="text-gray-600 max-w-2xl mx-auto mt-5 leading-8">
                        Have a question, suggestion or need assistance?
                        Our team is always happy to help you.
                        Contact QuickKart and let us know how we can help.
                    </p>

                    <div className="flex justify-center items-center gap-2 mt-6 text-sm text-gray-500">

                        <Link
                            href="/"
                            className="hover:text-emerald-600"
                        >
                            Home
                        </Link>

                        <span>/</span>

                        <span className="text-emerald-700 font-medium">
                            Contact Us
                        </span>

                    </div>

                </div>
            </section>


            {/* CONTACT INFORMATION */}
            <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {contactDetails.map((item, index) => {

                        const Icon = item.icon;

                        return (
                            <div
                                key={index}
                                className="border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg hover:border-emerald-200 transition"
                            >

                                <div className="w-14 h-14 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center">

                                    <Icon
                                        size={27}
                                        className="text-emerald-600"
                                    />

                                </div>

                                <h3 className="font-bold text-lg mt-5 text-gray-900">
                                    {item.title}
                                </h3>

                                <p className="text-emerald-700 font-semibold mt-2 break-words">
                                    {item.value}
                                </p>

                                <p className="text-gray-500 text-sm mt-2">
                                    {item.description}
                                </p>

                            </div>
                        );

                    })}

                </div>

            </section>


            {/* CONTACT SUPPORT SECTION */}
            <section className="bg-gray-50 py-16">

                <div className="max-w-7xl mx-auto px-5 sm:px-8">

                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* LEFT CONTENT */}
                        <div>

                            <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm">
                                Contact Our Team
                            </span>

                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 leading-tight">
                                Let's Start a Conversation
                            </h2>

                            <p className="text-gray-600 mt-5 leading-8">
                                Your feedback matters to us. Whether you have
                                questions about an order, need help with our
                                platform or simply want to share your
                                suggestions, we're here to listen.
                            </p>

                            <div className="mt-9 space-y-6">

                                <div className="flex gap-4 items-start">

                                    <div className="bg-emerald-100 p-3 rounded-xl">
                                        <Headphones className="text-emerald-600" />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            Customer Support
                                        </h3>

                                        <p className="text-gray-500 text-sm mt-1">
                                            We're happy to help resolve your queries.
                                        </p>
                                    </div>

                                </div>


                                <div className="flex gap-4 items-start">

                                    <div className="bg-emerald-100 p-3 rounded-xl">
                                        <MessageCircle className="text-emerald-600" />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            Your Feedback Matters
                                        </h3>

                                        <p className="text-gray-500 text-sm mt-1">
                                            Help us improve your shopping experience.
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* STATIC CONTACT CARD */}
                        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100">

                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">

                                <MessageCircle
                                    size={32}
                                    className="text-emerald-600"
                                />

                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6">
                                We're Here to Help!
                            </h3>

                            <p className="text-gray-600 mt-4 leading-8">
                                Have questions about your orders or shopping
                                experience? Get in touch with our team using
                                the contact information provided on this page.
                            </p>

                            <div className="mt-7 flex items-center gap-3 text-emerald-700 font-semibold">

                                <Mail size={20} />

                                Contact QuickKart Support

                            </div>

                            <p className="text-sm text-gray-500 mt-3">
                                Your satisfaction is important to us.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* FAQ SECTION */}
            <section className="max-w-4xl mx-auto px-5 sm:px-8 py-20">

                <div className="text-center mb-12">

                    <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm">
                        FAQs
                    </span>

                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                        Frequently Asked Questions
                    </h2>

                    <p className="text-gray-500 mt-4">
                        Find answers to some common questions.
                    </p>

                </div>


                <div className="space-y-4">

                    {faqs.map((faq, index) => (

                        <div
                            key={index}
                            className="border border-gray-200 rounded-2xl overflow-hidden"
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setOpenFaq(
                                        openFaq === index ? -1 : index
                                    )
                                }
                                className="w-full flex justify-between items-center gap-4 text-left p-5 sm:p-6 hover:bg-emerald-50 transition"
                            >

                                <span className="font-semibold text-gray-900">
                                    {faq.question}
                                </span>

                                <ChevronDown
                                    size={20}
                                    className={`text-emerald-600 shrink-0 transition-transform ${
                                        openFaq === index
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />

                            </button>


                            {openFaq === index && (

                                <div className="px-5 sm:px-6 pb-6 text-gray-600 leading-7">
                                    {faq.answer}
                                </div>

                            )}

                        </div>

                    ))}

                </div>

            </section>


            {/* BOTTOM CTA */}
            <section className="bg-emerald-600 px-5 py-16 text-center text-white">

                <div className="max-w-3xl mx-auto">

                    <h2 className="text-3xl sm:text-4xl font-bold">
                        Need Help With Your Shopping?
                    </h2>

                    <p className="text-emerald-50 mt-4 leading-7">
                        QuickKart is here to make your everyday shopping
                        easier and more convenient.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mt-8 bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3.5 rounded-xl font-bold transition"
                    >
                        Start Shopping

                        <ArrowRight size={19} />

                    </Link>

                </div>

            </section>

        </main>
    );
}
