import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthProvider";
import { useSelector } from "react-redux";

const Admin = () => {
  const user = useSelector((store)=>store.auth.user)
  const {getuser} = useContext(AuthContext)

  useEffect(()=>{
getuser()
  },[])

if(!user){
  return <Navigate to="/login" replace />
}

  return (
    <div className="h-screen flex flex-col overflow-hidden">

      {/* Fixed Header */}
      <Header />

      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Sidebar */}
        <Sidebar />

        {/* Scrollable Content + Footer */}
        <main className="flex-1 min-w-0 overflow-y-auto">

          <Outlet />

          {/* Footer scrolls with content */}
          <Footer />

        </main>

      </div>

    </div>
  );
};

export default Admin;