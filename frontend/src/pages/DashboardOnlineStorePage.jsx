import { Calendar, ChevronDown, Keyboard, Search } from "lucide-react";
import onineShopping from "../assets/OnlineShopping.png";
import { FaFileInvoice } from "react-icons/fa";
import { motion } from "framer-motion";

const DashboardOnlineStorePage = () => {
  return (
    <main className="h-screen w-full flex ">
      <section className="h-full w-full bg-gray-100 p-2 ">
        <div className=" border border-zinc-300 h-full rounded-md bg-white">
          {/* navigation */}
          <motion.div
            initial={{
              translateY: -100,
              opacity: 0,
            }}
            animate={{
              translateY: 0,
              opacity: 1,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="flex items-center justify-between p-3 m-2"
          >
            <div>
              <span className="text-lg ">Online Orders</span>
            </div>
            <div className="border p-1 rounded-sm border-zinc-400">
              <Keyboard size={16} className="text-zinc-400" />
            </div>
          </motion.div>
          {/* card */}
          <motion.div
            initial={{
              translateY: -100,
              opacity: 0,
            }}
            animate={{
              translateY: 0,
              opacity: 1,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
              delay: 0.3,
            }}
            className="border border-zinc-200 h-28 m-4 flex justify-between shadow-md rounded-xs"
          >
            <div className="flex flex-col justify-center ml-5">
              <span className="text-sm text-zinc-800">
                Increase your sales, get Online Orders with a single click
              </span>
              <button className="bg-[var(--primary-btn)] text-white rounded-sm text-xs w-40 h-8 mt-2">
                Create Online Store
              </button>
            </div>
            <div>
              <img
                src={onineShopping}
                alt=""
                className="h-28 w-70  rounded-xs"
              />
            </div>
          </motion.div>
          {/* Search&Cal */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
              delay: 0.3,
            }}
            className="flex ml-4 space-x-5"
          >
            <div className="">
              <label className="input input-sm border border-zinc-400">
                <Search size={16} className="text-zinc-600" />
                <input type="search" required placeholder="Search" />
              </label>
            </div>
            <div className="dropdown dropdown-center w-50 ">
              <div
                tabIndex={0}
                role="button"
                className="border border-zinc-400 flex items-center justify-between btn btn-wide btn-sm w-full text-xs font-medium  bg-white"
              >
                <div className="flex items-center gap-2 text-zinc-600">
                  <Calendar size={16} />
                  Last 365 days
                </div>
                <ChevronDown size={16} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm text-zinc-400"
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
          </motion.div>
          {/* table */}
          <motion.div
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="border border-zinc-200 mt-5 h-80 rounded-md mx-4 "
          >
            <table className="table table-zebra">
              {/* head */}
              <thead>
                <tr className="text-xs bg-gray-100 border-b border-b-gray-200">
                  <th className="border-r border-r-zinc-200 w-60">Date</th>
                  <th className="border-r border-r-zinc-200 w-60">
                    Quotation Number
                  </th>
                  <th className="border-r border-r-zinc-200 w-60">
                    Party Name
                  </th>

                  <th className="border-r border-r-zinc-200 w-60">Amount</th>
                  <th className="border-r border-r-zinc-200 w-60">Status</th>
                  <th className=" w-60">Mode of Payment</th>
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

export default DashboardOnlineStorePage;
