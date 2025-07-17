import {
  ArrowBigDown,
  Calendar,
  ChevronDown,
  FileCheck,
  Keyboard,
  LucideArrowDownWideNarrow,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import React from "react";
import { TbReportSearch } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { FaFileInvoice } from "react-icons/fa";
import DashboardNavbar from "../components/DashboardNavbar";

const DashboardExpenses = () => {
  return (
    <main className="h-screen w-full flex">
      <section className="w-full p-4 bg-gray-200">
        <div className="h-full rounded-md  bg-white p-5 flex flex-col">
          <DashboardNavbar title={"Expenses"} />

          <div className="flex justify-between  mt-10">
            <div className="flex gap-3">
              {/* search box */}
              <div className="">
                <label className="input">
                  <Search size={16} className="text-zinc-400" />
                  <input type="search" required placeholder="Search" />
                </label>
              </div>
              {/* calender */}
              <div className="dropdown dropdown-center w-50">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center justify-between btn btn-wide w-full text-xs font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-zinc-400" />
                    Last 365 days
                  </div>
                  <ChevronDown size={16} />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                  <li>
                    <a>Today</a>
                  </li>
                  <li>
                    <a>Yesterday</a>
                  </li>
                  <li>
                    <a>This week</a>
                  </li>
                  <li>
                    <a>Last week</a>
                  </li>
                </ul>
              </div>
              {/* all expense */}
              <div className="dropdown dropdown-center w-60">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-wide w-full  text-xs font-medium flex items-center justify-between"
                >
                  All Expenses Categories
                  <ChevronDown size={16} />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                  <li>
                    <a>All Expenses Categories</a>
                  </li>
                  <li>
                    <a>Bank Fee & Charges</a>
                  </li>
                  <li>
                    <a>Raw Material</a>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div className="h-full">
                <button className="btn btn-info">
                  <Plus size={14} /> Create Expense
                </button>
              </div>
            </div>
          </div>

          {/* table */}
          <div className="overflow-x-auto border border-zinc-200 rounded-lg  mt-10 h-80 w-full">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="bg-zinc-200">
                  <th>Date</th>
                  <th>Expense Number</th>
                  <th>Party Name</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
            </table>
            <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
              <FaFileInvoice size={40} />
              No transactions matching the current filter
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardExpenses;
