import React from "react";
import warehouse from "../assets/Warehouse.png";

const DashboardGodownPage = () => {
  return (
    <main className="h-screen w-full flex">
      <section className="h-full w-full bg-gray-100 p-2 ">
        <div className=" border border-zinc-300 h-full rounded-md bg-white">
          <p className="font-semibold p-3 text-normal">Godwon Management</p>
          <div className="flex flex-col items-center mt-20">
            <img src={warehouse} alt="Warehouse image" className="h-50 " />
            <p className="font-semibold text-md mt-5">
              Start managing multiple Godowns!
            </p>
            <p className="text-xs mt-2">
              You can easily monitor and track your inventory across various
              Godowns and Store locations
            </p>
            <button className="btn btn-sm p-2 rounded-sm mt-5 bg-[var(--primary-btn)] font-medium">
              Enable Godown
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardGodownPage;
