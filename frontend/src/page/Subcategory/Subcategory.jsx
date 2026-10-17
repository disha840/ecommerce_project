
import { useEffect, useState } from "react";
import api from "../../api";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import AddSubcategory from "../../components/Subcategory/AddSubcategory";
import { useNavigate } from "react-router-dom";
import DeleteSubcategoryModal from "../../components/Subcategory/DeleteSubCategory";

const Subcategory = () => {
  const navigate=useNavigate()
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [edit,setshowEdit]=useState(false);
  const [editData,setEditData]=useState(null);
  const [deleting,setDeleting]=useState(false);
  const [deleteId,setDeleteId]=useState(null);


  // Get all subcategories
  async function getdata() {
    try {
      const response = await api.get(
        "/subcategory/showsubcategories"
      );

    

      setData(
        response.data.subcategory ||
        response.data.subcategories ||
        response.data.data ||
        []
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError("Failed to load subcategories");
    }
  }

  useEffect(() => {
    getdata();
  }, []);

  
  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  function viewHandler(id){
          navigate(`/admin/viewsubcategory/${id}`)
  }

  return (
    <div className="min-h-screen bg-[#FFF9F6] p-6 text-[#713F50]">

      {showModal && (
        <AddSubcategory
          onClose={() => {setShowModal(false); }}  getdata={getdata}
        />
      )}
      {deleting && (
        <DeleteSubcategoryModal
          onClose={() => {
            setDeleting(false);
          }}                      subId={deleteId}  onDeleted={()=> getdata()}
        />
      )}
      {
        edit &&<AddSubcategory onClose={()=>setshowEdit(false)} getdata={getdata} editData={editData}/>
      }

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Subcategories</h1>
        <p className="mt-1 text-sm text-[#A17B86]">
          Manage all your product subcategories
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">

        <div className="rounded-2xl border border-[#EBD9D9] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#A17B86]">
            Total Subcategories
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            {data.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#EBD9D9] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#A17B86]">
            Active Subcategories
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[#96566A]">
            {data.filter(
              (item) =>
                item.status?.toLowerCase() === "active"
            ).length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#EBD9D9] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#A17B86]">
            Inactive Subcategories
          </p>
          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {data.filter(
              (item) =>
                item.status?.toLowerCase() !== "active"
            ).length}
          </h2>
        </div>

      </div>

      {/* Search + Add */}
      <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#EBD9D9] bg-white p-4 shadow-sm sm:flex-row sm:items-center">

        <div className="relative w-full max-w-md">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A17B86]"
            size={18}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subcategory by name..."
            className="w-full rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#F0DDE1]"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="shrink-0 rounded-xl bg-[#96566A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#713F50]"
        >
          <FiPlus className="mr-2 inline" size={16} />
          Add Subcategory
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#EBD9D9] bg-white shadow-sm">

        <div className="border-b border-[#F7E9E9] p-5">
          <h2 className="text-lg font-semibold">
            All Subcategories
          </h2>
          <p className="mt-1 text-sm text-[#A17B86]">
            List of all product subcategories
          </p>
        </div>

        {error && (
          <p className="p-4 text-sm text-red-600">{error}</p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7E9E9]">
              <tr>
                <th className="px-5 py-4">S.No</th>
                <th className="px-5 py-4">Subcategory Name</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">Parent Category</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Created At</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-[#A17B86]"
                  >
                    {error
                      ? "Unable to load subcategories"
                      : "No subcategories to display"}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-t border-[#F7E9E9] hover:bg-[#FFF9F6]"
                  >
                    <td className="px-5 py-5">{index + 1}</td>

                    <td className="px-5 py-5 font-medium">
                      {item.name}
                    </td>

                    <td className="px-5 py-5 text-[#A17B86]">
                      {item.description || "-"}
                    </td>

                    <td className="px-5 py-5">
                      {item.parentCategory?.name || "-"}
                    </td>

                    <td className="px-5 py-5">
                      {item.status || "-"}
                    </td>

                    <td className="px-5 py-5 text-[#A17B86]">
                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleDateString("en-GB")
                        : "-"}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          className="rounded-lg bg-[#F0DDE1] px-3 py-2 text-[#96566A]"
                          title="View" onClick={()=> viewHandler(item._id)}
                        >
                          <FiEye size={17} />
                        </button>

                        <button
                          className="rounded-lg bg-[#F7E9E9] px-3 py-2"
                          title="Edit" onClick={()=>{
                            setshowEdit(true)
                            setEditData(item)
                          }}
                        >
                          <FiEdit2 size={17} />
                        </button>

                        <button
                          className="rounded-lg bg-[#F7E9E9] px-3 py-2"
                          title="Delete" onClick={()=>{
                            setDeleteId(item._id);
                            setDeleting(true)
                          }}
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
    </div>
  );
};

export default Subcategory;
