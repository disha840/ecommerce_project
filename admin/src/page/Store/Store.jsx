import FormModal from "../../components/Store/formModal";
import api from "../../api";

import { useState ,useEffect} from "react";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";

const Store = () => {
    const [stores, setStores] = useState([]);
    const fetchStores = async () => {
    try {
         const res = await api.get("/store/getstores");
          setStores(res.data.stores);
    } 
    catch (error) {
        console.log(error)
    } 
  };

  useEffect(() => {
    fetchStores();
  }, []);

    const [showmodel,setShowmodal]=useState(false)
  return (
    
    <div className="space-y-6 bg-[#FFF9F6] p-6 text-[#713F50]">
        {showmodel &&<FormModal onClose={()=>setShowmodal(false)}/>}
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Store Management</h1>
        <p className="mt-1 text-sm text-[#A17B86]">
          Manage stores, managers, locations and status.
        </p>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#EBD9D9] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A17B86]">Total Stores</p>
              <h2 className="mt-2 text-3xl font-bold">12</h2>
            </div>
            <div className="rounded-xl bg-[#F0DDE1] p-3 text-[#96566A]">
              <FiMapPin size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#EBD9D9] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A17B86]">Active Stores</p>
              <h2 className="mt-2 text-3xl font-bold text-green-600">
                09
              </h2>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <FiCheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#EBD9D9] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A17B86]">Inactive Stores</p>
              <h2 className="mt-2 text-3xl font-bold text-red-500">
                03
              </h2>
            </div>
            <div className="rounded-xl bg-red-50 p-3 text-red-500">
              <FiXCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BOX + ADD BUTTON */}
      <div className="rounded-2xl border border-[#EBD9D9] bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A17B86]"
              size={19}
            />
            <input
              type="text"
              placeholder="Search stores, code, manager, phone..."
              className="w-full rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-[#A17B86] focus:border-[#96566A]"
            />
          </div>

          <button className="flex items-center justify-center gap-2 rounded-xl bg-[#96566A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#814659]" onClick={()=>setShowmodal(true)}>
            <FiPlus size={19} />
            Add Store
          </button>
        </div>
      </div>

      {/* STORES TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#EBD9D9] bg-white">
        <div className="border-b border-[#EBD9D9] p-5">
          <h2 className="font-semibold">All Stores</h2>
          <p className="mt-1 text-sm text-[#A17B86]">
            View and manage your registered stores.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
           <thead className="border-b border-[#EBD9D9] bg-[#FFF9F6]">
  <tr>
    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide">S.No.</th>
    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide">Store</th>
    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide">Store Code</th>
    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide">Manager</th>
    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide">Phone</th>
    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide">Service Radius</th>
    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide">Status</th>
    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide">Actions</th>
  </tr>
</thead>

<tbody className="divide-y divide-[#EBD9D9]">
  {stores.map((store, index) => (
    <tr key={store._id} className="transition hover:bg-[#FFF9F6]">
      <td className="px-6 py-4">{index + 1}</td>
      <td className="px-6 py-4 font-semibold">{store.name}</td>

      <td className="px-6 py-4">
        <span className="rounded-lg bg-[#F0DDE1] px-3 py-1.5 text-sm font-medium">
          {store.code}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm">
          <FiUsers className="text-[#A17B86]" />
          {store.manager
            ? `${store.manager.firstName || ""} ${store.manager.lastName || ""}`.trim()
            : "Not assigned"}
        </div>
      </td>

      <td className="px-6 py-4">{store.phone}</td>
      <td className="px-6 py-4">{store.serviceRadius} km</td>

      <td className="px-6 py-4">
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            store.status === "ACTIVE"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {store.status}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => console.log("Edit store:", store._id)}
            className="rounded-lg p-2 text-[#96566A] hover:bg-[#F0DDE1]"
            title="Edit Store"
          >
            <FiEdit2 size={18} />
          </button>

          <button
            onClick={() => console.log("Delete store:", store._id)}
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
            title="Delete Store"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  ))}

  {stores.length === 0 && (
    <tr>
      <td colSpan={8} className="py-8 text-center text-[#A17B86]">
        No stores found
      </td>
    </tr>
  )}
</tbody>

            
          </table>
        </div>

        {/* PAGINATION */}
        {/* <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EBD9D9] px-6 py-4">
          <p className="text-sm text-[#A17B86]">
            Showing 1–3 of 12 stores
          </p>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-[#EBD9D9] px-3 py-2 text-sm text-[#A17B86]">
              Previous
            </button>
            <button className="rounded-lg bg-[#96566A] px-3 py-2 text-sm text-white">
              1
            </button>
            <button className="rounded-lg border border-[#EBD9D9] px-3 py-2 text-sm hover:bg-[#F0DDE1]">
              2
            </button>
            <button className="rounded-lg border border-[#EBD9D9] px-3 py-2 text-sm hover:bg-[#F0DDE1]">
              Next
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Store;
