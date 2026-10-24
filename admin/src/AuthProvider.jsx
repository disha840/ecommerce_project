import React, { createContext, useEffect, useState } from 'react'
import api from './api';
import { useSelector } from "react-redux";
import { setUser } from "./redux/Slices/authSlice";
import { useDispatch } from 'react-redux';

export const AuthContext=createContext()

const AuthProvider = ({children}) => {
      const [loading, setLoading] = useState(true);
const dispatch = useDispatch()
    async function getuser(){
        try{
            console.log("hello")
            const response=await api.get("/admin/getdata");
            console.log("my respon",response.data)
            dispatch(setUser(response.data.decoded))
        }
        catch(error){
            console.log(error)
        }

     }
     useEffect(()=>{
        getuser();
     },[])
  return (
    <div>
        <AuthContext.Provider value={{loading,getuser}}>
            {children}
        </AuthContext.Provider>
      
    </div>
  )
}

export default AuthProvider
