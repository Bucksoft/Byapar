import React from "react";
import { FaPlus } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { BsBank, BsCalendar } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { FaPlusMinus } from "react-icons/fa6";

const DashboardCashAndBank = () => {
  return (
    <>
      <main className=" h-screen w-full bg-white rounded-2xl  border border-gray-300">
        <header className="py-4   w-full bg-white  mb-2">
          <div className="w-full  flex  items-center justify-between px-5">
            <h1 className="text-xl font-semibold">Cash and Bank</h1>
            <div className="flex items-center justify-between gap-2">
              <button className="flex border border-gray-300 hover gap-2 px-4 py-2 btn btn-sm  rounded text-sm">
                <FaPlusMinus />
                Add/reduce Money
              </button>
              <button className="flex border border-gray-300 gap-2 btn btn-sm px-4 py-2 rounded text-sm">
                <FaArrowRightArrowLeft />
                Transfer Money
              </button>
              <button className="flex bg-[#4C3CCE] border border-gray-300 gap-2 px-4 py-2 items-center justify-center btn btn-sm rounded text-bold text-white">
                <FaPlus />
                Add New Account
              </button>
            </div>
          </div>
        </header>

        <section className="bg-white h-full flex">
          {/* left body */}
          <div className="w-1/4 bg-white border border-gray-300 h-full">
            <div className="h-23 flex bg-white items-center border-b border-zinc-300 justify-between p-4">
              <p className="text-sm">Total Balance:</p>
              <p className="flex items-center font-medium">
                <FaIndianRupeeSign /> 0
              </p>
            </div>
            <div className="h-10 flex bg-purple-50 items-center border-l border-b border-gray-300  justify-between p-4">
              <p className="text-sm text-gray-500 font-semibold">Cash</p>
            </div>
            <div className="h-23 flex bg-white items-center border-l border-b border-gray-300 justify-between p-4">
              <p className="text-sm">Cash in hand</p>
              <p className="flex items-center font-medium">
                <FaIndianRupeeSign /> 0
              </p>
            </div>
            <div className="h-10 flex bg-white items-center border-l border-b border-gray-300 justify-between p-4">
              <p className="text-sm text-gray-500 font-semibold">
                Bank Accounts
              </p>
              <p className="flex items-center font-semibold text-info cursor-pointer  text-xs gap-2">
                <FaPlus size={8} />
                Add New Bank
              </p>
            </div>
            <div className="h-23 flex bg-[#EEECFB] items-center justify-between border-b border-l border-gray-100 p-4">
              <p className="flex gap-2 text-sm">
                <BsBank />
                Unlinked Transactions
              </p>
              <p className="flex items-center font-medium">
                <FaIndianRupeeSign /> 0
              </p>
            </div>
          </div>

          {/* right body */}
          <div className=" w-3/4 bg-white ">
            <div className="flex bg-white py-4 items-center justify-between border border-gray-300 h-16 w-full">
              <div className=" flex bg-purple-100 items-center h-16 p-4 justify-between border-r border-t border-b border-gray-300">
                <p className="text-bold">Transactions</p>
              </div>
            </div>

            <div className="flex boredr border-gray-300 px-4 py-2 ">
              <div className="dropdown w-full ">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-wide btn-sm flex items-center justify-between  m-1"
                >
                  <div className="flex items-center gap-2">
                    <BsCalendar />
                    <span>Last Week</span>
                  </div>
                  <IoIosArrowDown />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-64 p-2 shadow-sm"
                >
                  <li>
                    <a>Today</a>
                  </li>
                  <li>
                    <a>Yesterday</a>
                  </li>
                  <li>
                    <a>This Week</a>
                  </li>
                  <li>
                    <a>Last Week</a>
                  </li>
                  <li>
                    <a>Last 7 days</a>
                  </li>
                  <li>
                    <a>This Month</a>
                  </li>
                  <li>
                    <a>Previous Month</a>
                  </li>
                </ul>
              </div>
              <button className="border border-gray-300  p-1  flex justify-center hover:bg-zinc-200 cursor-pointer rounded-lg text-zinc-500 items-center">
                <MdOutlineFileDownload size={25} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default DashboardCashAndBank;
