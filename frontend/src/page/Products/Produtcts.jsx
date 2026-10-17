
import React, { useState } from "react";
import AddProduct from "../../components/Products/AddProduct";

const Product = () => {
  const [showModal, setShowModal] = useState(false);

  return (
   
    <div className="min-h-screen bg-[#FFF9F6] p-6 text-[#713F50]">
         {showModal &&
         <AddProduct onClose={()=>setShowModal(false)}/>
        }

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="mt-1 text-sm text-[#A17B86]">
          Manage all your store products
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          { title: "Total Products", count: 120 },
          { title: "Active Products", count: 95 },
          { title: "Inactive Products", count: 25 },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[#EBD9D9] bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-[#A17B86]">{item.title}</p>
            <h2 className="mt-2 text-3xl font-bold">{item.count}</h2>
          </div>
        ))}
      </div>

      {/* Search and Add */}
      <div className="mb-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#EBD9D9] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search product by name..."
          className="w-full max-w-md rounded-xl border border-[#EBD9D9] bg-[#FFF9F6] px-4 py-3 text-sm outline-none focus:border-[#B77B8C] focus:ring-2 focus:ring-[#F0DDE1]"
        />

        <button
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-[#96566A] px-5 py-3 text-sm font-medium text-white hover:bg-[#713F50]"
        >
          + Add Product
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-2xl border border-[#EBD9D9] bg-white shadow-sm">
        <div className="border-b border-[#F7E9E9] p-5">
          <h2 className="text-lg font-semibold">All Products</h2>
          <p className="mt-1 text-sm text-[#A17B86]">
            List of all store products
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7E9E9]">
              <tr>
                {[
                  "S.No",
                  "Product",
                  "Category",
                  "Subcategory",
                  "Brand",
                  "Unit",
                  "Featured",
                  "Status",
                  "Rating",
                  "Action",
                ].map((heading) => (
                  <th key={heading} className="whitespace-nowrap px-5 py-4">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="10" className="px-5 py-16 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7E9E9] text-3xl">
                    📦
                  </div>
                  <h3 className="font-semibold">No Products Found</h3>
                  <p className="mt-1 text-sm text-[#A17B86]">
                    Add your first product to get started.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
};

export default Product;
