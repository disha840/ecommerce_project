
import React, { useEffect, useState } from "react";
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
  const [edit,setEdit]=useState(false);
  const [editId,setEditId]=useState(null)
  const [showdelete,setShowDelete]=useState(false);
  const [deleteId,setDeleteId]=useState(null)
  
  const navigate=useNavigate()

  // GET ALL ROLES
  const fetchRoles = async () => {
    try {
      setLoading(true);

      const response = await api.get("/role/showroles");

      setRoles(response.data.roles || []);
    } catch (error) {
      console.log(
        "Get roles error:",
        error.response?.data || error
      );
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
    (role.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeRoles = roles.filter(
    (role) => role.status === "Active"
  ).length;

  const inactiveRoles = roles.filter(
    (role) => role.status !== "Active"
  ).length;
  function viewHandler(id){
navigate(`/admin/viewrole/${id}`)
  }

  return (
    <div className="m-6 space-y-6">
        {edit && <FormModal setShowModal={()=> setEdit(false)} role={editId}  onUpdated={fetchRoles} />}
            {showdelete && <DeleteRoleModal roleId={deleteId} onClose={()=>{
                setDeleteId(null);
                setShowDelete(false)
            }} onDeleted={fetchRoles}/>}
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#713F50]">
            Roles
          </h1>

          <p className="mt-1 text-sm text-[#A17B86]">
            Manage roles and their permissions
          </p>
        </div>

        <button
          onClick={handleAddRole}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#96566A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#713F50]"
        >
          <FiPlus size={18} />
          Add Role
        </button>
      </div>

      {/* STATS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* TOTAL */}
        <div className="rounded-xl border border-[#EBD9D9] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A17B86]">
                Total Roles
              </p>

              <h3 className="mt-1 text-2xl font-bold text-[#713F50]">
                {roles.length}
              </h3>
            </div>

            <div className="rounded-lg bg-[#F0DDE1] p-3 text-[#96566A]">
              <FiShield size={22} />
            </div>
          </div>
        </div>

        {/* ACTIVE */}
        <div className="rounded-xl border border-[#EBD9D9] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A17B86]">
                Active Roles
              </p>

              <h3 className="mt-1 text-2xl font-bold text-green-600">
                {activeRoles}
              </h3>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <FiCheckCircle size={22} />
            </div>
          </div>
        </div>

        {/* INACTIVE */}
        <div className="rounded-xl border border-[#EBD9D9] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A17B86]">
                Inactive Roles
              </p>

              <h3 className="mt-1 text-2xl font-bold text-red-600">
                {inactiveRoles}
              </h3>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-red-600">
              <FiXCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="rounded-2xl border border-[#EBD9D9] bg-white p-4 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#96566A]"
            size={19}
          />

          <input
            type="text"
            placeholder="Search role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] py-2.5 pl-10 pr-4 text-sm text-[#713F50] outline-none transition placeholder:text-[#AD9299] focus:border-[#B77B8C] focus:bg-white focus:ring-2 focus:ring-[#96566A]/10"
          />
        </div>
      </div>

      {/* ROLES TABLE */}
      <div className="overflow-hidden rounded-xl border border-[#EBD9D9] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full ">
            <thead className="border-b border-[#EBD9D9] bg-[#F7E9E9]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#713F50]">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#713F50]">
                  Permissions
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#713F50]">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#713F50]">
                  Created At
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#713F50]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F7E9E9]">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-[#A17B86]"
                  >
                    Loading roles...
                  </td>
                </tr>
              ) : filteredRoles.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-[#A17B86]"
                  >
                    {search
                      ? "No matching roles found"
                      : "No roles found"}
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <tr
                    key={role._id}
                    className="transition hover:bg-[#FFF9F6]"
                  >
                    {/* ROLE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0DDE1] text-[#96566A]">
                          <FiShield size={18} />
                        </div>

                        <div>
                          <p className="font-semibold text-[#713F50]">
                            {role.name}
                          </p>

                          <p className="text-xs text-[#AD9299]">
                            Role ID: {role._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PERMISSIONS */}
                    <td className="px-6 py-4">
                      <div className="flex max-w-sm flex-wrap gap-2">
                        {(role.permissions || []).map(
                          (permission) => (
                            <span
                              key={permission}
                              className="rounded-full bg-[#F7E9E9] px-3 py-1 text-xs font-medium text-[#96566A]"
                            >
                              {permission}
                            </span>
                          )
                        )}

                        {(!role.permissions ||
                          role.permissions.length === 0) && (
                          <span className="text-xs text-[#A17B86]">
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
                            ? "bg-green-50 text-green-600"
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
                    <td className="px-6 py-4 text-sm text-[#A17B86]">
                      {role.createdAt
                        ? new Date(
                            role.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="View"
                          onClick={() =>
                            viewHandler(role._id)
                          }
                          className="rounded-lg p-2 text-[#A17B86] transition hover:bg-[#F7E9E9] hover:text-[#713F50]"
                        >
                          <FiEye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Edit"
                          onClick={() => {
                            setEdit(true);
                            setEditId(role)
                          }}
                          className="rounded-lg p-2 text-[#96566A] transition hover:bg-[#F0DDE1]"
                        >
                          <FiEdit2 size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          onClick={() =>{
                            setDeleteId(role._id);
                            setShowDelete(true);
                          }
                            
                          }
                          className="rounded-lg p-2 text-[#B65D70] transition hover:bg-[#F7E9E9]"
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

      {/* SAME FORM MODAL FOR ADD AND EDIT */}
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
