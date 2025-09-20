import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useBusinessStore } from "../store/businessStore";
import { RiMenu2Fill } from "react-icons/ri";

const DashboardLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <main className="flex min-h-screen w-full bg-zinc-100 overflow-x-hidden relative">
      {/* Sidebar for large screens */}
      <section className="hidden md:block w-1/6 min-h-screen bg-white shadow">
        <Sidebar />
      </section>

      {/* Mobile Sidebar */}
      <section className="md:hidden fixed top-0 left-0 w-full z-50">
        {/* Mobile menu button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-3 border-b w-full text-left bg-white shadow flex items-center gap-2"
        >
          <RiMenu2Fill />
          Menu
        </button>

        {/* Sidebar drawer */}
        <div
          className={`fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} w-3/4 max-w-xs`}
        >
          <Sidebar />
          <button
            onClick={() => setShowSidebar(false)}
            className="p-3 w-full text-left border-t"
          >
            Close
          </button>
        </div>

        {/* Overlay */}
        {showSidebar && (
          <div
            onClick={() => setShowSidebar(false)}
            className="fixed inset-0 bg-black/30 z-40"
          ></div>
        )}
      </section>

      {/* Main Content */}
      <section className="flex-1 md:ml-0 mt-0 md:mt-0 min-h-screen overflow-x-hidden">
        <Outlet />
      </section>
    </main>
  );
};

export default DashboardLayout;
