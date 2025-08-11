import { RiAccountPinCircleFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { container, dashboardLinksItems } from "../components/Sidebar";
import { badges } from "../utils/constants";

const DashboardReportPage = () => {
  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        {/* header */}
        <motion.div
          initial={{
            opacity: 0,
            translateY: -100,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.3,
          }}
          className="flex items-center justify-between "
        >
          <h1 className="font-semibold text-lg mt-1">Reports</h1>
          <button className="btn btn-sm bg-[var(--primary-btn)] flex items-center gap-2">
            {" "}
            <RiAccountPinCircleFill size={16} /> CA Report Sharing
          </button>
        </motion.div>

        <div className="mt-7 text-sm flex items-center gap-5">
          <h2>Filter By</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex gap-3"
          >
            {badges?.map((badge) => (
              <motion.div
                variants={dashboardLinksItems}
                className="badge badge-soft badge-[var(--badge)] cursor-pointer"
              >
                {badge.label}
              </motion.div>
            ))}
          </motion.div>
        </div>

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
            delay: 0.4,
          }}
          className="table mt-8"
        >
          {/* head */}
          <thead>
            <tr className="bg-zinc-100">
              <th>Favourite</th>
              <th>GST</th>
              <th>Transaction</th>
              <th>Item</th>
              <th>Party</th>
            </tr>
          </thead>
        </motion.table>
      </div>
    </main>
  );
};

export default DashboardReportPage;
