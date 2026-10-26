import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiShield, FiCalendar, FiCheckCircle, FiClock } from "react-icons/fi";

function ViewUser() {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

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
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F0FAFC]">
        <p className="text-base font-medium text-[#627D98]">
          Loading user details...
        </p>
      </div>
    );
  }

  const details = [
    ["First Name", user.firstName, <FiUser />],
    ["Last Name", user.lastName, <FiUser />],
    ["Email", user.email, <FiMail />],
    ["Phone", user.phone, <FiPhone />],
    [
      "Role",
      typeof user.role === "object" ? user.role?.name : user.role,
      <FiShield />,
    ],
    ["Status", user.status, <FiCheckCircle />],
    ["Email Verified", user.isEmailVerified ? "Yes" : "No", <FiCheckCircle />],
    ["Phone Verified", user.isPhoneVerified ? "Yes" : "No", <FiCheckCircle />],
    [
      "Last Login",
      user.lastLoginAt
        ? new Date(user.lastLoginAt).toLocaleString()
        : "Never",
      <FiClock />,
    ],
    [
      "Created At",
      user.createdAt
        ? new Date(user.createdAt).toLocaleString()
        : "N/A",
      <FiCalendar />,
    ],
    [
      "Updated At",
      user.updatedAt
        ? new Date(user.updatedAt).toLocaleString()
        : "N/A",
      <FiCalendar />,
    ],
  ];

  function backToUsers() {
    navigate("/admin/users");
  }

  return (
    <div className="min-h-full bg-[#F0FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">

        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#D9E8EF] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
              <FiUser size={28} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#102A43] sm:text-2xl">
                User Details
              </h2>
              <p className="mt-1 text-sm text-[#627D98]">
                Complete information about this user
              </p>
            </div>
          </div>

          <button
            onClick={backToUsers}
            className="flex items-center justify-center gap-2 self-start rounded-lg bg-[#087F95] px-4 py-2.5 font-medium text-white transition hover:bg-[#066779] sm:self-auto"
          >
            <FiArrowLeft size={18} />
            Back to Users
          </button>
        </div>

        {/* User Profile */}
        <div className="border-b border-[#D9E8EF] bg-[#F8FDFE] p-5 sm:p-7">
          <div className="flex items-center gap-4">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="User profile"
                className="h-20 w-20 rounded-full border-4 border-[#D7F2F6] object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#D7F2F6] bg-[#D7F2F6] text-[#087F95]">
                <FiUser size={34} />
              </div>
            )}

            <div className="min-w-0">
              <h3 className=" text-lg font-bold text-[#102A43] sm:text-xl">
                {[user.firstName, user.lastName].filter(Boolean).join(" ") || "User"}
              </h3>

              <p className="mt-1 break-all text-sm text-[#627D98]">
                {user.email}
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  user.status === "ACTIVE"
                    ? "bg-[#D7F2F6] text-[#087F95]"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {user.status || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 sm:p-7">
          <h3 className="mb-5 text-lg font-bold text-[#102A43]">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {details.map(([label, value, icon]) => (
              <div
                key={label}
                className="min-w-0 rounded-xl border border-[#D9E8EF] bg-white p-4 transition hover:border-[#22B8CF] hover:bg-[#F8FDFE]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-[#087F95]">{icon}</span>
                  <p className="text-sm font-medium text-[#627D98]">
                    {label}
                  </p>
                </div>

                <p className=" text-sm font-semibold text-[#243B53]">
                  {value ?? "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#D9E8EF] bg-[#F8FDFE] px-5 py-4 sm:px-7">
          <p className="text-xs text-[#627D98]">
            User account information and activity details
          </p>
        </div>
      </div>
    </div>
  );
}

export default ViewUser;