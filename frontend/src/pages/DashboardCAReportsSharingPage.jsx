import { FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";

const DashboardCAReportsSharingPage = () => {
  return (
    <main className="flex h-screen w-full flex-col">
      <div className=" bg-white m-2 p-2 h-screen rounded-lg border border-zinc-200">
        <motion.section
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
          className="flex rounded-lg items-center border border-zinc-200 justify-between"
        >
          <div className="flex-flex-col ml-5 mt-4 mb-4">
            <p className="font-lg  text-black text-left">CA Reports Sharing</p>
            <p className="text-xs whitespace-nowrap text-gray-500">
              Automatically share reports to your CA every month
            </p>
          </div>
          <div className="flex items-center gap-4 mr-5">
            <button className="btn btn-error btn-sm btn-outline">Cancel</button>
            <button className="btn bg-[var(--primary-btn)]  btn-sm">
              Save Changes
            </button>
          </div>
        </motion.section>

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            ease: "easeInOut",
            delay: 0.1,
          }}
          className="w-full"
        >
          <p className="text-md ml-2  mt-3">Settings</p>
        </motion.div>

        <motion.section
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            ease: "easeInOut",
            delay: 0.1,
          }}
          className="w-full px-2 py-5 flex"
        >
          <div className=" flex border rounded w-full border-[var(--primary-border)]">
            <div className="  w-100  p-4  ">
              <p className="text-md font-normal">Enable Sharing</p>
              <p className="text-xs text-gray-500">
                Control the business reports sharing with your CA
              </p>
            </div>
            <div className="py-6">
              <input
                type="checkbox"
                defaultChecked
                className="toggle toggle-sm text-[var(--primary-btn)]"
              />
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            ease: "easeInOut",
            delay: 0.1,
          }}
          className="w-full px-5 "
        >
          <div className=" bg-gradient-to-r from-amber-100 to-yellow-100 rounded w-full">
            <p className="flex items-center gap-2 py-2 text-base ml-9 font-normal">
              <FiInfo />
              Automatic report sending will be scheduled for the 1st of every
              month starting from August 1, 2025
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default DashboardCAReportsSharingPage;
