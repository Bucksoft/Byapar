import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { LuUsers } from "react-icons/lu";
import { IoIosPulse } from "react-icons/io";
import manageuser from "../assets/manageuser.png";
import { FaPlus } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { LuChevronsUpDown } from "react-icons/lu";
import { LuSquareActivity } from "react-icons/lu";
import manageuser1 from "../assets/manageuser1.png";

const DashboardManageUsersPage = () => {
  const [menu, setMenu] = useState("users");
  return (
    <main className="flex p-2 bg-white border border-gray-200 shadow-2xs gap-2 ">
      <div className="w-full h-screen border border-gray-300 rounded ">
        {/* Header Seaction */}
        <div className="flex flex-col w-full h-screen p-4">
          <div className="flex items-center justify-between ">
            <p className="text-2xl ">Manage Users</p>
            <p className="p-2 border border-gray-300">
              <AiOutlineQuestionCircle size={15} />
            </p>
          </div>

          <section className="flex py-4 gap-3">
            <div
              onClick={() => setMenu("users")}
              className="border flex flex-col gap-2 p-3 border-gray-300 w-1/3 cursor-pointer rounded-lg hover:bg-[#F1F0FC] hover:border-indigo-700 "
            >
              <div className="text-xs flex gap-2  items-center text-green-700 ">
                <LuUsers />
                Number of Users
              </div>
              <div className="text-lg font-semibold">1</div>
            </div>

            <div
              onClick={() => setMenu("activites")}
              className="border flex flex-col p-3 gap-2 cursor-pointer border-gray-300 w-1/3 rounded-lg hover:bg-[#F1F0FC] hover:border-indigo-700 "
            >
              <div className="text-xs flex gap-2  items-center text-info   ">
                <IoIosPulse />
                Activities Performed
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">0</p>
                <p className="text-xs text-gray-600 p-1 font-semibold rounded bg-gray-200">
                  Last 30 Days
                </p>
              </div>
            </div>
          </section>

          {/* Medium Part */}
          {menu === "users" ? (
            <>
              {/* User Section */}
              <section className="flex flex-col items-center gap-3 justify-center">
                <img
                  src={manageuser}
                  alt="/src/assets/manageuser"
                  className="w-3/7"
                />
                <p className="font-semibold text-lg">
                  Give access to users and monitor their actions
                </p>
                <p className="text-sm text-gray-500">
                  Manage your business more efficiently with full control and
                  vision
                </p>
                <div className="flex gap-4">
                  <button className="bg-info text-white p-2 gap-1 cursor-pointer flex items-center rounded font-bold text-sm px-5 ">
                    <FaPlus />
                    Add New User
                  </button>
                  <button className="text-sm text-gray-500 border gap-1 cursor-pointer  hover:text-gray flex items-center border-gray-300 rounded p-2 px-5">
                    <FaPlus />
                    Add Your CA
                  </button>
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Activites section */}
              <section className="flex flex-col">
                <div className="flex items-center gap-3">
                  <button className="text-gray border border-gray-300 p-2 rounded">
                    <IoSearchOutline />
                  </button>
                  <button className="flex items-center bg-[#F6F7F7] border border-gray-300 rounded p-2 gap-16 text-sm text-gray-400">
                    All Transactions
                    <IoIosArrowDown />
                  </button>
                  <button className="flex items-center justify-between bg-[#F6F7F7] border border-gray-300 rounded p-2 gap-16 ">
                    <p className="text-gray-400 text-sm flex items-center gap-2 ">
                      <CiCalendar />
                      Last 30 Days
                    </p>
                    <p className="text-gray-400">
                      <IoIosArrowDown />
                    </p>
                  </button>
                </div>
              </section>

              <section className="py-3 ">
                <div className="border border-gray-300 rounded">
                  <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                      {/* head */}
                      <thead>
                        <tr>
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
                </div>

                <section className="py-3">
                  <div className="border border-gray-300 flex items-center justify-between rounded px-3 bg-[#E3E9ED]">
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
                    <button className="text-white text-sm font-bold p-2 px-2 bg-[#7063D8] cursor-pointer rounded hover:bg-indigo-400">
                      Track All Activities
                    </button>
                  </div>
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
