import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <main className="flex max-h-screen w-full bg-zinc-100">
      <section className="w-1/5">
        <Sidebar />
      </section>
      <section className="w-full">
        <Outlet />
      </section>
    </main>
  );
};

export default DashboardLayout;
