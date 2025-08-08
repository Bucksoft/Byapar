import { MessageCircle } from "lucide-react";
import Sidebar, { container, dashboardLinksItems } from "../components/Sidebar";
import { IoReceiptOutline } from "react-icons/io5";
import DashboardCard from "../components/DashboardCard";
import { dashboardCardDetails } from "../lib/dashboardCardDetails";
import { motion } from "framer-motion";

const DashboardPage = () => {
  return (
    <main className="h-full ">
      <div className="h-full w-full  rounded-lg p-3">
        <div className="flex bg-zinc-100">
          {/* sidebar */}
          {/* <Sidebar /> */}

          <section className="w-full ">
            {/* Dashboard nav */}
            <motion.nav
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="w-full bg-white rounded-lg px-5 py-3 flex items-center justify-between"
            >
              <span className="font-semibold text-lg">Dashboard</span>
              <button className="btn btn-sm btn-soft btn-info">
                {" "}
                <MessageCircle size={15} /> Chat
              </button>
            </motion.nav>

            {/* Invoice creation  */}
            <motion.div
              initial={{
                translateY: -100,
                filter: "blur(10px)",
              }}
              animate={{
                translateY: 0,
                filter: "blur(0)",
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="bg-accent mt-3 rounded-lg px-5 py-3 text-white"
            >
              <div className="flex flex-col gap-3">
                <h1>
                  Create your{" "}
                  <span className="font-semibold">first invoice</span> in 30
                  seconds!
                </h1>
                <button className="w-1/5 btn btn-sm btn-soft ">
                  Create Sales Invoice
                </button>
              </div>
            </motion.div>

            <div className="flex gap-3 ">
              {/* latest transactions */}
              <motion.div
                initial={{
                  translateY: -100,
                  filter: "blur(3px)",
                  opacity: 0,
                }}
                animate={{
                  translateY: 0,
                  filter: "blur(0)",
                  opacity: 1,
                }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.3,
                  delay: 0.3,
                }}
                className="w-3/5 bg-white px-5 py-3 mt-3 rounded-lg"
              >
                <h1 className="font-semibold text-sm   rounded-lg p-2">
                  Latest Transactions
                </h1>
                <div className="overflow-x-auto">
                  <table className="table text-sm mt-2 ">
                    {/* head */}
                    <thead className="bg-zinc-200">
                      <tr>
                        <th className="font-medium">DATE</th>
                        <th className="font-medium">TYPE</th>
                        <th className="font-medium">TXN NO</th>
                        <th className="font-medium">PARTY NAME</th>
                        <th className="font-medium">AMOUNT</th>
                      </tr>
                    </thead>
                  </table>
                  <div className="text-sm text-center text-zinc-500 my-10 flex items-center justify-center flex-col gap-3">
                    <IoReceiptOutline size={40} />
                    Create your first transaction
                  </div>
                </div>
              </motion.div>

              {/* Dashboard cards */}
              <motion.div
                className="w-2/5"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {dashboardCardDetails?.map((details) => (
                  <motion.div key={details.id} variants={dashboardLinksItems}>
                    <DashboardCard details={details} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
