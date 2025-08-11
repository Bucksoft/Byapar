import { Calendar, ChevronDown, Keyboard, Search } from "lucide-react";
import React from "react";
import { FaFileInvoice } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import DashboardNavbar from "../components/DashboardNavbar";
import SalesNavigationMenus from "../components/SalesNavigationMenus";

const DashboardQuotationPage = () => {
  return (
    <main className="h-screen w-full flex">
      <section className="h-full w-full bg-gray-100 p-2 ">
        <div className=" border border-zinc-300 h-full rounded-md bg-white p-3">
          <DashboardNavbar title={"Quotation / Estimate"} />
          <SalesNavigationMenus
            title={"Quotation / Estimate"}
            btnText={"Quotation"}
            selectText={"quotation"}
          />
          {/* table */}
          <div className="border border-zinc-200 mt-5 h-80 rounded-md mx-4 ">
            <table className="table ">
              {/* head */}
              <thead>
                <tr className="text-xs bg-gray-100 border-b border-b-gray-200">
                  <th className="border-r border-r-zinc-200 w-60">Date</th>
                  <th className="border-r border-r-zinc-200 w-60">
                    Invoice Number
                  </th>
                  <th className="border-r border-r-zinc-200 w-60">Due In</th>

                  <th className="border-r border-r-zinc-200 w-60">Amount</th>
                  <th className="border-r border-r-zinc-200 w-60">Status</th>
                  <th className=" w-60">Mode of Payment</th>
                </tr>
              </thead>
            </table>
            <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
              <FaFileInvoice size={40} />
              <span className="text-sm">
                No transactions matching the current filter
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardQuotationPage;
