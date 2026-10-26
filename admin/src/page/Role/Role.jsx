
import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiShield,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api";
import FormModal from "../../components/Role/FormModal";
import DeleteRoleModal from "../../components/Role/DeleteRole";
import { useNavigate } from "react-router-dom";

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showdelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  // GET ALL ROLES
  const fetchRoles = async () => {
    try {
      setLoading(true);

      const response = await api.get("/role/showroles");
      setRoles(response.data.roles || []);
    } catch (error) {
      console.log("Get roles error:", error.response?.data || error);
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // OPEN ADD MODAL
  const handleAddRole = () => {
    setSelectedRole(null);
    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const handleEditRole = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  // SEARCH ROLES
  const filteredRoles = roles.filter((role) =>
    (role.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const activeRoles = roles.filter(
    (role) => role.status === "Active"
  ).length;

  const inactiveRoles = roles.filter(
    (role) => role.status !== "Active"
  ).length;

  const viewHandler = (id) => {
    navigate(`/admin/viewrole/${id}`);
  };

  return (
    <div className="m-6 space-y-6">
      {/* DELETE MODAL */}
      {showdelete && (
        <DeleteRoleModal
          roleId={deleteId}
          onClose={() => {
            setDeleteId(null);
            setShowDelete(false);
          }}
          onDeleted={fetchRoles}
        />
      )}

      {/* HEADER */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#087F95]">
          Administration
        </p>

        <h1 className="text-2xl font-bold text-[#102A43]">
          Roles
        </h1>

        <p className="mt-1 text-sm text-[#627D98]">
          Manage roles and their permissions
        </p>
      </div>

      {/* STATS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* TOTAL ROLES */}
        <div className="rounded-xl border border-[#D9E8EF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">
                Total Roles
              </p>

              <h3 className="mt-1 text-2xl font-bold text-[#102A43]">
                {roles.length}
              </h3>
            </div>

            <div className="rounded-xl bg-[#D7F2F6] p-3 text-[#087F95]">
              <FiShield size={22} />
            </div>
          </div>
        </div>

        {/* ACTIVE ROLES */}
        <div className="rounded-xl border border-[#D9E8EF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">
                Active Roles
              </p>

              <h3 className="mt-1 text-2xl font-bold text-emerald-600">
                {activeRoles}
              </h3>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FiCheckCircle size={22} />
            </div>
          </div>
        </div>

        {/* INACTIVE ROLES */}
        <div className="rounded-xl border border-[#D9E8EF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#627D98]">
                Inactive Roles
              </p>

              <h3 className="mt-1 text-2xl font-bold text-red-600">
                {inactiveRoles}
              </h3>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <FiXCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND ADD ROLE BUTTON */}
      <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#087F95]"
              size={19}
            />

            <input
              type="text"
              placeholder="Search role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#D9E8EF] bg-[#F0FAFC] py-3 pl-10 pr-4 text-sm text-[#102A43] outline-none transition placeholder:text-[#94A8B8] focus:border-[#087F95] focus:bg-white focus:ring-2 focus:ring-[#22B8CF]/20"
            />
          </div>

          <button
            type="button"
            onClick={handleAddRole}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#087F95] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#066779]"
          >
            <FiPlus size={18} />
            Add Role
          </button>
        </div>
      </div>

      {/* ROLES TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">
        <div className="border-b border-[#D9E8EF] px-5 py-5 sm:px-6">
          <h2 className="text-lg font-bold text-[#102A43]">
            All Roles
          </h2>

          <p className="mt-1 text-sm text-[#627D98]">
            Manage roles and view their permissions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="border-b border-[#D9E8EF] bg-[#F0FAFC]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#102A43]">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#102A43]">
                  Permissions
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#102A43]">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#102A43]">
                  Created At
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#102A43]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#D9E8EF]">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-[#627D98]"
                  >
                    Loading roles...
                  </td>
                </tr>
              ) : filteredRoles.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-[#627D98]"
                  >
                    {search ? "No matching roles found" : "No roles found"}
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <tr
                    key={role._id}
                    className="transition hover:bg-[#F0FAFC]"
                  >
                    {/* ROLE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
                          <FiShield size={18} />
                        </div>

                        <div>
                          <p className="font-semibold text-[#102A43]">
                            {role.name}
                          </p>

                          <p className="text-xs text-[#627D98]">
                            Role ID: {role._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PERMISSIONS */}
                    <td className="px-6 py-4">
                      <div className="flex max-w-sm flex-wrap gap-2">
                        {(role.permissions || []).map((permission) => (
                          <span
                            key={permission}
                            className="rounded-full bg-[#D7F2F6] px-3 py-1 text-xs font-medium text-[#087F95]"
                          >
                            {permission}
                          </span>
                        ))}

                        {(!role.permissions ||
                          role.permissions.length === 0) && (
                          <span className="text-xs text-[#627D98]">
                            No permissions
                          </span>
                        )}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          role.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {role.status === "Active" ? (
                          <FiCheckCircle />
                        ) : (
                          <FiXCircle />
                        )}

                        {role.status || "Inactive"}
                      </span>
                    </td>

                    {/* CREATED AT */}
                    <td className="px-6 py-4 text-sm text-[#627D98]">
                      {role.createdAt
                        ? new Date(role.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="View"
                          onClick={() => viewHandler(role._id)}
                          className="rounded-lg p-2 text-[#087F95] transition hover:bg-[#D7F2F6]"
                        >
                          <FiEye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Edit"
                          onClick={() => handleEditRole(role)}
                          className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50"
                        >
                          <FiEdit2 size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          onClick={() => {
                            setDeleteId(role._id);
                            setShowDelete(true);
                          }}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <FiTrash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD AND EDIT ROLE MODAL */}
      {showModal && (
        <FormModal
          setShowModal={setShowModal}
          role={selectedRole}
          onUpdated={fetchRoles}
          onCreated={fetchRoles}
        />
      )}
    </div>
  );
};

export default Role;