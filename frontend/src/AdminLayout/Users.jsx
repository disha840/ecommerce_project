
import React, { use, useEffect, useState } from "react";
import api from '../api'
import ViewUser from "./ViewUser";
import CreateUserForm from "./CreateUserForm";
import { useNavigate } from "react-router-dom";
import DeleteUserModal from "./deleteUserModel";
const User = () => {

    const [showModal, setShowModal] = useState(false);
    const [deleteuser,setDelete]=useState(false)
    const [deleteid,setDeleteid]=useState(null)
    const [allusers,setAllUsers]=useState([])

    const [search,setSearch]=useState("")
    
    const [editUser,setEditUser]=useState(null)
    
    const navigate=useNavigate()


  

   async function showAllUsers(){
    const response=await api.get("/api/allusers");
    setAllUsers(response.data.users)
  }
    useEffect(()=>{
        showAllUsers()
    },[])

    function handleView(id){
        navigate(`/admin/view/${id}`)
        
    }
    

    async function SearchUsers(searchvalue=""){
        try{
            const response=await api.get(`/api/searched?search=${searchvalue}`);
            setAllUsers(response.data.users)
        }
        catch(error)
        {
            console.log(error)
        }
    }
    useEffect(()=>{
        const timer= setTimeout(() => {
            SearchUsers(search); 
        }, 400)

        return ()=> clearTimeout(timer)

    },[search])

    const handleStatusChange = async (id) => {
  try {
    await api.put(`/api/toggle-status/${id}`);
    showAllUsers();
  } catch (error) {
    console.log(error.message);
  }
};
    
    return (
        
        <div className="m-10">
        

            {/* Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                <div>
                    <h2 className="text-3xl font-bold text-[#713F50]">
                        Users
                    </h2>

                    <p className="text-sm text-[#A17B86] mt-2">
                        Manage all users of your store.
                    </p>
                </div>

            </div>


            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBD9D9]">
                    <p className="text-sm text-[#A17B86]">
                        Total Users
                    </p>

                    <div className="flex items-end justify-between mt-2">

                        <h3 className="text-3xl font-bold text-[#713F50]">
                            {allusers.length}
                        </h3>

                        <div className="w-10 h-10 rounded-xl bg-[#F0DDE1] flex items-center justify-center text-[#96566A] font-bold">
                            U
                        </div>

                    </div>
                </div>


                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBD9D9]">
                    <p className="text-sm text-[#A17B86]">
                        Active Users
                    </p>

                    <div className="flex items-end justify-between mt-2">

                        <h3 className="text-3xl font-bold text-[#713F50]">
                          {allusers.filter(
                              (u) => u.status === "ACTIVE"
                              ).length}
                        </h3>

                        <div className="w-10 h-10 rounded-xl bg-[#F0DDE1] flex items-center justify-center text-[#96566A] font-bold">
                            A
                        </div>

                    </div>
                </div>


                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBD9D9]">
                    <p className="text-sm text-[#A17B86]">
                        Inactive Users
                    </p>

                    <div className="flex items-end justify-between mt-2">

                        <h3 className="text-3xl font-bold text-[#713F50]">
                        {allusers.filter(
                              (u) => u.status !== "ACTIVE"
                              ).length}
                        </h3>

                        <div className="w-10 h-10 rounded-xl bg-[#F0DDE1] flex items-center justify-center text-[#96566A] font-bold">
                            I
                        </div>

                    </div>
                </div>

            </div>


            {/* Search + Create User */}
            <div className="bg-white rounded-2xl border border-[#EBD9D9] shadow-sm p-5 mb-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <input
                        type="text"
                        placeholder="Search user by name or email..."
                        className="w-full sm:w-80 px-4 py-3 rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] text-[#713F50] placeholder:text-[#AD9299] outline-none focus:border-[#B77B8C] transition-colors" value={search} onChange={(e)=> setSearch(e.target.value)}
                    />

                    <button
                        onClick={() => {
  setEditUser(null);
  setShowModal(true);
}}
                        className="px-6 py-3 rounded-xl bg-[#96566A] text-white font-semibold text-sm hover:bg-[#713F50] transition" 
                            >
                        + Create User
                    </button>

                </div>

            </div>


            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#EBD9D9] shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-[#F7E9E9]">

                    <h3 className="text-xl font-bold text-[#713F50]">
                        All Users
                    </h3>

                    <p className="text-sm text-[#A17B86] mt-1">
                        List of all registered users
                    </p>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-[#F7E9E9]">

                            <tr className="text-left text-[#713F50]">

                                <th className="px-6 py-4">Firstname</th>
                                <th className="px-6 py-4">Lastname</th>
                                
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">phone</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>

                            </tr>

                        </thead>
                        {allusers?.map((user)=>(
                            <tbody key={user._id}>

                            <tr className="border-b border-[#F7E9E9] hover:bg-[#FFF9F6]">

                                <td className="px-6 py-4">

                                    <div className="flex items-center gap-3">

                                        <div className="w-9 h-9 rounded-full bg-[#96566A] text-white flex items-center justify-center font-semibold">
                                            {user.firstName[0]}
                                        </div>

                                        <span className="font-semibold text-[#713F50]">
                                            {user.firstName}
                                        </span>

                                    </div>

                                </td>
                                 <td className="px-6 py-4 text-[#A17B86]">
                                    {user.lastName}
                                </td>

                                <td className="px-6 py-4 text-[#A17B86]">
                                    {user.email}
                                </td>

                                <td className="px-6 py-4 text-[#713F50]">
                                    {user.phone}
                                </td>

                                <td className="px-6 py-4 text-[#713F50]">
                                    {user.role}
                                </td>

                                <td className="px-6 py-4">

                                    <button className={`rounded-full px-3 py-1 text-sm ${
                                                                                  user.status === "ACTIVE"
                                                                                 ? "bg-green-100 text-green-700"
                                                                                   : "bg-red-100 text-red-700"
                                                                                 }`} onClick={()=> handleStatusChange(user._id)}>
                                      {user.status}
                                    </button>

                                </td>

                                <td className="px-6 py-4">

                                    <div className="flex justify-center gap-2">

                                        <button className="px-3 py-2 rounded-lg bg-[#F0DDE1] text-[#713F50] hover:bg-[#EBD9D9] transition-colors text-xs font-semibold" onClick={()=>handleView(user._id)}>
                                            View
                                        </button>

                                        <button className="px-3 py-2 rounded-lg bg-[#F0DDE1] text-[#713F50] hover:bg-[#EBD9D9] transition-colors text-xs font-semibold"  onClick={() => {
                                      setEditUser(user);
                                      setShowModal(true);
                                    }}>
                                            Edit
                                        </button>

                                        <button className="px-3 py-2 rounded-lg bg-[#B65D70] text-white hover:bg-[#96566A] transition-colors text-xs font-semibold" onClick={()=> {setDelete(true); setDeleteid(user._id)}}>
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        </tbody>

                        ))}


                        

                    </table>

                </div>

            </div>






            {showModal && (
  <CreateUserForm
    onClose={() => setShowModal(false)}
     editData={editUser} onCreated={showAllUsers}  
  />
  
)}
{
    deleteuser && <DeleteUserModal userId={deleteid} onClose={()=> setDelete(false)}  onDeleted={showAllUsers} />
}

          

            

        </div>
    );
};

export default User;