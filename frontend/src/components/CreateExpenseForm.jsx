import {
  ArrowLeft,
  ChevronDown,
  IndianRupee,
  Plus,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const CreateExpenseForm = ({ setOpenCreateExpense }) => {
  const [checked, setChecked] = useState();

  return (
    <main className="h-screen w-full flex">
      <section className="w-full h-full p-4 bg-zinc-100">
        <div className=" h-full rounded-md border-zinc-200 border shadow bg-white">
          {/* navigation div */}
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
            className="flex items-center justify-between p-3 border-b-gray-200"
          >
            <div className="flex items-center justify-center">
              <ArrowLeft onClick={() => setOpenCreateExpense(false)} />
              <p className="font-medium ml-2">Create Expenses</p>
            </div>
            <div className="flex gap-3 items-center">
              <div className="border p-[6.9px] border-zinc-200 rounded-sm">
                <Settings size={16} className="text-zinc-500" />
              </div>
              <div>
                <button className="btn text-sm font-norma btn-sm">
                  Cancel
                </button>
              </div>
              <div>
                <button className="btn btn-sm bg-[var(--primary-btn)] w-35 text-sm font-normal">
                  Save
                </button>
              </div>
            </div>
          </motion.div>

          {/* content div */}
          <div className="w-full bg-gray-50 h-80 grid grid-cols-2 gap-4 p-3">
            {/* first card */}
            <motion.div
              initial={{
                translateX: -100,
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
              className="border border-zinc-200 bg-white rounded-md  px-2"
            >
              {/* first field */}
              <div className="border flex justify-between p-2 rounded-md m-2 border-zinc-200">
                <p className="text-xs text-zinc-800 p-1">Expense With GST</p>
                <input
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  type="checkbox"
                  className="toggle text-zinc-800"
                />
              </div>
              {/* seconde field */}
              <div className=" w-full p-2 rounded-md border-zinc-200 flex flex-col">
                <p className="text-xs text-zinc-800">Expense Category</p>
                <div className="dropdown dropdown-center w-full ">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn w-full text-sm flex items-center justify-between bg-white"
                  >
                    <span className="text-xs font-normal text-zinc-500">
                      Select Category
                    </span>
                    <ChevronDown size={16} />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-sm text-xs  text-zinc-500"
                  >
                    <li>
                      <a>Bank Fee Charges</a>
                    </li>
                    <li>
                      <a>Employee Salary & Charges</a>
                    </li>
                    <li>
                      <a>Printing and Stationery</a>
                    </li>
                    <li>
                      <a>Raw Material</a>
                    </li>
                    <li>
                      <a>Rent Expense</a>
                    </li>
                    <li>
                      <a>Repair and Maintenance</a>
                    </li>
                    <li>
                      <a>Telephone & Internet Expense</a>
                    </li>
                    <li>
                      <a>Transportation & Travel Expense</a>
                    </li>
                    <li>
                      <a>
                        <button className="btn btn-dash btn-info w-full">
                          Add/Manage Category
                        </button>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              {/* third field */}
              <div className=" w-full p-2 flex flex-col">
                <p className="text-xs text-zinc-800">Expense Number</p>
                <input type="text" placeholder="" className="input" />
              </div>
            </motion.div>

            {/* second card */}
            <motion.div
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
              className="border border-zinc-300 rounded-md bg-white mx-4 p-3 "
            >
              <div className="grid grid-cols-2 gap-4 ">
                {/* first field */}
                <div className=" w-full rounded-md  flex flex-col">
                  <p className="text-xs text-zinc-800">Expense Number</p>
                  <input type="text" placeholder="" className="input" />
                </div>
                {/* second field */}
                <div className="">
                  <p className="text-xs text-zinc-800">Expense Number</p>
                  <input
                    type="date"
                    className="input text-xs text-zinc-800 mt"
                  />
                </div>
                {/* third field */}
                <div className=" w-full rounded-md flex flex-col">
                  <p className="text-xs text-zinc-800">Expense Category</p>
                  <div className="dropdown dropdown-center w-full ">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn w-full text-sm flex items-center justify-between bg-white"
                    >
                      <span className="text-xs font-normal text-zinc-500">
                        Select
                      </span>
                      <ChevronDown size={16} />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-sm text-xs  text-zinc-500"
                    >
                      <li>
                        <a>Cash</a>
                      </li>
                      <li>
                        <a>UPI</a>
                      </li>
                      <li>
                        <a>Cheque</a>
                      </li>
                      <li>
                        <a>Card</a>
                      </li>
                      <li>
                        <a>Net Banking</a>
                      </li>
                      <li>
                        <a>Bank Transfer</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* TextArea */}
              <div>
                <p className="text-xs text-zinc-800 my-3">Note</p>
                <textarea
                  name=""
                  id=""
                  className="w-full rounded-md border-zinc-200 border h-20"
                ></textarea>
              </div>
            </motion.div>
          </div>
          {/* bottom section */}
          {checked !== undefined && (
            <div className="border-b border-gray-300 p-2">
              <button
                className={`${
                  checked ? "w-full" : "w-200"
                } flex items-center border border-info text-info cursor-pointer my-2 p-2 text-xs font-medium rounded-md border-dashed justify-center`}
              >
                <Plus size={8} />
                Add Item
              </button>
            </div>
          )}

          {/* Toggle section */}
          {checked ? (
            <>
              <div className="border border-zinc-300 flex ">
                <div className="w-9/12 p-2 border-r border-r-gray-300 bg-red-500">
                  <p className="text-right">Total</p>
                </div>
                <div className=" flex">
                  <div className="flex items-center bg-green-800 w-40 justify-end">
                    <IndianRupee size={11} />
                    <span className="">0</span>
                  </div>
                  <div className="bg-green-800 w-40 flex items-center  justify-end">
                    <span>0</span>
                  </div>
                  <div className="flex items-center  bg-green-800 w-40 justify-end">
                    <IndianRupee size={11} />
                    <span>0</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
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
              }}
              className="flex justify-between w-200 items-center"
            >
              <div className="p-3">
                <span>Total Expense Amount</span>
              </div>
              <div className="border border-gray-300 w-60 rounded-md h-7 flex items-center justify-between bg-[#E9ECF1]">
                <div className="bg-gray-50 w-full h-full rounded-tl-md rounded-bl-md flex items-center justify-center text-zinc-500">
                  <IndianRupee size={11} />
                </div>
                <div>
                  <input
                    type="number"
                    className="outline-none text-right pr-2"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CreateExpenseForm;
