import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

import { checkAuth } from "../redux/Slices/authSlice";

const Admin = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Loading Screen
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F0FAFC]">
        <div className="flex flex-col items-center rounded-3xl border border-[#D9E8EF] bg-white px-10 py-9 shadow-xl shadow-[#102A43]/5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D7F2F6]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B8EAF0] border-t-[#087F95]" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-[#102A43]">
            MyStore Admin
          </h2>

          <p className="mt-2 text-sm text-[#627D98]">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Redirect if user is not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F0FAFC]">
      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-[#F0FAFC]">
          {/* Page Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Admin;