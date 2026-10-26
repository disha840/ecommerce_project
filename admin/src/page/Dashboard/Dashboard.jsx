import React from "react";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiArrowUpRight,
  FiActivity,
  FiShoppingBag,
  FiLayers,
  FiTag,
  FiClock,
} from "react-icons/fi";

const Dashboard = () => {
  const dashboardCards = [
    {
      title: "Total Users",
      value: "0",
      description: "All registered users",
      icon: <FiUsers size={24} />,
      iconBackground: "bg-[#D7F2F6]",
      iconColor: "text-[#087F95]",
    },
    {
      title: "Active Users",
      value: "0",
      description: "Currently active accounts",
      icon: <FiUserCheck size={24} />,
      iconBackground: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Inactive Users",
      value: "0",
      description: "Currently inactive accounts",
      icon: <FiUserX size={24} />,
      iconBackground: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  const quickOverview = [
    {
      title: "Categories",
      description: "Manage your categories",
      icon: <FiLayers size={22} />,
      iconBackground: "bg-[#D7F2F6]",
      iconColor: "text-[#087F95]",
    },
    {
      title: "Products",
      description: "Manage your products",
      icon: <FiShoppingBag size={22} />,
      iconBackground: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Brands",
      description: "Manage your brands",
      icon: <FiTag size={22} />,
      iconBackground: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#087F95]">
            Overview
          </p>

          <h1 className="text-2xl font-bold text-[#102A43] sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#627D98]">
            Welcome back! Here is an overview of your store.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-[#D9E8EF] bg-white px-4 py-3 shadow-sm">
          <FiActivity className="text-[#087F95]" size={19} />
          <span className="text-sm font-medium text-[#243B53]">
            Store Overview
          </span>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#102A43] p-6 text-white shadow-lg shadow-[#102A43]/10 sm:p-8">
        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-medium text-[#8DE3EC]">
            YOUR STORE AT A GLANCE
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            Welcome to MyStore!
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Manage your users, products, categories and brands from one place.
            Keep everything organized with your admin dashboard.
          </p>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border-(length:--border-size) border-[#22B8CF]/20" />

        <div className="pointer-events-none absolute -bottom-20 right-20 h-44 w-44 rounded-full bg-[#22B8CF]/10" />

        <div className="absolute right-6 top-6 hidden h-14 w-14 items-center justify-center rounded-2xl bg-[#22B8CF]/15 text-[#8DE3EC] sm:flex">
          <FiShoppingBag size={28} />
        </div>
      </div>

      {/* User Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#102A43]">
            User Statistics
          </h2>

          <p className="mt-1 text-sm text-[#627D98]">
            A quick look at your user accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map((card) => (
            <div
              key={card.title}
              className="group rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#22B8CF] hover:shadow-lg hover:shadow-[#102A43]/5 sm:p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#627D98]">
                    {card.title}
                  </p>

                  <h3 className="mt-3 text-3xl font-bold text-[#102A43]">
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBackground} ${card.iconColor}`}
                >
                  {card.icon}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#D9E8EF] pt-4">
                <p className="text-xs text-[#627D98]">
                  {card.description}
                </p>

                <FiArrowUpRight
                  size={18}
                  className="text-[#087F95] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Overview */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#102A43]">
            Quick Overview
          </h2>

          <p className="mt-1 text-sm text-[#627D98]">
            Keep track of your store resources.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickOverview.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-[#D9E8EF] bg-white p-5 transition duration-300 hover:border-[#22B8CF] hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBackground} ${item.iconColor}`}
              >
                {item.icon}
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-[#102A43]">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-[#627D98]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Section */}
      <section className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D7F2F6] text-[#087F95]">
            <FiClock size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#102A43]">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-[#627D98]">
              Your recent store updates will appear here.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-[#D9E8EF] bg-[#F0FAFC] px-4 py-8 text-center">
          <FiActivity
            size={28}
            className="mx-auto text-[#087F95]"
          />

          <p className="mt-3 font-medium text-[#243B53]">
            No recent activity
          </p>

          <p className="mt-1 text-sm text-[#627D98]">
            Activity details can be added here when backend data is available.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;