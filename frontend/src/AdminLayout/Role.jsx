import React, { useContext, useEffect, useState } from "react";
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
import FormModal from "../components/Role/FormModal";
const Role = () => {


    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        permissions: [],
    });


    const handleAddRoleModal = () => {
        setFormData({
            name: "",
            permissions: [],
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-6 m-6">

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#713F50]">
                        Roles
                    </h1>

                    <p className="mt-1 text-sm text-[#A17B86]">
                        Manage roles and their permissions
                    </p>
                </div>
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
                                {
                                    roles.filter(
                                        (role) =>
                                            role.status
                                    ).length
                                }
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
                                {
                                    roles.filter(
                                        (role) =>
                                            !role.status
                                    ).length
                                }
                            </h3>
                        </div>

                        <div className="rounded-lg bg-red-50 p-3 text-red-600">
                            <FiXCircle size={22} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH + TABLE */}

            <div className="rounded-2xl border border-[#EBD9D9] bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


                    {/* SEARCH */}

                    <div className="relative w-full sm:max-w-md">

                        <FiSearch
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#96566A]"
                            size={19}
                        />

                        <input
                            type="text"
                            placeholder="Search role..."
                           
                            className="
                                w-full
                                rounded-xl
                                border border-[#EBD9D9]
                                bg-[#FFF9F6]
                                py-2.5
                                pl-10
                                pr-4
                                text-sm
                                text-[#713F50]
                                placeholder:text-[#AD9299]
                                outline-none
                                transition
                                focus:border-[#B77B8C]
                                focus:bg-white
                                focus:ring-2
                                focus:ring-[#96566A]/10
                            "
                        />

                    </div>


                    {/* ADD Role */}

                    <button
                        onClick={handleAddRoleModal}
                        className="
                        flex items-center justify-center gap-2
                        rounded-lg
                        bg-[#96566A]
                        px-5 py-3
                        text-sm font-semibold text-white
                        transition
                        hover:bg-[#713F50] "
                    >
                        <FiPlus size={18} />
                        Add Role
                    </button>

                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#EBD9D9] bg-white shadow-sm">

                {/* TABLE */}

                <div className="overflow-x-auto">
                    <table className="w-full min-w-225">
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
  <tr className="transition hover:bg-[#FFF9F6]">
    {/* ROLE */}
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0DDE1] text-[#96566A]">
          <FiShield size={18} />
        </div>

        <div>
          <p className="font-semibold text-[#713F50]">
            Admin
          </p>

          <p className="text-xs text-[#AD9299]">
            Role ID: —
          </p>
        </div>
      </div>
    </td>

    {/* PERMISSIONS */}
    <td className="px-6 py-4">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-[#F7E9E9] px-3 py-1 text-xs font-medium text-[#96566A]">
          Users
        </span>

        <span className="rounded-full bg-[#F7E9E9] px-3 py-1 text-xs font-medium text-[#96566A]">
          Products
        </span>

        <span className="rounded-full bg-[#F7E9E9] px-3 py-1 text-xs font-medium text-[#96566A]">
          Categories
        </span>
      </div>
    </td>

    {/* STATUS */}
    <td className="px-6 py-4">
      <button
        className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600"
      >
        <FiCheckCircle />
        Active
      </button>
    </td>

    {/* CREATED */}
    <td className="px-6 py-4 text-sm text-[#A17B86]">
      —
    </td>

    {/* ACTIONS */}
    <td className="px-6 py-4">
      <div className="flex justify-end gap-2">
        <button
          title="View"
          className="rounded-lg p-2 text-[#A17B86] transition hover:bg-[#F7E9E9] hover:text-[#713F50]"
        >
          <FiEye size={17} />
        </button>

        <button
          title="Edit"
          className="rounded-lg p-2 text-[#96566A] transition hover:bg-[#F0DDE1]"
        >
          <FiEdit2 size={17} />
        </button>

        <button
          title="Delete"
          className="rounded-lg p-2 text-[#B65D70] transition hover:bg-[#F7E9E9]"
        >
          <FiTrash2 size={17} />
        </button>
      </div>
    </td>
  </tr>
</tbody>

     

                    </table>
                </div>
            </div>

            {/* FORM MODAL */}

            {showModal && (
                <FormModal
                    setShowModal={ setShowModal }
                />
            )}

           
        </div>
    );
};

export default Role;