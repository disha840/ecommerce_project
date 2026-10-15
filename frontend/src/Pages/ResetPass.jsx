import React, { useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
const ResetPass = () => {
  const [loading,setLoading]=useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState({});

    const location = useLocation();
    const navigate = useNavigate();

    function inputHandler(e) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    function errorHandler() {
        const obj = {};

        if (!formData.password) {
            obj.password = "please enter your password";
        }
        else if (formData.password.length < 6) {
            obj.password = "password must be greater than 6";
        }
        else if (
            (!/[A-Z]/.test(formData.password)) ||
            (!/[a-z]/.test(formData.password)) ||
            (!/[0-9]/.test(formData.password))
        ) {
            obj.password = "password must contain atleast one uppercase one lowercase and one number";
        }

        else if (!formData.confirmPassword) {
            obj.confirmPassword = "confirm your password";
        }
        else if (formData.password != formData.confirmPassword) {
            obj.confirmPassword = "Passwords do not match";
        }

        return obj;
    }

    async function submitHandler(e) {
        e.preventDefault();

        const errors = errorHandler();

        if (Object.keys(errors).length == 0) {

            try {
                setLoading(true)
                const response = await axios.post(
                    "http://localhost:3000/admin/changepassword",
                    {
                        email: location?.state?.email,
                        password: formData.password
                    }
                );
                setLoading(false)
                toast.success("Password reset successfully.");

                setFormData({
                    password: "",
                    confirmPassword: ""
                });

                navigate("/login", {
                    state: { email: response.data.email }
                });

            }
            catch (err) {
                setLoading(false)
                toast.error("Failed to reset password. Please try again.");
                console.log(err);
            }
        }

        setError(errors);
    }

    return (
        <>
          {loading && <Loader/>}
            <div className='h-screen w-screen flex justify-center items-center bg-[#96566A]/30 px-4'>

                <div className='w-full max-w-5xl flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl'>

                    {/* Left Side */}
                    <div className='hidden md:flex flex-1 bg-[#96566A] text-[#FFF9F6] flex-col justify-center px-12 lg:px-16'>

                        <div className='text-4xl lg:text-5xl font-bold leading-tight'>
                            Create a new password
                        </div>

                        <p className='mt-5 text-[#F0DDE1] text-sm leading-6 max-w-sm'>
                            Choose a strong password for your account and
                            make sure you remember it.
                        </p>

                    </div>


                    {/* Right Side */}
                    <form
                        className='w-full md:flex-1 bg-[#F0DDE1] px-7 sm:px-10 lg:px-14 py-16 flex flex-col justify-center'
                        onSubmit={submitHandler}
                    >

                        <div className='flex flex-col gap-6 w-full'>

                            <div className='text-4xl font-semibold text-[#713F50] text-center'>
                                Reset Password
                            </div>

                            <p className='text-sm text-[#A17B86] text-center'>
                                Enter your new password below
                            </p>


                            {/* Password */}
                            <label>
                                <input
                                    type='password'
                                    value={formData.password}
                                    placeholder='Password'
                                    className='border border-[#EBD9D9] w-full px-4 py-3 bg-[#FFF9F6] text-[#713F50] placeholder:text-[#AD9299] rounded-xl text-sm outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20'
                                    name="password"
                                    onChange={inputHandler}
                                />

                                {error.password &&
                                    <p className='text-[#B65D70] text-xs mt-1'>
                                        {error.password}
                                    </p>
                                }
                            </label>


                            {/* Confirm Password */}
                            <label>
                                <input
                                    type='password'
                                    value={formData.confirmPassword}
                                    placeholder='Confirm Password'
                                    className='border border-[#EBD9D9] w-full px-4 py-3 bg-[#FFF9F6] text-[#713F50] placeholder:text-[#AD9299] rounded-xl text-sm outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20'
                                    name="confirmPassword"
                                    onChange={inputHandler}
                                />

                                {error.confirmPassword &&
                                    <p className='text-[#B65D70] text-xs mt-1'>
                                        {error.confirmPassword}
                                    </p>
                                }
                            </label>


                            {/* Button */}
                            <button className='font-semibold text-white w-full py-3 rounded-xl bg-[#96566A] text-sm hover:bg-[#713F50] transition'>
                                Reset Password
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        </>
    )
}

export default ResetPass