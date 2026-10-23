import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const ForgotPassw = () => {
     const [loading,setLoading]=useState(false);
    const navigate=useNavigate()
    const [email,setEmail]=useState("");
 const [error,setError]=useState({})

    function errorHandler(){
    const obj={};
    
    if(!email){
      obj.email="please enter your email"
    }
    else if((!email.includes("@"))||(!email.includes("."))){
      obj.email="enter a valid email"
    }
  
    return obj;
  }

    async function submitHandler(e){
        e.preventDefault();
        const errors=errorHandler();
if(Object.keys(errors).length==0){
        try{
             setLoading(true)
            const response=await axios.post(
            "http://localhost:3000/admin/generateotp",
            {email:email}
        );
         setLoading(false)
         toast.success("otp sent sucessfully")

        navigate("/verifyotp",{state:{email:response.data.email}})
        }
        catch(error){
             setLoading(false)
             
             toast.error("Failed to send OTP. Please try again.");
            console.log(error)
        }
    }
     setError({...errors})
    }

    function backLogin(){
        navigate("/login")
    }
     
    return (
        <>
         {loading && <Loader/>}

            <div className='min-h-screen w-full flex justify-center items-center bg-[#96566A]/30 px-4 py-8'>

                <div className='w-full max-w-5xl flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl'>

                    {/* Left Side */}
                    <div className='hidden md:flex flex-1 bg-[#96566A] text-[#FFF9F6] flex-col justify-center px-12 lg:px-16 py-16'>

                        <div className='text-4xl lg:text-5xl font-bold leading-tight'>
                            Forgot your password?
                        </div>

                        <p className='mt-5 text-[#F0DDE1] text-sm leading-6 max-w-sm'>
                            Don't worry! Enter your registered email and we will
                            send you an OTP to reset your password.
                        </p>

                    </div>


                    {/* Right Side */}
                    <form
                        className='w-full md:flex-1 bg-[#F0DDE1] px-7 sm:px-10 lg:px-14 py-16 flex flex-col justify-center'
                        onSubmit={submitHandler}
                    >

                        <div className='flex flex-col gap-8 w-full'>

                            <div className='text-4xl font-semibold text-[#713F50] text-center'>
                                Forgot Password
                            </div>

                            <p className='text-sm text-[#A17B86] text-center'>
                                Enter your email to receive an OTP
                            </p>
                            <label>

                            <input
                                type="email"
                                placeholder='Email'
                                className='border border-[#EBD9D9] w-full px-4 py-3 bg-[#FFF9F6] text-[#713F50] placeholder:text-[#AD9299] rounded-xl text-sm outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20'
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                            {error.email &&
                  <p className='text-[#B65D70] text-xs mt-1'>
                    {error.email}
                  </p>
                }
                            </label>

                            <button
                                className='font-semibold text-white w-full py-3 rounded-xl bg-[#96566A] text-sm hover:bg-[#713F50] transition'
                            >
                                Send OTP
                            </button>

                            <button
                                type='button'
                                onClick={backLogin}
                                className='text-sm font-semibold text-[#96566A] hover:underline'
                            >
                                Back to Login
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        </>
    )
}

export default ForgotPassw