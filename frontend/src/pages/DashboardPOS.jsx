import { IndianRupee, Plus, Search, Settings, X } from "lucide-react";
import { motion } from "framer-motion";
import POSTotalSidebar from "../components/POS/POSTotalSidebar";
import { useState } from "react";

const DashboardPOS = () => {
  // DATA OBJECT TO SEND AT THE BACKEND
  const [data, setData] = useState({
    items: [],
    discountPercent: 0,
    discountAmount: 0,
    discountType: "after_tax",
    additionalCharges: [
      {
        charge: "",
        amount: 0,
      },
    ],
    totalAdditionalCharges: 0,
    customerDetails: {
      mobile: "",
      customerName: "",
    },
    subTotal: 0,
    tax: 0,
    totalAmount: 0,
    receivedAmount: 0,
    paymentMode: "cash",
  });

  return (
    <main className="h-full overflow-y-scroll p-2">
      <section className="w-full border-r h-full border-zinc-200 px-2 py-5 flex flex-col">
        {/* POS Navigation */}
        <motion.header
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
          className="p-2 flex items-center justify-between bg-zinc-100 border-b border-zinc-200"
        >
          <p>POS Billing</p>
          <button className="btn btn-sm rounded-xl">
            <Settings size={16} />
            Settings
          </button>
        </motion.header>

        {/* POS Subheading */}
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
          className="flex items-center text-xs border-b border-zinc-200"
        >
          <div className="flex items-center gap-9 bg-amber-100 p-3 border-r border-r-zinc-300">
            <p>Billing Screen 1</p>
            <span>
              <X size={15} className="cursor-pointer" />
            </span>
          </div>
          <div className="flex cursor-pointer items-center gap-9 p-3 border-r text-[var(--badge)] border-r-zinc-300">
            <p>Create another</p>
            <span>
              <Plus size={15} />
            </span>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="w-full flex h-full">
          <section className="w-3/4 border-r h-full border-zinc-200 px-2 py-5">
            <motion.div
              initial={{
                rotateX: -180,
                opacity: 0,
              }}
              animate={{
                rotateX: 0,
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="grid grid-cols-5 gap-5 "
            >
              <button className="btn btn-sm rounded-xl btn-neutral">
                <Plus size={15} /> New Item
              </button>
              <button className="btn btn-sm rounded-xl">Change price</button>
              <button className="btn btn-sm rounded-xl">Change quantity</button>
              <button className="btn btn-sm btn-error btn-soft rounded-xl">
                Delete Item
              </button>
            </motion.div>

            <motion.div
              initial={{
                width: 0,
                opacity: 0,
              }}
              animate={{
                width: "100%",
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.5,
              }}
              className="relative"
            >
              <input
                type="search"
                placeholder="Search by Item name/Item code"
                className="my-3 p-1 border rounded-md border-zinc-200 px-8 w-full"
              />
              <Search
                className="absolute top-5 left-2 text-zinc-500"
                size={15}
              />
            </motion.div>

            {/* table */}
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
              className="flex-1 overflow-auto mt-5 rounded-box border border-base-content/5 bg-base-100"
            >
              <table className="table table-zebra">
                {/* head */}
                <thead>
                  <tr className="bg-zinc-200">
                    <th>NO</th>
                    <th>ITEMS</th>
                    <th>ITEMS CODE</th>
                    <th>MRP</th>
                    <th className=" flex items-center">
                      SP (<IndianRupee size={10} />)
                    </th>
                    <th>QUANTITY</th>
                    <th className=" flex items-center">
                      AMOUNT (<IndianRupee size={10} />)
                    </th>
                  </tr>
                </thead>
                <tbody>{/* ITEM LIST IS RENDERED HERE */}</tbody>
              </table>
            </motion.div>
          </section>

          {/* Right section */}
          <POSTotalSidebar data={data} setData={setData} />
        </div>
      </section>
    </main>
  );
};

export default DashboardPOS;
