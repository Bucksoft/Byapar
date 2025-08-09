import { Keyboard, MessageCircle } from "lucide-react";
import { IoMdAttach } from "react-icons/io";
import suggestion from "../assets/suggestion.png";
import personhandshake from "../assets/Personhandshake.png";
import truckwithinvoice from "../assets/truckwithinvoice.png";
import phonesms from "../assets/phoneSMS.png";
import desktop from "../assets/Desktop.png";
import scanner from "../assets/scanner.png";
import warehouse from "../assets/Warehouse.png";
import { useState } from "react";
import { IoLogoWechat } from "react-icons/io5";
import { motion } from "framer-motion";

const DashboardAccountPage = () => {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <main className="h-screen w-full relative flex">
      {/* Chatbot */}
      {chatOpen && (
        <div className="flex items-end justify-between flex-col absolute bottom-5 right-5  w-1/4">
          <div className="border-b border-b-zinc-300 rounded-md bg-white border w-full overflow-hidden">
            {/* header */}
            <div className="border-b border-b-black bg-[var(--primary-btn)] p-2 mb-2">
              <span className="text-lg font-semibold text-white pl-5">
                Byapar Chatbot
              </span>
            </div>
            {/* messages */}
            <div className="pt-3">
              <div className="pl-5 flex flex-col">
                <span className="text-[10px] p-1 w-fit rounded-xs bg-gray-100">
                  Hi, welcome to Byapar Support!
                </span>
                <span className="text-[8px] p-1 mb-2">8:33 pm, Jul 30</span>
              </div>

              <div className="pl-5 flex flex-col">
                <span className="text-[10px] p-1 w-fit rounded-xs bg-gray-100">
                  Would you like to chat with an Agent?
                </span>
                <span className="text-[8px] p-1 mb-2">8:33 pm, Jul 30</span>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="p-2 w-full">
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input"
                  />
                </div>
                <div className="p-2 rounded-sm flex items-center justify-center border border-zinc-300 text-gray-500 ">
                  <IoMdAttach size={25} />
                </div>
              </div>
            </div>
          </div>

          <div className=" w-12 h-12 flex items-center justify-center bg-[var(--primary-btn)] rounded-full text-white p-3">
            <button className="p-1" onClick={() => setChatOpen(false)}>
              <IoLogoWechat size={22} />
            </button>
          </div>
        </div>
      )}

      <section className="w-full p-2 bg-gray-200">
        <div className=" shadow shadow-gray-200 h-full rounded-md bg-white">
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
            className="flex justify-between border-b border-b-zinc-300 p-3 "
          >
            {/* navigation left side*/}
            <div className=" flex flex-col">
              <span className="text-md">Account Settings</span>
              <span className="text-[12px] text-zinc-400">
                Manage your account and subscription
              </span>
            </div>
            {/* navigation right side*/}
            <div className="flex items-center space-x-3 mr-5">
              <Keyboard />
              <button
                className="btn btn-soft btn-info btn-sm"
                onClick={() => setChatOpen(!chatOpen)}
              >
                <MessageCircle size={16} />
                Chat Support
              </button>
              <button className="btn btn-info btn-sm">Cancel</button>
              <button className="btn btn-info btn-sm">Save Changes</button>
            </div>
          </motion.div>

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
            className="border-b  border-b-zinc-300 p-2 flex items-center justify-center bg-indigo-50"
          >
            <span className="font-semibold pr-4 ">
              Help us make Byapar better
            </span>
            <button className="btn btn-info btn-sm">
              <img src={suggestion} alt="" className="h-5 font-black" />
              <span className=""> Share Suggestion</span>
            </button>
          </motion.div>

          <div className="border-b border-b-zinc-300 pl-3 py-1 bg-gray-50">
            <span className="text-xs">General Information</span>
          </div>

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
              delay: 0.5,
            }}
            className="border-b border-b-zinc-300 p-3 flex "
          >
            <form action="" className="flex">
              <div>
                <label htmlFor="name" className="text-xs pr-40">
                  Name
                </label>
                <input type="text" placeholder="" className="input input-sm" />
              </div>
              <div>
                <label htmlFor="number" className="text-xs pr-40">
                  Number
                </label>
                <input
                  type="number"
                  placeholder=""
                  className="input input-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-xs pr-40">
                  Email
                </label>
                <input type="email" placeholder="" className="input input-sm" />
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              filter: "0px",
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="border-b border-b-zinc-300 pl-3 py-1 bg-gray-50"
          >
            <span className="text-xs">
              Referral code for subscription discount
            </span>
          </motion.div>

          <div className="border-b border-b-zinc-300 p-3">
            <input
              type="text"
              placeholder="Type here referral code"
              className="input w-fit input-sm"
            />
            <button className="btn btn-info ml-5 px-15 btn-sm">Apply</button>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              filter: "0px",
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="border-b border-b-zinc-300 pl-3 py-1 bg-gray-50"
          >
            <span className="text-xs">Subscription Plan</span>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              filter: "0px",
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="grid grid-cols-2"
          >
            {/* left */}
            <div className="pt-5 pl-3">
              <p className="text-xs">CURRENT PLAN</p>
              <p className="text-xl pt-2 font-medium">Free Trial Expired</p>
              <button className="btn btn-info mt-15 btn-sm">
                Buy Subscription Plan
              </button>
              {/* avatar */}
              <div className="flex items-center">
                <div>
                  <div className="avatar-group -space-x-6 pt-5">
                    <div className="avatar ">
                      <div className="w-7">
                        <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
                      </div>
                    </div>
                    <div className="avatar">
                      <div className="w-7">
                        <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
                      </div>
                    </div>
                    <div className="avatar">
                      <div className="w-7">
                        <img src="https://img.daisyui.com/images/profile/demo/averagebulk@192.webp" />
                      </div>
                    </div>
                    <div className="avatar">
                      <div className="w-7">
                        <img src="https://img.daisyui.com/images/profile/demo/wonderperson@192.webp" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-5 pl-2 text-xs">
                  <p>10,00,000+ Vyaparis running their </p>
                  <p>business on ByaPar premium</p>
                </div>
              </div>
            </div>
            {/* right */}
            <div className="p-5">
              <p className="text-sm pb-3">
                Upgrade your plan today and get access to premium features:
              </p>
              <div className="grid grid-cols-2 bg-gray-100 pr-5 rounded-sm">
                {/* left icon */}
                <div className="px-3 py-1 text-sm">
                  <div className="flex items-center py-1">
                    <img
                      src={personhandshake}
                      alt=""
                      className="h-10 w-10 pr-2"
                    />
                    <span>Multi User and Staff Access</span>
                  </div>
                  <div className="flex items-center py-1">
                    <img
                      src={truckwithinvoice}
                      alt=""
                      className="h-10 w-10 pr-2"
                    />
                    <span>Way Bill Generation</span>
                  </div>
                  <div className="flex items-center py-1">
                    <img src={phonesms} alt="" className="h-10 w-10 pr-2" />
                    <span>SMS Marketing</span>
                  </div>
                </div>
                {/* right icon */}
                <div className="px-3 py-1 text-sm">
                  <div className="flex items-center py-1">
                    <img src={warehouse} alt="" className="h-10 w-10 pr-2" />
                    <span>Multiple Businesses</span>
                  </div>
                  <div className="flex items-center py-1">
                    <img src={desktop} alt="" className="h-10 w-10 pr-2" />
                    <span>Desktop App</span>
                  </div>
                  <div className="flex items-center py-1">
                    <img src={scanner} alt="" className="h-10 w-10 pr-2" />
                    <span>Scan & Print Barcode</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default DashboardAccountPage;
