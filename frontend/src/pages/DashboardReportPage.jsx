import React from "react";
import { BsStars } from "react-icons/bs";
import { FaFile, FaRegFile } from "react-icons/fa6";
import { LuBox } from "react-icons/lu";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { IoPeopleOutline } from "react-icons/io5";
const DashboardReportPage = () => {
  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        {/* header */}
        <div className="flex items-center justify-between ">
          <h1 className="font-semibold text-lg mt-1">Reports</h1>
          <button className="btn btn-sm btn-info flex items-center gap-2">
            {" "}
            <RiAccountPinCircleFill size={16} /> CA Report Sharing
          </button>
        </div>

        <div className="mt-7 text-sm flex items-center gap-5">
          <h2>Filter By</h2>
          <div className="flex gap-3">
            <div className="badge badge-soft badge-primary cursor-pointer">
              Party
            </div>
            <div className="badge badge-soft badge-primary cursor-pointer">
              Category
            </div>
            <div className="badge badge-soft badge-primary cursor-pointer">
              Payment Collection
            </div>
            <div className="badge badge-soft badge-primary cursor-pointer">
              Item
            </div>
            <div className="badge badge-soft badge-primary cursor-pointer">
              Invoice Details
            </div>
            <div className="badge badge-soft badge-primary cursor-pointer">
              Summary
            </div>
          </div>
        </div>

        <table className="table mt-8">
          {/* head */}
          <thead>
            <tr className="bg-zinc-100">
              <th className="flex items-center gap-2">
                <BsStars /> Favourite
              </th>
              <th>
                <TbReportAnalytics /> GST
              </th>
              <th>
                <FaRegFile /> Transaction
              </th>
              <th>
                <LuBox /> Item
              </th>
              <th>
                <IoPeopleOutline />
                Party
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </main>
  );
};

export default DashboardReportPage;
