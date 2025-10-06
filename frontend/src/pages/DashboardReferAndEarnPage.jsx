import { useState } from "react";
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
import { motion } from "framer-motion";

const DashboardReferAndEarnPage = () => {
  const [menu, setMenu] = useState("signed_up");
  const [showPopup, setShowPopup] = useState(false);
  return (
    <main className="flex p-1 border max-h-screen overflow-y-scroll border-gray-200 shadow-2xs ">
      <div className="w-full ">
        {/* Header */}
        <motion.header
          initial={{
            translateY: -100,
            filter: "blur(10px)",
          }}
          animate={{
            translateY: 0,
            filter: "blur(0px)",
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.3,
          }}
          className="flex w-30/40  items-center"
        >
          <p className="text-lg p-5 ">Refer & Earn</p>
        </motion.header>

        {/* Gift Section */}
        <motion.section
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
          className="px-6"
        >
          <div className="flex border bg-gradient-to-r from-[#020211] to-[#6E1A66] shadow rounded-2xl border-[var(--primary-border)] ">
            <div className=" w-full p-2 px-4 flex-col">
              <div className="flex gap-2">
                <p className="text-2xl text-yellow-500 font-bold">Earn ₹501</p>
                <p className="text-2xl text-white font-bold">
                  for each Referral
                </p>
              </div>
              <div className="flex text-md gap-2 py-3">
                <p className=" font-semibold text-white">
                  When your friend buys a plan, they'll get
                </p>
                <p className=" font-semibold text-yellow-500"> flat 15% </p>
                <p className=" font-semibold text-white gap-1">
                  off on the plan purchase
                </p>
              </div>
              <div className="flex gap-5">
                <button
                  onClick={() => setShowPopup(true)}
                  className="btn btn-sm"
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
                className="w-60"
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>

        {/* Reword Earn Seaction */}
        <section className="p-6">
          <div className="flex flex-col border bg-white border-gray-100 shadow  rounded-2xl ">
            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
              }}
              className="text-lg p-4 font-bold"
            >
              Rewards Earned
            </motion.p>
            <div className="flex justify-between p-4 gap-2">
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
                className="border rounded border-[var(--primary-border)] shadow bg-white w-1/2"
              >
                <div className="flex p-3 flex-col bg-[var(--primary-btn)]/10">
                  <p className="text-sm flex items-center gap-2 text-blue-600">
                    <HiOutlineCurrencyRupee size={20} />
                    Total Claimed
                  </p>
                  <p className=" flex items-center text-2xl ml-7">
                    <LuIndianRupee size={16} />
                    0.0
                  </p>
                </div>
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
                className="border rounded border-[var(--primary-border)] shadow bg-white w-1/2"
              >
                <div className="flex p-3 flex-col bg-success/20">
                  <p className="text-sm flex items-center gap-2 text-green-600">
                    <BsBank />
                    Ready to Withdraw
                  </p>
                  <p className=" flex items-center text-2xl ml-5">
                    <LuIndianRupee size={16} />
                    0.0
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Refer Now Section */}
            <div className="flex items-center w-full border-b  border-[var(--primary-border)]">
              <button
                onClick={() => setMenu("signed_up")}
                className={`text-base cursor-pointer gap-2 ${
                  menu === "signed_up" &&
                  "bg-[var(--primary-btn)]/10 text-[var(--primary-btn)]"
                } flex items-center px-5 font-semibold p-2 mr-2`}
              >
                <HiOutlineUser />
                Signed up
              </button>
              <button
                onClick={() => setMenu("Plan_purchased")}
                className={` text-base cursor-pointer gap-2 ${
                  menu === "Plan_purchased" &&
                  "bg-[var(--primary-btn)]/10 text-[var(--primary-btn)]"
                } cursor-pointer gap-2 flex items-center px-5 p-2 mr-2 font-semibold`}
              >
                <HiOutlineUsers />
                Plan Purchased
              </button>
            </div>
            {menu === "signed_up" ? (
              <>
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                  className="w-full flex flex-col items-center justify-center h-60  "
                >
                  <p className="text-gray-500 mb-2 text-bold">
                    <FiUserX size={50} />
                  </p>
                  <p className="text-base mb-2 text-gray-600 ">
                    No signed up users yet!
                  </p>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="btn btn-sm btn-[var(--primary-btn)]"
                  >
                    Refer Now
                  </button>
                </motion.div>
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
                    className="btn btn-sm btn-[var(--primary-btn)]"
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
          <div className=" grid grid-cols-3 py-8">
            <div className="flex flex-col ml-6 bg-gradient-to-b from-zinc-200 to-zinc-100 border  border-[var(--primary-border)] shadow rounded-2xl  items-center justify-center py-8">
              <p className="text-blue-600 mb-4 font-bold">
                <RiShareLine size={30} />
              </p>
              <p className="text-base">1. Share the referral link with your</p>
              <p className="text-base">friends</p>
            </div>

            <div className="flex flex-col ml-6 border bg-gradient-to-b from-zinc-200 to-zinc-100 border-[var(--primary-border)] shadow rounded-2xl  items-center justify-center py-8">
              <p className="text-green-600 mb-4 font-bold">
                <FiDownload size={30} />
              </p>
              <p className="text-base">
                2. Your friend download myBillBook and
              </p>
              <p className="text-base">subscribe the plan</p>
            </div>

            <div className="flex flex-col ml-6 border bg-gradient-to-b from-zinc-200 to-zinc-100 border-[var(--primary-border)] shadow rounded-2xl  items-center justify-center mr-6 py-10">
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
            <div className="flex  flex-col border-b border-[var(--primary-border)] items-center justify-between p-4 gap-2">
              <input
                type="text "
                placeholder=" Search Party Name / Phone Number"
                className="w-110 text-sm font-semibold text-gray-600 border rounded   hover:border-blue-500 border-[var(--primary-border)] p-2 "
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
