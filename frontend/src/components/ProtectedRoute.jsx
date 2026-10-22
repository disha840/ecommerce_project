import { Navigate, Outlet } from "react-router-dom";
import Admin from "../AdminLayout/Admin";

const ProtectedRoute = () => {
  const token = localStorage.getItem("isloggedIn");

  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (  
     <>
     <Admin>
      <Outlet />
     </Admin>
  </> 
  )
};

export default ProtectedRoute;