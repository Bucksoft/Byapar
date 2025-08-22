import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <main className="flex max-h-screen w-full bg-zinc-100 ">
      {/* Sidebar for large screens */}
      <section className="hidden md:block w-1/6">
        <Sidebar />
      </section>

      {/* Mobile Sidebar */}
      <section className="md:hidden fixed top-0 left-0 w-full bg-white shadow z-50">
        {/* Mobile menu button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-3 border-b w-full text-left"
        >
          ☰ Menu
        </button>

        {showSidebar && (
          <div className="absolute left-0 top-12 w-3/4 h-screen bg-white shadow-lg overflow-y-auto">
            <Sidebar />
            <button
              onClick={() => setShowSidebar(false)}
              className="p-3 w-full text-left border-t"
            >
              Close
            </button>
          </div>
        )}
      </section>

      {/* Main Content */}
      <section className="flex-1 md:ml-0 mt-12 md:mt-0">
        <Outlet />
      </section>
    </main>
  );
};

export default DashboardLayout;
