import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const VeryfyOtp = () => {
    const location=useLocation();
    const navigate=useNavigate()
    const [loading,setLoading]=useState(false);

    const [timer,setTimer]=useState(20*60);
    const [otp,setOtp]=useState("");

    function inputHandler(e,idx){
        const value=[...otp];
        value[idx]=e.target.value;
        const val=value.join("")
        setOtp(val)
    }
    
    useEffect(()=>{
        const t=setInterval(() => {
            setTimer(prev => {
                if(prev<=0){
                    clearInterval(t)
                    return 0;
                }
                return prev-1
            })   
        }, 1000);

        return()=>{
            clearInterval(t);
        }
    },[])

    async function submitHandler(e){
        e.preventDefault();
console.log(otp)
       try{
        setLoading(true)
         const response=await axios.post(
            "http://localhost:3000/admin/verifyotp",
            {
                email:location?.state?.email,
                otp:otp
            }
        );
        setLoading(false)
        toast.success("otp verified")

        navigate("/resetpassword",{state:{email:response.data.email}})   
       }
       catch(error){
        setLoading(false)
        toast.error("Invalid OTP. Please enter the correct OTP.");
        console.log(error)
       }
    }

    async function resendOtp() {
        setTimer(20 * 60);

        try {
            const response = await axios.post(
                "http://localhost:3000/resendotp",
                { email: location?.state?.email }
            );

            console.log(response.data);
        } catch (error) {
            console.log(error.response?.data);
        }
    }

    return (
        <>
          {loading && <Loader/>}
            <div className='min-h-screen w-full flex justify-center items-center bg-[#96566A]/30 px-4 py-8'>

                <div className='w-full max-w-5xl flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl'>

                    {/* Left Side */}
                    <div className='hidden md:flex flex-1 bg-[#96566A] text-[#FFF9F6] flex-col justify-center px-12 lg:px-16 py-16'>

                        <div className='text-4xl lg:text-5xl font-bold leading-tight'>
                            Verify your account
                        </div>

                        <p className='mt-5 text-[#F0DDE1] text-sm leading-6 max-w-sm'>
                            We have sent a verification code to your email.
                            Enter the OTP to continue.
                        </p>

                    </div>


                    {/* Right Side */}
                    <form
                        className='w-full md:flex-1 bg-[#F0DDE1] px-7 sm:px-10 lg:px-14 py-16 flex flex-col justify-center'
                        onSubmit={submitHandler}
                    >

                        <div className='flex flex-col gap-8 w-full'>

                            <div className='text-4xl font-semibold text-[#713F50] text-center'>
                                Verify OTP
                            </div>

                            <p className='text-sm text-[#A17B86] text-center'>
                                Enter the 4-digit OTP sent to your email
                            </p>


                            <div className='flex justify-center gap-3 sm:gap-4'>

                                <input
                                    type='text'
                                    inputMode='numeric'
                                    maxLength={1}
                                    className='border border-[#EBD9D9] p-2.5 bg-[#FFF9F6] text-[#713F50] rounded-xl text-center text-lg w-12 h-12 outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20'
                                    onChange={(e)=>inputHandler(e,0)}
                                />

                                <input
                                    type='text'
                                    inputMode='numeric'
                                    maxLength={1}
                                    className='border border-[#EBD9D9] p-2.5 bg-[#FFF9F6] text-[#713F50] rounded-xl text-center text-lg w-12 h-12 outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20'
                                    onChange={(e)=>inputHandler(e,1)}
                                />

                                <input
                                    type='text'
                                    inputMode='numeric'
                                    maxLength={1}
                                    className='border border-[#EBD9D9] p-2.5 bg-[#FFF9F6] text-[#713F50] rounded-xl text-center text-lg w-12 h-12 outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20'
                                    onChange={(e)=>inputHandler(e,2)}
                                />

                                <input
                                    type='text'
                                    inputMode='numeric'
                                    maxLength={1}
                                    className='border border-[#EBD9D9] p-2.5 bg-[#FFF9F6] text-[#713F50] rounded-xl text-center text-lg w-12 h-12 outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20'
                                    onChange={(e)=>inputHandler(e,3)}
                                />

                            </div>


                            <div className='text-center text-sm font-semibold text-[#96566A]'>
                                {Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}
                            </div>


                            <button
                                className='font-semibold text-white w-full py-3 rounded-xl bg-[#96566A] text-sm hover:bg-[#713F50] transition'
                            >
                                Verify OTP
                            </button>


                            <div className='text-center text-sm text-[#A17B86]'>
                                Don't receive the code?

                                <button
                                    type='button'
                                    onClick={resendOtp}
                                    className='ml-1 font-semibold text-[#96566A] hover:underline'
                                >
                                    Resend OTP
                                </button>
                            </div>

                        </div>

                    </form>

                </div>

            </div>
        </>
    )
}

export default VeryfyOtp