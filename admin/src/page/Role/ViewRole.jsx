import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { FiShield, FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi";

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
      <div className="flex min-h-screen items-center justify-center bg-[#F0FAFC] p-6">
        <div className="rounded-2xl border border-[#D9E8EF] bg-white px-8 py-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
            <FiShield size={24} />
          </div>

          <p className="font-medium text-[#627D98]">
            Loading role details...
          </p>
        </div>
      </div>
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
    <div className="min-h-screen bg-[#F0FAFC] p-4 sm:p-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">
        {/* HEADER */}
        <div className="flex flex-col gap-4 border-b border-[#D9E8EF] bg-[#F8FCFD] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
              <FiShield size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#102A43]">
                Role Details
              </h2>

              <p className="mt-1 text-sm text-[#627D98]">
                Complete information about this role
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={backToRoles}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#087F95] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066779]"
          >
            <FiArrowLeft size={18} />
            Back to Roles
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* ROLE INFORMATION */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#102A43]">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {details.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#D9E8EF] bg-white p-4 transition hover:bg-[#F8FCFD]"
                >
                  <p className="text-sm font-medium text-[#627D98]">
                    {label}
                  </p>

                  <p className="mt-2  font-semibold text-[#102A43]">
                    {value ?? "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PERMISSIONS */}
          <div className="rounded-xl border border-[#D9E8EF] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D7F2F6] text-[#087F95]">
                <FiShield size={20} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#102A43]">
                  Permissions
                </h3>

                <p className="mt-1 text-sm text-[#627D98]">
                  Access assigned to this role
                </p>
              </div>
            </div>

            {role.permissions?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="rounded-full border border-[#D9E8EF] bg-[#D7F2F6] px-3 py-2 text-sm font-medium text-[#087F95]"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            ) : (
              <p className="rounded-lg bg-[#F0FAFC] p-4 text-sm text-[#627D98]">
                No permissions assigned
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewRole;