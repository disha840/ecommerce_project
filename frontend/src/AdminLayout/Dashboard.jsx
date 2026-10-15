import React from "react";

const Dashboard = () => {
  return (
    <div className="m-10">

      {/* Page Heading */}
      <div className="mb-8">

        <h2 className="text-3xl font-bold text-[#713F50]">
          Dashboard
        </h2>

        <p className="text-sm text-[#A17B86] mt-2">
          Welcome back ! Here's an overview of your store.
        </p>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBD9D9]">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#A17B86]">
                Total Users
              </p>

              <h3 className="text-3xl font-bold text-[#713F50] mt-2">
                0
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-[#F0DDE1] flex items-center justify-center text-[#96566A] font-bold">
              U
            </div>

          </div>

        </div>

        {/* Active Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBD9D9]">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#A17B86]">
                Active User
              </p>

              <h3 className="text-3xl font-bold text-[#713F50] mt-2">
                0
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-[#F0DDE1] flex items-center justify-center text-[#96566A] font-bold">
              A
            </div>

          </div>

        </div>

        {/* Inactive Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBD9D9]">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#A17B86]">
                Inactive
              </p>

              <h3 className="text-3xl font-bold text-[#713F50] mt-2">
                0
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-[#F0DDE1] flex items-center justify-center text-[#96566A] font-bold">
              I
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;