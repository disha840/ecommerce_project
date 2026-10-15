import React, { createContext, useEffect, useState } from 'react'
import api from './api';

export const AuthContext=createContext()

const AuthProvider = ({children}) => {
    const [user,setUser]=useState(null);
      const [loading, setLoading] = useState(true);

    async function getuser(){
        try{
            const response=await api.get("/admin/getdata");
            console.log(response)
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
        <AuthContext.Provider value={{user,setUser,loading}}>
            {children}
        </AuthContext.Provider>
      
    </div>
  )
}

export default AuthProvider
