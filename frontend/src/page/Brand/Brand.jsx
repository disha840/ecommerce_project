
import React, { useState ,useEffect} from "react";
import AddBrand from "../../components/Brand/AddBrand";
import api from "../../api";

const Brand = () => {
  const [createBrand, setCreateBrand] = useState(false);
  const [data,setData]=useState([])
  const [editData, setEditData] = useState(null);
   async function getdata(){
    try{
        const response=await api.get("/brands/showbrand")
        // console.log(response.data)
      setData(response.data.brand)
    }
    catch(error){
      console.log(error)
    }

     }
     useEffect(()=>{
      getdata()

     },[])
     async function handleDelete(id){
        try{
            const brand=await api.delete(`/brands/deletebrand/${id}`)
            setData((prev)=> prev.filter((b)=> b._id!=id))
        }catch(error){
            console.log(error)
        }
    }
    

  return (
    <>
      {createBrand && (
        <AddBrand
          onClose={() => setCreateBrand(false)}
          editData={editData} getdata={getdata}
        />
      )}

      <div className="min-h-screen bg-[#FFF9F6] p-6 text-[#713F50]">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Brands</h1>
          <p className="mt-1 text-sm text-[#A17B86]">
            Manage all your product brands
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#EBD9D9] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#A17B86]">Total Brands</p>
            <h2 className="mt-2 text-3xl font-bold">120</h2>
          </div>

          <div className="rounded-2xl border border-[#EBD9D9] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#A17B86]">Active Brands</p>
            <h2 className="mt-2 text-3xl font-bold text-[#96566A]">
              95
            </h2>
          </div>

          <div className="rounded-2xl border border-[#EBD9D9] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#A17B86]">Inactive Brands</p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              25
            </h2>
          </div>

        </div>

        {/* Search + Add Brand */}
        <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#EBD9D9] bg-white p-4 shadow-sm sm:flex-row sm:items-center">

          <input
            type="text"
            placeholder="Search brand by name..."
            className="w-full max-w-md rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] px-4 py-3 text-sm text-[#713F50] placeholder:text-[#AD9299] outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#F0DDE1]"
          />

          <button
            onClick={() => {
              setEditData(null);
              setCreateBrand(true);
            }}
            className="shrink-0 rounded-xl bg-[#96566A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#713F50]"
          >
            + Add Brand
          </button>

        </div>

        {/* Brands Table */}
        <div className="overflow-hidden rounded-2xl border border-[#EBD9D9] bg-white shadow-sm">

          <div className="border-b border-[#F7E9E9] p-5">
            <h2 className="text-lg font-semibold">All Brands</h2>
            <p className="mt-1 text-sm text-[#A17B86]">
              List of all product brands
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-[#F7E9E9]">
                <tr>
                  <th className="px-5 py-4">S.No</th>
                  <th className="px-5 py-4">Brand Name</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created At</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
  {data.map((item, index) => (
    <tr
      key={item._id}
      className="border-t border-[#F7E9E9] hover:bg-[#FFF9F6]"
    >
      <td className="px-5 py-5">{index + 1}</td>

      <td className="px-5 py-5 font-medium">
        {item.name}
      </td>

      <td className="px-5 py-5 text-[#A17B86]">
        {item.description}
      </td>

      <td className="px-5 py-5">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            item.status === "Active"
              ? "bg-[#F0DDE1] text-[#96566A]"
              : "bg-red-100 text-red-600"
          }`}
        >
          {item.status}
        </span>
      </td>

      <td className="px-5 py-5 text-[#A17B86]">
        {new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>

      <td className="px-5 py-5">
        <div className="flex justify-center gap-2">
          <button className="rounded-lg bg-[#F0DDE1] px-3 py-2 text-[#96566A]">
            View
          </button>

          <button
            onClick={() => {
              setEditData(item);
              setCreateBrand(true);
            }}
            className="rounded-lg bg-[#F7E9E9] px-3 py-2"
          >
            Edit
          </button>

          <button className="rounded-lg bg-red-50 px-3 py-2 text-red-600" onClick={()=> handleDelete(item._id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>

          

        </div>
      </div>
    </>
  );
};

export default Brand;