import { Calendar, ChevronDown, Plus, Search } from "lucide-react";

import { FaFileInvoice } from "react-icons/fa";
import DashboardNavbar from "../components/DashboardNavbar";
import { motion } from "framer-motion";

const DashboardExpenses = () => {
  return (
    <main className="h-screen w-full flex">
      <section className="w-full p-3 bg-zinc-100">
        <div className="h-full rounded-md  bg-white p-2 flex flex-col">
          <DashboardNavbar title={"Expenses"} />

          <motion.div
            initial={{
              opacity: 0,
              scaleY: 0,
            }}
            animate={{
              opacity: 1,
              scaleY: 1,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.2,
            }}
            className="flex justify-between  mt-10"
          >
            <div className="flex gap-3 px-3">
              {/* search box */}
              <div className="">
                <label className="input input-sm">
                  <Search size={16} className="text-zinc-400" />
                  <input type="search" required placeholder="Search" />
                </label>
              </div>
              {/* calender */}
              <div className="dropdown dropdown-center w-50">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center justify-between btn btn-wide btn-sm w-full text-xs font-medium"
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
                  className="btn btn-wide btn-sm w-full  text-xs font-medium flex items-center justify-between"
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
                <button className="btn bg-[var(--primary-btn)] btn-sm">
                  <Plus size={14} /> Create Expense
                </button>
              </div>
            </div>
          </motion.div>

          {/* table */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.2,
            }}
            className="overflow-x-auto border border-zinc-200 rounded-lg  mt-10 h-80 w-full"
          >
            <table className="table ">
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
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default DashboardExpenses;
