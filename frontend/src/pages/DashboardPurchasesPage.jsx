import DashboardNavbar from "../components/DashboardNavbar";
import { dashboardPurchaseDetails } from "../lib/dashboardPurhaseCards";
import { Calendar, Plus, Search } from "lucide-react";
import { FaFileInvoice } from "react-icons/fa6";
import { motion } from "framer-motion";
import { container, dashboardLinksItems } from "../components/Sidebar";

const DashboardPurchasesPage = () => {
  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Purchase Invoice"} isReport={"true"} />
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-2 mt-4 text-sm"
        >
          {dashboardPurchaseDetails?.map((details) => (
            <motion.div
              variants={dashboardLinksItems}
              key={details.id}
              className={`border rounded-md p-3 shadow-md border-${details.color} bg-${details.color}/10 hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
            >
              <p className={`flex items-center gap-3 text-${details.color}`}>
                {details.icon} {details.label}
              </p>
              <span className="font-medium text-2xl flex items-center gap-2">
                {details.label === "To Collect" && (
                  <FaIndianRupeeSign size={15} />
                )}
                {details.label === "To Pay" && <FaIndianRupeeSign size={15} />}
                {details.value}
              </span>
            </motion.div>
          ))}
        </motion.div>

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
          className="flex items-center justify-between mt-8"
        >
          <div className="flex items-center gap-3">
            <label className="input">
              <Search size={16} className="text-zinc-400" />
              <input type="search" required placeholder="Search" />
            </label>
            <div className="dropdown dropdown-center dropdown-sm">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 btn-dash btn-wide btn-info text-nowrap"
              >
                <Calendar size={14} /> Last 365 days
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
          </div>

          <div>
            <button className="btn btn-sm btn-info">
              <Plus size={14} /> Create Purchase Invoice
            </button>
          </div>
        </motion.div>

        <div className="mt-8 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <motion.table
            initial={{
              opacity: 0,
              translateY: 100,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.2,
              delay: 0.3,
            }}
            className="table"
          >
            {/* head */}
            <thead>
              <tr>
                <th>Date</th>
                <th>Purchase Invoice Number</th>
                <th>Party Name</th>
                <th>Due In</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
          </motion.table>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ease: "easeInOut", duration: 0.2, delay: 0.4 }}
            className="w-full flex items-center justify-center my-8 flex-col gap-3 text-zinc-400"
          >
            <FaFileInvoice size={40} />
            No transactions matching the current filter
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPurchasesPage;
