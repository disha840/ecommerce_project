import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";

function ViewUser() {
  const [user, setUser] = useState(null);
  const {id}=useParams()
  const navigate=useNavigate()

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get(`/api/viewuser/${id}`);
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      getUser();
    }
  }, [id]);

  if (!user) {
    return <p className="p-6 text-[#A17B86]">Loading user details...</p>;
  }

  const details = [
    ["First Name", user.firstName],
    ["Last Name", user.lastName],
    ["Email", user.email],
    ["Phone", user.phone],
    [
      "Role",
      typeof user.role === "object"
        ? user.role?.name
        : user.role,
    ],
    ["Status", user.status],
    ["Email Verified", user.isEmailVerified ? "Yes" : "No"],
    ["Phone Verified", user.isPhoneVerified ? "Yes" : "No"],
    [
      "Last Login",
      user.lastLoginAt
        ? new Date(user.lastLoginAt).toLocaleString()
        : "Never",
    ],
    [
      "Created At",
      user.createdAt
        ? new Date(user.createdAt).toLocaleString()
        : "N/A",
    ],
    [
      "Updated At",
      user.updatedAt
        ? new Date(user.updatedAt).toLocaleString()
        : "N/A",
    ],
  ];
  function backToUsers(){
    navigate("/admin/users")

  }

  return (
    <div className="min-h-screen bg-[#FFF9F6] p-6">
      <div className="mx-auto max-w-4xl rounded-xl border border-[#EBD9D9] bg-white p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#713F50]">
              User Details
            </h2>
            <p className="mt-1 text-sm text-[#A17B86]">
              Complete information about this user
            </p>
          </div>

        
            <button
            onClick={()=> backToUsers()}
              
              className="rounded-lg bg-[#96566A] px-4 py-2 text-white hover:bg-[#713F50] transition"
            >
              Back
            </button>
          
        </div>

        {user.profileImage && (
          <div className="mb-6">
            <img
              src={user.profileImage}
              alt="User profile"
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-[#EBD9D9] p-4"
            >
              <p className="text-sm text-[#A17B86]">{label}</p>
              <p className="mt-1  font-semibold text-[#713F50]">
                {value ?? "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewUser;