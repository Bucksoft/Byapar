import React, { useState } from "react";
import { TbDeviceMobileMessage } from "react-icons/tb";
import referandearn from "../assets/referandearn.png";
import { LuIndianRupee } from "react-icons/lu";
import { BsBank } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineUsers } from "react-icons/hi";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import { FiUserX } from "react-icons/fi";
import { RiShareLine } from "react-icons/ri";
import { FiDownload } from "react-icons/fi";
import { IoGiftSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { MdCopyAll } from "react-icons/md";

const DashboardReferAndEarnPage = () => {
  const [menu, setMenu] = useState("signed_up");
  const [showPopup, setShowPopup] = useState(false);
  return (
    <main className="flex p-2 border max-h-screen overflow-y-scroll border-gray-200 shadow-2xs rounded-2xl ">
      <div className="w-full ">
        {/* Header */}
        <header className="flex w-30/40  items-center">
          <p className="text-lg p-5 font-semibold">Refer & Earn</p>
        </header>

        {/* Gift Section */}
        <section className="px-6">
          <div className="flex border bg-gradient-to-r from-[#020211] to-[#6E1A66] shadow rounded-2xl border-gray-300 ">
            <div className=" w-full p-5 flex-col">
              <div className="flex gap-2">
                <p className="text-3xl text-yellow-500 font-bold">Earn ₹501</p>
                <p className="text-3xl text-white font-bold">
                  for each Referral
                </p>
              </div>
              <div className="flex text-lg gap-2 py-3">
                <p className=" font-semibold text-white">
                  When your friend buys a plan, they'll get
                </p>
                <p className=" font-semibold text-yellow-500"> flat 15% </p>
                <p className=" font-semibold text-white gap-1">
                  off on the plan purchase
                </p>
              </div>
              <div className="flex ho gap-5">
                <button
                  onClick={() => setShowPopup(true)}
                  className="text-sm border text-gray-700 hover:bg-gray-300 rounded bg-white px-11 py-2 font-semibold"
                >
                  Refer Now
                </button>
                <p className="text-sm flex gap-2 text-white items-center font-semibold">
                  <TbDeviceMobileMessage />
                  Send Code to my device
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center ">
              <img
                src={referandearn}
                alt="/src/assets/referandearn"
                className="w-70"
              />
            </div>
          </div>
        </section>

        {/* Reword Earn Seaction */}
        <section className="p-6">
          <div className="flex flex-col border border-gray-100 shadow  rounded-2xl ">
            <p className="text-lg p-4 font-bold">Rewards Earned</p>
            <div className="flex justify-between p-4 gap-2">
              <div className="border rounded border-gray-300 shadow bg-white w-1/2">
                <div className="flex p-3 flex-col">
                  <p className="text-sm flex items-center text-blue-600">
                    <HiOutlineCurrencyRupee size={20} />
                    Total Claimed
                  </p>
                  <p className=" flex items-center text-2xl">
                    <LuIndianRupee size={16} />
                    0.0
                  </p>
                </div>
              </div>
              <div className="border rounded border-gray-300 shadow bg-white w-1/2">
                <div className="flex p-3 flex-col">
                  <p className="text-sm flex items-center text-green-600">
                    <BsBank />
                    Ready to Withdraw
                  </p>
                  <p className=" flex items-center text-2xl">
                    <LuIndianRupee size={16} />
                    0.0
                  </p>
                </div>
              </div>
            </div>

            {/* Refer Now Seaction */}
            <div className="flex items-center w-full border-b border-gray-300">
              <button
                onClick={() => setMenu("signed_up")}
                className={`text-base cursor-pointer gap-2 ${
                  menu === "signed_up" && "bg-info/10 text-info"
                } flex items-center px-5 font-semibold p-2 mr-2`}
              >
                <HiOutlineUser />
                Signed up
              </button>
              <button
                onClick={() => setMenu("Plan_purchased")}
                className={` text-base cursor-pointer gap-2 ${
                  menu === "purchased_user" && "bg-info/10 text-info"
                } cursor-pointer gap-2 flex items-center font-semibold`}
              >
                <HiOutlineUsers />
                Plan Purchased
              </button>
            </div>
            {menu === "signed_up" ? (
              <>
                <div className="w-full flex flex-col items-center justify-center h-60  ">
                  <p className="text-gray-500 mb-2 text-bold">
                    <FiUserX size={50} />
                  </p>
                  <p className="text-base mb-2 text-gray-600 ">
                    No signed up users yet!
                  </p>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="text-base text-white px-5 py-2 hover:bg-blue-400 rounded bg-blue-600 font-bold"
                  >
                    Refer Now
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-full flex flex-col items-center justify-center h-60 ">
                  <p className="text-gray-500 mb-2 text-bold">
                    <FiUserX size={50} />
                  </p>
                  <p className="text-base mb-2 text-gray-600 ">
                    No plan purchased users yet!
                  </p>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="text-base  text-white px-5 py-2 hover:bg-blue-400 rounded bg-blue-600 font-bold"
                  >
                    Refer Now
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        <div className="w-full mb-4">
          <p className="text-xl ml-7  font-semibold">How it works?</p>
        </div>

        {/* Footer Section */}
        <section>
          <div className="flex w-full items-center py-2 justify-between">
            <div className="flex flex-col ml-6 border border-gray-300 shadow rounded-2xl w-10/40 items-center justify-center py-8">
              <p className="text-blue-600 mb-4 font-bold">
                <RiShareLine size={30} />
              </p>
              <p className="text-base">1. Share the referral link with your</p>
              <p className="text-base">friends</p>
            </div>

            <div className="flex flex-col ml-6 border border-gray-300 shadow rounded-2xl w-10/40 items-center justify-center py-8">
              <p className="text-green-600 mb-4 font-bold">
                <FiDownload size={30} />
              </p>
              <p className="text-base">
                2. Your friend download myBillBook and
              </p>
              <p className="text-base">subscribe the plan</p>
            </div>

            <div className="flex flex-col ml-6 border border-gray-300 shadow rounded-2xl w-10/40 items-center justify-center mr-6 py-10">
              <p className="text-yellow-500 mb-4 font-bold">
                <IoGiftSharp size={30} />
              </p>
              <p className="text-base">
                3. You earn ₹501, they get 15% discount
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Pop-up Section */}
      {showPopup && (
        <div className="absolute bg-black/77 h-screen w-full flex items-center justify-center">
          <div className="flex flex-col bg-zinc-200 bg-  rounded-lg items-center justify-between">
            <div className="border-b px-4 flex items-center font-semibold border-zinc-400 justify-between w-full py-2">
              <h1>Refer Now</h1>
              <button
                className="cursor-pointer"
                onClick={() => setShowPopup(false)}
              >
                <RxCross2 />
              </button>
            </div>
            <div className="flex  flex-col border-b border-gray-300 items-center justify-between p-4 gap-2">
              <input
                type="text "
                placeholder=" Search Party Name / Phone Number"
                className="w-110 text-sm font-semibold text-gray-600 border rounded   hover:border-blue-500 border-gray-300 p-2 "
              />
              <div className="flex gap-3 justify-between items-center">
                <button className="text-sm flex items-center text-shadow-sky-500 gap-2 border border-blue-300 hover:bg-cyan-400 hover:border-blue-500 bg-blue-300 font-semibold rounded p-2">
                  <MdCopyAll size={16} />
                  Copy Code
                </button>
                <button className="text-sm text-neutral-600  bg-gray-400 fonr-semibold rounded p-2">
                  Refer Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardReferAndEarnPage;
