
import React, { useEffect, useState } from "react";
import api from "../../api";
import CreateUserForm from "../../components/users/CreateUserForm";
import { useNavigate, Navigate } from "react-router-dom";
import DeleteUserModal from "../../components/users/DeleteUserModel";
import { useSelector } from "react-redux";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPhone,
  FiShield,
  FiArrowUpRight,
} from "react-icons/fi";

const User = () => {
  const [permissions, setPermissions] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const [showModal, setShowModal] = useState(false);
  const [deleteuser, setDelete] = useState(false);
  const [deleteid, setDeleteid] = useState(null);
  const [allusers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);

  const navigate = useNavigate();

  async function showAllUsers() {
    const response = await api.get("/api/allusers");
    setAllUsers(response.data.users);
  }

  useEffect(() => {
    showAllUsers();
  }, []);

  function handleView(id) {
    navigate(`/admin/view/${id}`);
  }

  async function SearchUsers(searchvalue = "") {
    try {
      const response = await api.get(
        `/api/searched?search=${searchvalue}`
      );
      setAllUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      SearchUsers(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusChange = async (id) => {
    try {
      await api.put(`/api/toggle-status/${id}`);
      showAllUsers();
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setPermissions(user.permissions);
  }, [user]);

  if (!user?.permissions.some((permission) => permission.includes("user"))) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="w-full space-y-7">
      {/* Page Heading */}
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#087F95]">
          Administration
        </p>

        <h1 className="text-2xl font-bold text-[#102A43] sm:text-3xl">
          User Management
        </h1>

        <p className="mt-2 text-sm text-[#627D98]">
          Manage your users, their roles and account status.
        </p>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {/* Total Users */}
        <div className="group rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#627D98]">
                Total Users
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#102A43]">
                {allusers.length}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
              <FiUsers size={23} />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-[#D9E8EF] pt-4">
            <FiArrowUpRight className="text-[#087F95]" size={17} />
            <p className="text-xs text-[#627D98]">
              All registered users
            </p>
          </div>
        </div>

        {/* Active Users */}
        <div className="group rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#627D98]">
                Active Users
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#102A43]">
                {
                  allusers.filter((user) => user.status === "ACTIVE").length
                }
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FiUserCheck size={23} />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-[#D9E8EF] pt-4">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-xs text-[#627D98]">
              Currently active accounts
            </p>
          </div>
        </div>

        {/* Inactive Users */}
        <div className="group rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#627D98]">
                Inactive Users
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#102A43]">
                {
                  allusers.filter((user) => user.status !== "ACTIVE").length
                }
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FiUserX size={23} />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-[#D9E8EF] pt-4">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <p className="text-xs text-[#627D98]">
              Currently inactive accounts
            </p>
          </div>
        </div>
      </div>

      {/* Search Section and Create User Button */}
      <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <FiSearch
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#087F95]"
            />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] py-3 pl-11 pr-4 text-sm text-[#102A43] outline-none transition placeholder:text-[#94A8B8] focus:border-[#087F95] focus:ring-4 focus:ring-[#22B8CF]/10"
            />
          </div>

          {permissions.includes("users:create") && (
            <button
              onClick={() => {
                setEditUser(null);
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#087F95] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#066779]"
            >
              <FiPlus size={19} />
              Create User
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D9E8EF] px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#102A43]">
              Registered Users
            </h2>

            <p className="mt-1 text-sm text-[#627D98]">
              User details and available actions
            </p>
          </div>

          <div className="rounded-xl bg-[#D7F2F6] px-3 py-2 text-sm font-semibold text-[#087F95]">
            {allusers.length} Users
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left text-sm">
            <thead className="bg-[#F0FAFC]">
              <tr className="text-xs uppercase tracking-wider text-[#627D98]">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {allusers.length > 0 ? (
                allusers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-[#D9E8EF] transition hover:bg-[#F8FCFD]"
                  >
                    {/* User Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#102A43] text-sm font-bold text-[#8DE3EC]">
                          {user.firstName[0]}
                        </div>

                        <div>
                          <p className="font-semibold text-[#102A43]">
                            {user.firstName} {user.lastName}
                          </p>

                          <p className="mt-1 text-xs text-[#627D98]">
                            Registered user
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[#627D98]">
                        <FiMail
                          size={15}
                          className="shrink-0 text-[#087F95]"
                        />
                        {user.email}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[#627D98]">
                        <FiPhone
                          size={15}
                          className="shrink-0 text-[#087F95]"
                        />
                        {user.phone}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 rounded-lg bg-[#D7F2F6] px-3 py-2 text-xs font-semibold text-[#087F95]">
                        <FiShield size={14} />
                        {user.role.name}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {permissions.includes("users:update") && (
                        <button
                          onClick={() => handleStatusChange(user._id)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            user.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                          {user.status}
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {permissions.includes("users:read") && (
                          <button
                            title="View User"
                            onClick={() => handleView(user._id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D7F2F6] text-[#087F95] transition hover:bg-[#B8EAF0]"
                          >
                            <FiEye size={17} />
                          </button>
                        )}

                        {permissions.includes("users:update") && (
                          <button
                            title="Edit User"
                            onClick={() => {
                              setEditUser(user);
                              setShowModal(true);
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                          >
                            <FiEdit2 size={16} />
                          </button>
                        )}

                        {permissions.includes("users:delete") && (
                          <button
                            title="Delete User"
                            onClick={() => {
                              setDelete(true);
                              setDeleteid(user._id);
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D7F2F6] text-[#087F95]">
                      <FiUsers size={27} />
                    </div>

                    <h3 className="mt-4 font-semibold text-[#102A43]">
                      No users found
                    </h3>

                    <p className="mt-1 text-sm text-[#627D98]">
                      Try another search or create a new user.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#D9E8EF] bg-[#F8FCFD] px-5 py-4 sm:px-6">
          <p className="text-xs text-[#627D98]">
            Showing {allusers.length} users
          </p>
        </div>
      </div>

      {/* Create / Edit User Modal */}
      {showModal && (
        <CreateUserForm
          onClose={() => setShowModal(false)}
          editData={editUser}
          onCreated={showAllUsers}
        />
      )}

      {/* Delete User Modal */}
      {deleteuser && (
        <DeleteUserModal
          userId={deleteid}
          onClose={() => setDelete(false)}
          onDeleted={showAllUsers}
        />
      )}
    </div>
  );
};

export default User;