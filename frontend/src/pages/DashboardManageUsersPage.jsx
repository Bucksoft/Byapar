import { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { LuUsers } from "react-icons/lu";
import { IoIosPulse } from "react-icons/io";
import manageuser from "../assets/manageuser.png";
import { FaPlus } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { LuChevronsUpDown } from "react-icons/lu";
import { LuSquareActivity } from "react-icons/lu";
import manageuser1 from "../assets/manageuser1.png";
import { motion } from "framer-motion";

const DashboardManageUsersPage = () => {
  const [menu, setMenu] = useState("users");
  return (
    <main className="flex p-2 bg-zinc-100 max-h-screen overflow-y-scroll border border-gray-200 shadow-2xs gap-2 ">
      <div className="w-full h-screen border border-zinc-200 bg-white rounded ">
        {/* Header Seaction */}
        <div className="flex flex-col w-full h-screen p-4">
          <div className="flex items-center justify-between ">
            <p className="text-lg">Manage Users</p>
            <p className="p-2 border border-[var(--primary-border)]">
              <AiOutlineQuestionCircle size={15} />
            </p>
          </div>

          <section className="flex py-4 gap-3">
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
              }}
              onClick={() => setMenu("users")}
              className={`  ${
                menu === "users" ? "border border-info/20 bg-info/5" : ""
              } border flex flex-col gap-2 p-3 border-[var(--primary-border)] w-1/3 cursor-pointer rounded-lg hover:bg-[#F1F0FC] hover:border-indigo-700 `}
            >
              <div
                className={"text-xs  flex gap-2  items-center text-green-700 "}
              >
                <LuUsers />
                Number of Users
              </div>
              <div className="text-lg font-semibold">1</div>
            </motion.div>

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
                delay: 0.3,
              }}
              onClick={() => setMenu("activites")}
              className={`  ${
                menu === "activites" ? "border border-info/20 bg-info/5" : ""
              } border flex flex-col p-3 gap-2 cursor-pointer border-[var(--primary-border)] w-1/3 rounded-lg hover:bg-[#F1F0FC] hover:border-indigo-700 `}
            >
              <div
                className={`  text-xs flex gap-2  items-center text-info   `}
              >
                <IoIosPulse />
                Activities Performed
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">0</p>
                <p className="text-xs text-gray-600 p-1 font-semibold rounded bg-gray-200">
                  Last 30 Days
                </p>
              </div>
            </motion.div>
          </section>

          {/* Medium Part */}
          {menu === "users" ? (
            <>
              {/* User Section */}
              <section className="flex flex-col items-center gap-3 justify-center">
                <motion.img
                  initial={{
                    opacity: 0,
                    filter: "blur(10px)",
                  }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                  }}
                  transition={{
                    ease: "easeInOut",
                    duration: 0.3,
                  }}
                  src={manageuser}
                  alt="/src/assets/manageuser"
                  className="w-3/7"
                />
                <motion.p
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
                  className="font-semibold text-lg"
                >
                  Give access to users and monitor their actions
                </motion.p>
                <motion.p
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
                  className="text-sm text-gray-500"
                >
                  Manage your business more efficiently with full control and
                  vision
                </motion.p>
                <motion.div
                  initial={{
                    translateY: 100,
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
                  className="flex gap-4"
                >
                  <button className="btn bg-[var(--primary-btn)] btn-sm ">
                    <FaPlus />
                    Add New User
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      document.getElementById("my_modal_2").showModal()
                    }
                  >
                    <FaPlus />
                    Add Your CA
                  </button>

                  {/* Add your CA Popup */}
                  <dialog id="my_modal_2" className="modal ">
                    <div className="modal-box">
                      <h3 className="font-medium">Add User</h3>
                      <div className="text-xs w-full grid grid-cols-2 gap-3 mt-2  rounded-md p-2">
                        <div>
                          <label htmlFor="Name">Name</label>
                          <input
                            type="text"
                            placeholder="Enter name"
                            className="input input-sm mb-5"
                          />
                          <label htmlFor="Name" className="">
                            User Role
                          </label>
                          <select
                            defaultValue="Pick a color"
                            className="select select-sm"
                          >
                            <option disabled={true} className="hidden">
                              CA
                            </option>
                            <option>CA</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="Name">Mobile Number</label>
                          <input
                            type="text"
                            placeholder="Enter mobile number"
                            className="input input-sm mb-5"
                          />
                          <label htmlFor="Name" className="">
                            Email ID
                          </label>
                          <input
                            type="text"
                            placeholder="Enter email"
                            className="input input-sm mb-5"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button className="btn btn-sm w-3/12 mr-2 bg-[var(--primary-btn)]">
                          Save
                        </button>
                      </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                </motion.div>
              </section>
            </>
          ) : (
            <>
              {/* Activites section */}
              <section className="flex flex-col">
                <motion.div
                  initial={{
                    transitionY: -100,
                    opacity: 0,
                  }}
                  animate={{
                    transitionY: 0,
                    opacity: 1,
                  }}
                  transition={{
                    ease: "easeInOut",
                  }}
                  className="flex items-center gap-3"
                >
                  <button className="btn btn-sm">
                    <IoSearchOutline size={16} />
                  </button>
                  <select
                    defaultValue="All transactions"
                    className="select select-sm"
                  >
                    <option disabled={true}>All transactions</option>
                    <option>Crimson</option>
                    <option>Amber</option>
                    <option>Velvet</option>
                  </select>
                  <select
                    defaultValue="Last 30 days"
                    className="select select-sm"
                  >
                    <option disabled={true}>Last 30 days</option>
                    <option>Crimson</option>
                    <option>Amber</option>
                    <option>Velvet</option>
                  </select>
                </motion.div>
              </section>

              <section className="py-3">
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
                    delay: 0.3,
                  }}
                  className="border border-[var(--primary-border)] rounded"
                >
                  <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                      {/* head */}
                      <thead>
                        <tr className="bg-base-300">
                          <th className="flex items-center gap-1">
                            Time of Activity
                            <LuChevronsUpDown />
                          </th>
                          <th>Activity</th>
                          <th>Transaction Details</th>
                          <th>Performed By</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                  <div className="flex flex-col items-center justify-center py-18">
                    <p className="text-gray-400  ">
                      <LuSquareActivity size={100} />
                    </p>
                    <p className="text-xs text-gray-600 ">
                      You have performed 0 activities
                    </p>
                  </div>
                </motion.div>

                <section className="py-3">
                  <motion.div
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                    }}
                    animate={{
                      filter: "0px",
                      opacity: 1,
                    }}
                    transition={{
                      ease: "easeInOut",
                      duration: 0.3,
                    }}
                    className="border border-[var(--primary-border)] flex items-center justify-between rounded px-3 bg-[#E3E9ED]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={manageuser1}
                        alt="/src/assets/manageuser1"
                        className="w-30"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-bold">
                          Interested to see how your users create and edit
                          transactions?
                        </p>
                        <p className="text-sm">
                          With User Activity Tracker, you can get full
                          visibility into your user’s activities
                        </p>
                      </div>
                    </div>
                    <button className="btn bg-[var(--primary-btn)] btn-sm">
                      Track All Activities
                    </button>
                  </motion.div>
                </section>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default DashboardManageUsersPage;
