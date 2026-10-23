import React, { createContext, useEffect, useState } from 'react'
import api from './api';

export const AuthContext=createContext()

const AuthProvider = ({children}) => {
    const [user,setUser]=useState(null);
      const [loading, setLoading] = useState(true);

    async function getuser(){
        try{
            console.log("hello")
            const response=await api.get("/admin/getdata");
            console.log("my respon",response.data)
            // setUser(response.data)
        }
        catch(error){
            console.log(error)
        }

     }
     useEffect(()=>{
        getuser();
     },[user])
  return (
    <div>
        <AuthContext.Provider value={{user,setUser,loading,getuser}}>
            {children}
        </AuthContext.Provider>
      
    </div>
  )
}

export default AuthProvider
