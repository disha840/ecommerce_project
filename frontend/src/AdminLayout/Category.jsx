
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
import AddCategory from "./AddCategory";
import api from "../api"
import DeleteCategoryModal from "./DelateCategory";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate=useNavigate()
    const [createcategory,setCreateCategory]=useState(false)
    const [deleteCat,setDelete]=useState(false)
    const [data,setData]=useState([])
    const [catId,setCatid]=useState(null)
    const [search,setSearch]=useState("")
    const [editCat, setEdit] = useState(false);
     const [editData, setEditData] = useState(null);
     async function getdata(){
      const response=await api.get("/category/showcategories")
      setData(response.data.category)

     }
     useEffect(()=>{
      getdata()
      

     },[])
function handleView(id){
navigate(`/admin/viewcategory/${id}`)
}

async function SearchCategory(searchvalue=""){
        try{
            const response=await api.get(`/category/searched?search=${searchvalue}`);
            setData(response.data.users)
        }
        catch(error)
        {
            console.log(error.message)
        }
    }
    useEffect(()=>{
        const timer= setTimeout(() => {
            SearchCategory(search); 
        }, 400)

        return ()=> clearTimeout(timer)

    },[search])

 const handleStatusChange = async (id) => {
  try {
   const res= await api.put(`/category/toggle-status/${id}`);
   console.log(res.data)
    getdata();
  } catch (error) {
    console.log(error.response?.data);
  }
};


    
  return (
    <>
    {createcategory && <AddCategory onClose={()=> setCreateCategory(false)} getdata={getdata} />}
{editCat &&<AddCategory onClose={()=>setEdit(false)} getdata={getdata} editData={editData}/>}

    <div className="min-h-screen bg-[#FFF9F6] p-6 text-[#713F50]">
      {deleteCat &&<DeleteCategoryModal catId={catId} onClose={()=> {setCatid(null);
        setDelete(false)
      }}  onDeleted={()=>getdata()}/>}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Categories
        </h1>

        <p className="mt-1 text-sm text-[#A17B86]">
          Manage all your product categories
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">

        <div className="rounded-2xl border border-[#EBD9D9] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#A17B86]">
            Total Categories
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            {data.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#EBD9D9] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#A17B86]">
            Active Categories
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[#96566A]">
            {data.filter((cat)=>{
              return cat.status=='ACTIVE'
            }).length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#EBD9D9] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#A17B86]">
            Inactive Categories
          </p>
          <h2 className="mt-2 text-3xl font-bold text-red-600">
             {data.filter((cat)=>{
              return cat.status!=='ACTIVE'
            }).length}
          </h2>
        </div>

      </div>

      {/* Search Bar + Add Category Button */}
      <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#EBD9D9] bg-white p-4 shadow-sm sm:flex-row sm:items-center">

        <input
          type="text"
          placeholder="Search category by name..."
          className="w-full max-w-md rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] px-4 py-3 text-sm text-[#713F50] placeholder:text-[#AD9299] outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#F0DDE1]" onChange={(e)=> setSearch(e.target.value)}
        />

        <button className="shrink-0 rounded-xl bg-[#96566A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#713F50]" onClick={() => setCreateCategory(true)}>
          + Add Category
        </button>

      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-2xl border border-[#EBD9D9] bg-white shadow-sm">

        {/* Table Header */}
        <div className="border-b border-[#F7E9E9] p-5">
          <h2 className="text-lg font-semibold">
            All Categories
          </h2>

          <p className="mt-1 text-sm text-[#A17B86]">
            List of all product categories
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">

            <thead className="bg-[#F7E9E9]">
              <tr>
                <th className="px-5 py-4">S.No</th>
                <th className="px-5 py-4">Category Name</th>
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
        <button
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            item.status === "Active"
              ? "bg-[#F0DDE1] text-[#96566A]"
              : "bg-red-100 text-red-600"
          }`} onClick={()=>handleStatusChange(item._id)}
        >
          {item.status}
        </button>
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
          <button className="rounded-lg bg-[#F0DDE1] px-3 py-2 text-[#96566A]" onClick={()=> handleView(item._id)}>
            <FiEye size={17} />
          </button>

        
          <button className="rounded-lg bg-[#F7E9E9] px-3 py-2" onClick={()=>{
            setEdit(true);
            setEditData(item)

          }}  >
            <FiEdit2 size={17} />
          </button>
          <button className="rounded-lg bg-[#F7E9E9] px-3 py-2" onClick={()=>{
            setCatid(item._id);
            setDelete(true)
          }}  >
            <FiTrash2 size={17} />
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

export default Category;