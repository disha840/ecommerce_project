import React from 'react'
import { useNavigate } from 'react-router-dom'

const Main = () => {

    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-linear-to-br from-[#FFF9F6] via-[#F7E9E9] to-[#F0DDE1] flex items-center justify-center">

            {/* Background decoration */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#96566A]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#B65D70]/20 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F0DDE1]/60 blur-3xl" />

            <div className="relative bg-white/80 backdrop-blur-sm border border-[#EBD9D9] w-[90%] max-w-5xl min-h-140 rounded-3xl shadow-[0_8px_30px_rgba(113,63,80,0.15)] flex flex-col justify-center items-center text-center p-10">

                {/* Logo */}
                <div className="w-16 h-16 rounded-2xl bg-[#F0DDE1] text-[#96566A] flex items-center justify-center font-bold text-2xl mb-4 shadow-sm">
                    M
                </div>

                <p className="text-[11px] tracking-[4px] font-medium text-[#96566A] mb-6">
                    MYSTORE
                </p>

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl font-bold text-[#713F50] mb-5 leading-tight">
                    Welcome to <span className="text-[#96566A]">Our Website</span>
                </h1>

                <p className="text-[#A17B86] text-lg max-w-xl mb-10 leading-7">
                    Create your account or login to continue.
                    Manage everything easily from your account.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

                    <button
                        onClick={() => navigate("/login")}
                        className="px-10 py-3 rounded-xl bg-[#96566A] text-white font-semibold shadow-md shadow-[#96566A]/30 hover:bg-[#713F50] hover:-translate-y-0.5 transition"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate("/signup")}
                        className="px-10 py-3 rounded-xl border-2 border-[#96566A] text-[#96566A] font-semibold hover:bg-[#96566A] hover:text-white hover:-translate-y-0.5 transition"
                    >
                        Signup
                    </button>

                </div>

            </div>

        </div>
    )
}

export default Main