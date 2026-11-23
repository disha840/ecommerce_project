
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/page";
import Provider from "@/redux/provider";
import Footer from "@/components/Footer/page";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "QuickKart",
    description: "Your online shopping destination",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col" suppressHydrationWarning>
                <Provider>
                    <Suspense fallback={<div>Loading Navbar...</div>}>
                        <Navbar />
                    </Suspense>

                    <main className="flex-1">
                        {children}
                    </main>

                    <Footer />

                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: "#065f46",
                                color: "#fff",
                                borderRadius: "10px",
                                padding: "14px 20px",
                            },
                        }}
                    />
                </Provider>
            </body>
        </html>
    );
}
