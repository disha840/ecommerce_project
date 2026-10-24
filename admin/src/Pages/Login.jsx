import React, { useState } from 'react'
import { Link, useNavigate,Navigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { setUser } from '../redux/Slices/authSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";


const Login = () => {
   const user = useSelector((store)=>store.auth.user)
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState({})
  const [form,setForm]=useState({email:"",password:""});
  const navigate=useNavigate()
const dispatch = useDispatch()
  function inputHandler(e){
    const {name,value}=e.target;
    setForm({...form,
      [name]:value
    })
  }

  function errorHandler(){
    const obj={};
    
    if(!form.email){
      obj.email="please enter your email"
    }
    else if((!form.email.includes("@"))||(!form.email.includes("."))){
      obj.email="enter a valid email"
    }

    else if(!form.password){
     obj.password="please enter your password"
    }
    else if(form.password.length<6){
      obj.password="password must be greater than 6"
    }
    else if((!/[A-Z]/.test(form.password))||(!/[a-z]/.test(form.password))||(!/[0-9]/.test(form.password))){
      obj.password="password must contain atleast one uppercase one lowercase one number "
    }
  
    return obj;
  }

  async function submitHandler(e){
    e.preventDefault();
     const errors=errorHandler();
      if(Object.keys(errors).length==0){
    try{
       setLoading(true)
      const response=await axios.post("http://localhost:3000/admin/login",form,{withCredentials:true});
        setLoading(false)
      
        console.log("jhghhghgh",response.data.user)
        dispatch(setUser(response.data.user))
        toast.success(response.data.message)

        if(response.data.status){
          localStorage.setItem("isloggedIn",true)
        }
        navigate("/admin/dashboard",{replace:true})
    }
    catch(error){
       setLoading(false)
      console.log(error.response?.data)
       toast.error(error.response?.data.message);
    }
  }
   setError({...errors})
}

if(user){
  return <Navigate to="/admin/dashboard" replace />
}

  return (
    <>
     {loading && <Loader/>}

      <div className='min-h-screen w-full flex justify-center items-center bg-[#96566A]/30 px-4 py-8'>

        <div className='w-full max-w-5xl flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl'>

          {/* Left Side */}
          <div className='hidden md:flex flex-1 bg-[#96566A] text-[#FFF9F6] flex-col justify-center px-12 lg:px-16'>

            <div className='text-4xl lg:text-5xl font-bold leading-tight'>
              Welcome back...
            </div>

            <p className='mt-5 text-[#F0DDE1] text-sm leading-6 max-w-sm'>
              Login to continue and access your account.
            </p>

          </div>


          {/* Login Form */}
          <form
            className='w-full md:flex-1 bg-[#F0DDE1] px-7 sm:px-10 lg:px-14 py-10 flex flex-col justify-center gap-8'
            onSubmit={submitHandler}
          >

            <div className='text-4xl font-semibold text-[#713F50] text-center'>
              Login
            </div>

            <div className='flex flex-col gap-6 w-full'>

              <label>
                <input
                  type="email"
                  placeholder='Email'
                  name='email'
                  className='border border-[#EBD9D9] w-full px-4 py-3 bg-[#FFF9F6] text-[#713F50] placeholder:text-[#AD9299] rounded-xl text-sm outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20'
                  onChange={inputHandler}
                />
                {error.email &&
                  <p className='text-[#B65D70] text-xs mt-1'>
                    {error.email}
                  </p>
                }

              </label>


              <label>
                <input
                  type='password'
                  placeholder='Password'
                  className='border border-[#EBD9D9] w-full px-4 py-3 bg-[#FFF9F6] text-[#713F50] placeholder:text-[#AD9299] rounded-xl text-sm outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#96566A]/20'
                  name='password'
                  onChange={inputHandler}
                />
                 {error.password &&
                  <p className='text-[#B65D70] text-xs mt-1'>
                    {error.password}
                  </p>
                }
              </label>

            </div>


            <div className='text-right -mt-3'>
              <Link
                to='/forgotpassw'
                className='text-sm text-[#96566A] font-semibold hover:underline'
              >
                Forgot password?
              </Link>
            </div>


            <button className='font-semibold text-white w-full py-3 rounded-xl bg-[#96566A] text-sm hover:bg-[#713F50] transition'>
              Log in
            </button>

          </form>

        </div>

      </div>
    </>
  )
}

export default Login