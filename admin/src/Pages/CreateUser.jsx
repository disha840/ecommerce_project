import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const CreateUser = () => {
    const [formData,setFormData]=useState({})
    const navigate=useNavigate()
    function inputHander(e){
        const {name,value}=e.target;
        setFormData({...formData,
            [name]:value
        })
    }
   async function submitHandler(e){
        e.preventDefault()
        try{
            const response=await axios.post("http://localhost:3000/api/createuser",formData);
            console.log(response)
            navigate("/dashboard")
        }catch(error){
            console.log(error)
        }

    }

    return (
        <div className='min-h-screen bg-[#FFF9F6] flex flex-col'>
            {/* Header */}
            <header className='bg-[#FFF9F6] text-[#713F50] px-6 py-4 flex items-center justify-between border-b border-[#EBD9D9] shadow-sm'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl bg-[#F0DDE1] text-[#96566A] flex items-center justify-center font-bold text-lg'>
                        M
                    </div>
                    <h1 className='text-xl font-bold'>
                        MyStore
                    </h1>
                </div>
                <div className='flex items-center gap-3'>

                    <div className='hidden sm:block text-right'>
                        <p className='text-sm font-semibold'>
                            Disha
                        </p>

                        <p className='text-xs text-[#A17B86]'>
                            Admin
                        </p>
                    </div>

                    <div className='w-10 h-10 rounded-full bg-[#96566A] text-white flex items-center justify-center font-bold'>
                        D
                    </div>
                </div>
            </header>
            {/* Body */}
            <div className='flex flex-1'>

                {/* Sidebar */}
                <aside className='hidden md:block w-64 bg-white text-[#713F50] p-5 border-r border-[#EBD9D9]'>

                    <div className='mb-6'>
                        <p className='text-xs uppercase tracking-wider text-[#A17B86]'>
                            Main Menu
                        </p>
                    </div>
                    <nav className='flex flex-col gap-2'>

                        <div className='px-4 py-3 rounded-xl hover:bg-[#F7E9E9] transition cursor-pointer'>
                            Dashboard
                        </div>

                        <div className='px-4 py-3 rounded-xl bg-[#F0DDE1] text-[#96566A] font-semibold cursor-pointer'>
                            User
                        </div>

                        <div className='px-4 py-3 rounded-xl hover:bg-[#F7E9E9] transition cursor-pointer'>
                            Store
                        </div>

                        <div className='px-4 py-3 rounded-xl hover:bg-[#F7E9E9] transition cursor-pointer'>
                            Category
                        </div>

                        <div className='px-4 py-3 rounded-xl hover:bg-[#F7E9E9] transition cursor-pointer'>
                            Subcategory
                        </div>

                        <div className='px-4 py-3 rounded-xl hover:bg-[#F7E9E9] transition cursor-pointer'>
                            Inventory
                        </div>

                        <div className='px-4 py-3 rounded-xl hover:bg-[#F7E9E9] transition cursor-pointer'>
                            Product
                        </div>
                    </nav>

                </aside>


                {/* Main */}
                <main className='flex-1 p-6 md:p-8'>

                    <div className='max-w-3xl mx-auto'>

                        {/* Heading */}
                        <div className='mb-8'>

                            <h2 className='text-3xl font-bold text-[#713F50]'>
                                Create User
                            </h2>

                            <p className='text-sm text-[#A17B86] mt-2'>
                                Add a new user to your store.
                            </p>

                        </div>


                        {/* Form Card */}
                        <div className='bg-white rounded-3xl shadow-sm border border-[#EBD9D9] p-6 sm:p-8'>
                            <form className='flex flex-col gap-6' onSubmit={submitHandler}>
                                {/* Name */}
                                <div>

                                    <label className='block text-sm font-semibold text-[#713F50] mb-2'>
                                        Name
                                    </label>

                                    <input
                                        type='text' name='name'
                                        placeholder='Enter user name'
                                        className='w-full px-4 py-3 rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] text-[#713F50] placeholder:text-[#AD9299] outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20' onChange={inputHander}
                                    />
                                </div>
                                {/* Email */}
                                <div>
                                    <label className='block text-sm font-semibold text-[#713F50] mb-2'>
                                        Email
                                    </label>
                                    <input
                                        type='email' name='email'
                                        placeholder='Enter email address'
                                        className='w-full px-4 py-3 rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] text-[#713F50] placeholder:text-[#AD9299] outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20' onChange={inputHander}
                                    />
                                </div>
                                {/* Age + Gender */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                    {/* Age */}
                                    <div>
                                        <label className='block text-sm font-semibold text-[#713F50] mb-2'>
                                            Age
                                        </label>
                                        <input
                                            type='number' name='age'
                                            placeholder='Enter age'
                                            className='w-full px-4 py-3 rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] text-[#713F50] placeholder:text-[#AD9299] outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20' onChange={inputHander}
                                        />
                                    </div>
                                    {/* Gender */}
                                    <div>
                                        <label className='block text-sm font-semibold text-[#713F50] mb-2'>
                                            Gender
                                        </label>
                                        <select
                                            className='w-full px-4 py-3 rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] text-[#713F50] outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20' onChange={inputHander} name='gender'
                                        >
                                            <option value=''>
                                                Select gender
                                            </option>

                                            <option value='male'>
                                                Male
                                            </option>

                                            <option value='female'>
                                                Female
                                            </option>

                                            <option value='other'>
                                                Other
                                            </option>

                                        </select>
                                    </div>
                                </div>
                                {/* Status */}
                                <div>

                                    <label className='block text-sm font-semibold text-[#713F50] mb-2'>
                                        Status
                                    </label>

                                    <select
                                        className='w-full px-4 py-3 rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] text-[#713F50] outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20' onChange={inputHander} name='status'
                                    >

                                        <option value=''>
                                            Select status
                                        </option>

                                        <option value='active'>
                                            Active
                                        </option>

                                        <option value='inactive'>
                                            Inactive
                                        </option>

                                    </select>

                                </div>


                                {/* Buttons */}
                                <div className='flex flex-col sm:flex-row gap-3 pt-3'>

                                    <button
                                        type='submit'
                                        className='flex-1 py-3 rounded-xl bg-[#96566A] text-white font-semibold text-sm hover:bg-[#713F50] transition'
                                    >
                                        Create User
                                    </button>

                                    <button
                                        type='button'
                                        className='flex-1 py-3 rounded-xl border-2 border-[#96566A] text-[#96566A] font-semibold text-sm hover:bg-[#96566A] hover:text-white transition'
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </main>

            </div>


            {/* Footer */}
            <footer className='bg-[#FFF9F6] text-[#A17B86] text-center py-4 text-sm border-t border-[#EBD9D9]'>
                © 2026 MyStore. All rights reserved.
            </footer>

        </div>
    )
}

export default CreateUser