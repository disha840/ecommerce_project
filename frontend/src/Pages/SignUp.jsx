import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';

import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState({});

  function inputHandler(e) {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  }


  function errorHandler() {

    const obj = {};

    if (!form.firstName) {
      obj.firstName = "please enter your first name"
    }

    else if (!form.lastName) {
      obj.lastName = "please enter your last name"
    }

    else if (!form.email) {
      obj.email = "please enter your email"
    }

    else if (
      (!form.email.includes("@")) ||
      (!form.email.includes("."))
    ) {
      obj.email = "enter a valid email"
    }

    else if (!form.password) {
      obj.password = "please enter your password"
    }

    else if (form.password.length < 6) {
      obj.password = "password must be greater than 6"
    }

    else if (
      (!/[A-Z]/.test(form.password)) ||
      (!/[a-z]/.test(form.password)) ||
      (!/[0-9]/.test(form.password))
    ) {
      obj.password =
        "password must contain atleast one uppercase one lowercase and one number "
    }

    else if (!form.confirmPassword) {
      obj.confirmPassword = "confirm your password"
    }

    else if (form.password != form.confirmPassword) {
      obj.confirmPassword = "Passwords do not match"
    }

    return obj;
  }


  async function submitHandler(e) {

    e.preventDefault();

    const errors = errorHandler();

    const {
      firstName,
      lastName,
      email,
      password
    } = form;


    if (Object.keys(errors).length == 0) {

      try {

        setLoading(true);

        const response = await axios.post(
          "http://localhost:3000/admin/signup",
          {
            firstName,
            lastName,
            email,
            password
          }
        );

        setLoading(false);

        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: ""
        });

        toast.success("user created successfully");

        navigate('/login');

        console.log(response);

      }

      catch (err) {

        setLoading(false);

        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: ""
        });

        toast.error(
          err.response?.data?.message || "something went wrong"
        );

        console.log(err);

      }
    }

    setError({
      ...errors
    });
  }


  return (
    <>

      {loading && <Loader />}

      <div
        className='min-h-screen w-full flex justify-center items-center
        bg-[#713F50] p-6'
      >

        <div
          className='w-full max-w-5xl min-h-[85vh]
          flex rounded-3xl overflow-hidden
          shadow-2xl'
        >

          {/* LEFT SECTION */}

          <div
            className='hidden md:flex w-1/2
            bg-[#96566A]
            text-[#FFF9F6]
            flex-col justify-center
            px-12 lg:px-16
            relative overflow-hidden'
          >

            {/* Decorative circle */}

            <div
              className='absolute -top-24 -right-24
              w-72 h-72 rounded-full
              bg-[#F0DDE1]/10'
            >
            </div>

            <div
              className='absolute -bottom-32 -left-24
              w-80 h-80 rounded-full
              bg-[#F0DDE1]/10'
            >
            </div>


            <div className='relative z-10'>

              <p
                className='text-sm uppercase tracking-[0.3em]
                text-[#F0DDE1] mb-6'
              >
                Welcome
              </p>

              <h1
                className='text-5xl lg:text-6xl
                font-bold leading-tight'
              >
                Create your
                <br />
                account.
              </h1>

              <p
                className='mt-7 max-w-sm
                text-sm leading-6
                text-[#FFF9F6]/70'
              >
                Join us and get started with your
                personal account. Create your profile
                and explore everything in one place.
              </p>


              <div className='mt-10 flex items-center gap-2'>

                <div
                  className='w-12 h-1
                  rounded-full bg-[#F0DDE1]'
                >
                </div>

                <div
                  className='w-2 h-1
                  rounded-full bg-[#F0DDE1]/60'
                >
                </div>

                <div
                  className='w-2 h-1
                  rounded-full bg-[#F0DDE1]/30'
                >
                </div>

              </div>

            </div>

          </div>


          {/* RIGHT FORM SECTION */}

          <form
            className='w-full md:w-1/2
            bg-[#F0DDE1]
            px-8 sm:px-12 lg:px-14
            py-10
            flex flex-col justify-center'
            onSubmit={submitHandler}
          >

            {/* Heading */}

            <div className='mb-8'>

              <p
                className='text-xs uppercase
                tracking-[0.25em]
                text-[#A17B86] mb-2'
              >
                Get Started
              </p>

              <div
                className='text-4xl font-bold
                text-[#713F50]'
              >
                Register
              </div>

              <p className='text-xs text-[#A17B86] mt-2'>
                Create your account to continue
              </p>

            </div>


            {/* INPUTS */}

            <div className='flex flex-col gap-5 w-full'>


              {/* FIRST NAME */}

              <label>

                <input
                  type="text"
                  placeholder='First Name'
                  name='firstName'
                  value={form.firstName}
                  className='w-full
                  px-4 py-3
                  rounded-xl
                  border border-[#EBD9D9]
                  bg-[#FFF9F6]
                  text-sm text-[#713F50]
                  placeholder-[#AD9299]
                  outline-none
                  transition
                  focus:border-[#B77B8C]
                  focus:ring-2
                  focus:ring-[#96566A]/20'
                  onChange={inputHandler}
                />

                {error.firstName &&
                  <p className='text-[#B65D70] text-xs mt-1'>
                    {error.firstName}
                  </p>
                }

              </label>


              {/* LAST NAME */}

              <label>

                <input
                  type="text"
                  placeholder='Last Name'
                  name='lastName'
                  value={form.lastName}
                  className='w-full
                  px-4 py-3
                  rounded-xl
                  border border-[#EBD9D9]
                  bg-[#FFF9F6]
                  text-sm text-[#713F50]
                  placeholder-[#AD9299]
                  outline-none
                  transition
                  focus:border-[#B77B8C]
                  focus:ring-2
                  focus:ring-[#96566A]/20'
                  onChange={inputHandler}
                />

                {error.lastName &&
                  <p className='text-[#B65D70] text-xs mt-1'>
                    {error.lastName}
                  </p>
                }

              </label>


              {/* EMAIL */}

              <label>

                <input
                  type="email"
                  placeholder='Email'
                  name='email'
                  value={form.email}
                  className='w-full
                  px-4 py-3
                  rounded-xl
                  border border-[#EBD9D9]
                  bg-[#FFF9F6]
                  text-sm text-[#713F50]
                  placeholder-[#AD9299]
                  outline-none
                  transition
                  focus:border-[#B77B8C]
                  focus:ring-2
                  focus:ring-[#96566A]/20'
                  onChange={inputHandler}
                />

                {error.email &&
                  <p className='text-[#B65D70] text-xs mt-1'>
                    {error.email}
                  </p>
                }

              </label>


              {/* PASSWORD */}

              <label>

                <input
                  type='password'
                  placeholder='Password'
                  name='password'
                  value={form.password}
                  className='w-full
                  px-4 py-3
                  rounded-xl
                  border border-[#EBD9D9]
                  bg-[#FFF9F6]
                  text-sm text-[#713F50]
                  placeholder-[#AD9299]
                  outline-none
                  transition
                  focus:border-[#B77B8C]
                  focus:ring-2
                  focus:ring-[#96566A]/20'
                  onChange={inputHandler}
                />

                {error.password &&
                  <p className='text-[#B65D70] text-xs mt-1'>
                    {error.password}
                  </p>
                }

              </label>


              {/* CONFIRM PASSWORD */}

              <label>

                <input
                  type='password'
                  placeholder='Confirm Password'
                  name='confirmPassword'
                  value={form.confirmPassword}
                  className='w-full
                  px-4 py-3
                  rounded-xl
                  border border-[#EBD9D9]
                  bg-[#FFF9F6]
                  text-sm text-[#713F50]
                  placeholder-[#AD9299]
                  outline-none
                  transition
                  focus:border-[#B77B8C]
                  focus:ring-2
                  focus:ring-[#96566A]/20'
                  onChange={inputHandler}
                />

                {error.confirmPassword &&
                  <p className='text-[#B65D70] text-xs mt-1'>
                    {error.confirmPassword}
                  </p>
                }

              </label>

            </div>


            {/* BUTTON */}

            <button
              type='submit'
              className='font-semibold
              text-white
              w-full
              py-3
              mt-7
              rounded-xl
              bg-[#96566A]
              text-sm
              shadow-lg
              transition-all
              duration-200
              hover:bg-[#713F50]
              hover:shadow-xl
              active:scale-[0.98]'
            >

              {loading
                ?
                <p>Signing...</p>
                :
                <p>Sign Up</p>
              }

            </button>


            {/* LOGIN */}

            <p
              className='text-center text-xs
              text-[#A17B86] mt-6'
            >

              Already have an account?

              <button
                type='button'
                onClick={() => navigate('/login')}
                className='ml-1 font-semibold
                text-[#96566A]
                hover:underline'
              >
                Login
              </button>

            </p>

          </form>

        </div>

      </div>

    </>
  )
}

export default SignUp