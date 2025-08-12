import {
  IndianRupee,
  Plus,
  Search,
  Settings,
  SquarePen,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const DashboardPOS = () => {
  return (
    <main className="h-full overflow-y-scroll p-2">
      <section className="h-full w-full bg-white rounded-lg p-1">
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
          <button className="btn btn-sm">
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
              <button className="btn btn-sm ">
                <Plus size={15} /> New Item
              </button>
              <button className="btn btn-sm">Change price</button>
              <button className="btn btn-sm">Change quantity</button>
              <button className="btn btn-sm text-error bg-error/10">
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
                className="my-3 p-1 border rounded-md border-zinc-400  px-8 w-full"
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
              className="overflow-x-auto mt-5 rounded-box border border-base-content/5 bg-base-100"
            >
              <table className="table">
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
                <tbody>
                  {/* row 1 */}
                  <tr>
                    <th>1</th>
                    <td>Cy Ganderton</td>
                    <td>Quality Control Specialist</td>
                    <td>Blue</td>
                  </tr>
                  {/* row 2 */}
                  <tr>
                    <th>2</th>
                    <td>Hart Hagerty</td>
                    <td>Desktop Support Technician</td>
                    <td>Purple</td>
                  </tr>
                  {/* row 3 */}
                  <tr>
                    <th>3</th>
                    <td>Brice Swyre</td>
                    <td>Tax Accountant</td>
                    <td>Red</td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          </section>

          {/* Right section */}
          <motion.section
            initial={{
              translateX: 100,
              opacity: 0,
            }}
            animate={{
              translateX: 0,
              opacity: 1,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="p-4"
          >
            <div className="grid grid-cols-2 text-xs gap-3">
              <button className="btn btn-sm">Add Discount</button>
              <button className="btn btn-sm text-nowrap">
                Add Additional Charge
              </button>
            </div>

            <div className="border mt-4 rounded-md border-zinc-200">
              <h2 className="p-2 border-b border-zinc-200 bg-zinc-200 text-sm font-medium">
                Bill Details
              </h2>
              <div className="p-2 border-b border-zinc-200">
                <p className="flex items-center justify-between">
                  Sub Total
                  <span className="flex items-center">
                    <IndianRupee size={13} />0
                  </span>{" "}
                </p>
                <p className="flex items-center justify-between mt-2">
                  Tax
                  <span className="flex items-center">
                    <IndianRupee size={13} />0
                  </span>{" "}
                </p>
              </div>
              <h2 className="p-2 border-b text- flex items-center justify-between border-zinc-200 bg-zinc-200  font-medium">
                Total Amount
                <span className="flex items-center">
                  <IndianRupee size={13} />0
                </span>
              </h2>
            </div>

            <div className="border mt-4 rounded-md border-zinc-200">
              <h2 className="p-2 border-b border-zinc-200 bg-zinc-200 text-sm font-medium">
                Received Amount
              </h2>
              <div className="p-2 border-b border-zinc-200">
                <p className="flex items-center justify-between">
                  <span className="flex items-center w-full">
                    <IndianRupee size={13} />0
                  </span>{" "}
                  <select defaultValue="Cash" className="select select-sm">
                    <option disabled={true}>Cash</option>
                  </select>
                </p>
              </div>
            </div>

            <div className="border mt-4 rounded-md border-zinc-200">
              <h2 className="p-2 border-b border-zinc-200 bg-zinc-200 text-sm font-medium">
                Customer Details
              </h2>
              <div className="p-2 border-b border-zinc-200 text-xs">
                <p className="flex items-center justify-between">
                  <span className="flex items-center w-full">Cash Sale</span>{" "}
                  <SquarePen size={13} />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 p-4">
              <button className="btn btn-sm btn-soft w-1/2 bg-[var(--primary-btn)]/20">
                Save & Print
              </button>
              <button className="btn btn-sm w-1/2 bg-[var(--primary-btn)]">
                Save Bill
              </button>
            </div>
          </motion.section>
        </div>
      </section>
    </main>
  );
};

export default DashboardPOS;
