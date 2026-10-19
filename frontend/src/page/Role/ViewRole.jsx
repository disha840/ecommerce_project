import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { FiShield, FiArrowLeft } from "react-icons/fi";

function ViewRole() {
  const [role, setRole] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getRole = async () => {
      try {
        const response = await api.get(`/role/viewrole/${id}`);
        setRole(response.data.role);
      } catch (error) {
        console.log("Get role error:", error);
      }
    };

    if (id) {
      getRole();
    }
  }, [id]);

  if (!role) {
    return (
      <p className="p-6 text-[#A17B86]">
        Loading role details...
      </p>
    );
  }

  const details = [
    ["Role Name", role.name],
    ["Status", role.status],
    [
      "Created At",
      role.createdAt
        ? new Date(role.createdAt).toLocaleString()
        : "N/A",
    ],
    [
      "Updated At",
      role.updatedAt
        ? new Date(role.updatedAt).toLocaleString()
        : "N/A",
    ],
  ];

  function backToRoles() {
    navigate("/admin/role");
  }

  return (
    <div className="min-h-screen bg-[#FFF9F6] p-6">
      <div className="mx-auto max-w-4xl rounded-xl border border-[#EBD9D9] bg-white p-6 shadow-md">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0DDE1] text-[#96566A]">
              <FiShield size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#713F50]">
                Role Details
              </h2>

              <p className="mt-1 text-sm text-[#A17B86]">
                Complete information about this role
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={backToRoles}
            className="flex items-center gap-2 rounded-lg bg-[#96566A] px-4 py-2 text-white transition hover:bg-[#713F50]"
          >
            <FiArrowLeft size={18} />
            Back
          </button>
        </div>

        {/* ROLE INFORMATION */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-[#EBD9D9] p-4"
            >
              <p className="text-sm text-[#A17B86]">
                {label}
              </p>

              <p className="mt-1 font-semibold text-[#713F50]">
                {value ?? "N/A"}
              </p>
            </div>
          ))}
        </div>

        {/* PERMISSIONS */}
        <div className="rounded-xl border border-[#EBD9D9] p-5">
          <h3 className="mb-4 text-lg font-bold text-[#713F50]">
            Permissions
          </h3>

          {role.permissions?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {role.permissions.map((permission) => (
                <span
                  key={permission}
                  className="rounded-full bg-[#F7E9E9] px-3 py-2 text-sm font-medium text-[#96566A]"
                >
                  {permission}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#A17B86]">
              No permissions assigned
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewRole;