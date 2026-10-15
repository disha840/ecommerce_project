import React from 'react'

const UserDetail = () => {
    return (
        <div>

            {/* Heading */}
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h2 className='text-3xl font-bold text-[#713F50]'>
                        User Details
                    </h2>

                    <p className='text-sm text-[#A17B86] mt-2'>
                        View user information.
                    </p>
                </div>

                <button className='px-5 py-3 rounded-xl bg-[#96566A] text-white text-sm font-semibold hover:bg-[#713F50] transition'>
                    ← Back
                </button>
            </div>


            {/* Profile */}
            <div className='bg-white rounded-2xl border border-[#EBD9D9] shadow-sm p-6 mb-6'>

                <div className='flex items-center gap-5'>

                    <div className='w-20 h-20 rounded-full bg-[#96566A] text-white flex items-center justify-center text-2xl font-bold'>
                        D
                    </div>

                    <div>
                        <h3 className='text-2xl font-bold text-[#713F50]'>
                            Disha Gangwar
                        </h3>

                        <p className='text-[#A17B86] mt-1'>
                            disha@gmail.com
                        </p>

                        <span className='inline-block mt-2 px-3 py-1 rounded-full bg-[#F0DDE1] text-[#96566A] text-xs font-semibold'>
                            Active
                        </span>
                    </div>

                </div>

            </div>


            {/* Personal Information */}
            <div className='bg-white rounded-2xl border border-[#EBD9D9] shadow-sm p-6'>

                <h3 className='text-xl font-bold text-[#713F50] mb-6'>
                    Personal Information
                </h3>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>

                    <div>
                        <p className='text-xs text-[#A17B86] mb-1'>
                            Full Name
                        </p>
                        <p className='font-semibold text-[#713F50]'>
                            Disha Gangwar
                        </p>
                    </div>

                    <div>
                        <p className='text-xs text-[#A17B86] mb-1'>
                            Email
                        </p>
                        <p className='font-semibold text-[#713F50]'>
                            disha@gmail.com
                        </p>
                    </div>

                    <div>
                        <p className='text-xs text-[#A17B86] mb-1'>
                            Phone Number
                        </p>
                        <p className='font-semibold text-[#713F50]'>
                            +91 9876543210
                        </p>
                    </div>

                    <div>
                        <p className='text-xs text-[#A17B86] mb-1'>
                            Age
                        </p>
                        <p className='font-semibold text-[#713F50]'>
                            22
                        </p>
                    </div>

                    <div>
                        <p className='text-xs text-[#A17B86] mb-1'>
                            Gender
                        </p>
                        <p className='font-semibold text-[#713F50]'>
                            Female
                        </p>
                    </div>

                    <div>
                        <p className='text-xs text-[#A17B86] mb-1'>
                            Role
                        </p>
                        <p className='font-semibold text-[#713F50]'>
                            User
                        </p>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default UserDetail