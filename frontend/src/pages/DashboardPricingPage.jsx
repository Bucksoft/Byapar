import { useState } from "react";
import guarantee from "../assets/SaGaurantee.png";
import SettingPricingCard from "../components/SettingPricingCard";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import gst from "../assets/FileGST.png";
import handshake from "../assets/HandShake.png";
import foreigncurrency from "../assets/foreignexchange.png";
import bank from "../assets/Bank.png";
import invoice from "../assets/invoice.png";
import inventory from "../assets/Inventory.png";
import json from "../assets/json.png";
import AdvancedGstImage from "../assets/AdvancedGstImage.png";

import support from "../assets/support.png";
import scanner from "../assets/scanner.png";
import recycle from "../assets/recycle.png";
import printer from "../assets/printer.png";
import proforma from "../assets/proforma.png";
import excel from "../assets/excel.png";

import { motion } from "framer-motion";
import { pricing_Review, pricingPlans } from "../utils/constants";

const DashboardPricingPage = () => {
  const [open, setOpen] = useState(false);
  function getRandomColorHash() {
    const hex = Math.floor(Math.random() * 0xffffff).toString(16);
    return `#${hex.padStart(6, "0")}`;
  }
  return (
    <main className="max-h-screen w-full flex ">
      <div className=" bg-[#F7F7FE] w-full m-5 rounded-md overflow-auto hide-scroll">
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
          }}
          className="border rounded-md border-gray-200 m-5 p-3 bg-white  text-sm flex flex-col items-center justify-center"
        >
          <p className="text-lg">You don't have any active plan</p>
          <p className="text-md">
            Choose the best plan to continue using Byapar without any
            interruption
          </p>
          <div className="flex items-center justify-center">
            <img src={guarantee} alt="" className="h-10 w-10 " loading="lazy" />
            <p className="text-xs">7 days moneyback guarantee</p>
          </div>
        </motion.div>

        {/* pricing cards */}
        <div className="grid grid-cols-3 m-5 gap-2">
          {pricingPlans?.map((plan) => (
            <motion.div
              initial={{
                rotateY: -180,
                opacity: 0,
              }}
              animate={{
                rotateY: 0,
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
                delay: 0.3,
              }}
              key={plan.id}
              className=" border border-zinc-400 rounded-lg"
            >
              <SettingPricingCard plan={plan} />
            </motion.div>
          ))}
        </div>
        {/* accordion */}
        <div
          className={`border border-zinc-400 rounded-md mx-5 cursor-pointer
                    transition-all duration-300`}
        >
          <div
            onClick={() => setOpen(!open)}
            className={`flex items-center justify-between ${
              open && "border-b"
            }  px-2 border-zinc-400`}
          >
            <p className="py-3">Common features available for all plans</p>
            {open ? (
              <span className="">
                <FaSortUp />
              </span>
            ) : (
              <span className="">
                <FaSortDown />
              </span>
            )}
          </div>
          {open && (
            <>
              <motion.div
                initial={{
                  opacity: 0,
                  translateY: -100,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: 1,
                  translateY: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.2,
                }}
                className="grid grid-cols-2 "
              >
                {/* left portion */}
                <div>
                  <div className="p-2 mt-10 flex items-center ">
                    <img
                      src={gst}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">Unlimited Reports</p>
                  </div>
                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={handshake}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">Customer Relation Management (CRM)</p>
                  </div>
                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={foreigncurrency}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">Foreign Currency</p>
                  </div>

                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={bank}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">Manage Multiple Bank Accounts</p>
                  </div>
                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={invoice}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">Create Unlimited Invoices</p>
                  </div>
                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={json}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">GSTR in JSON Format</p>
                  </div>
                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={inventory}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">
                      Manage Inventory easily with Stock Adjustments
                    </p>
                  </div>
                </div>

                {/* right portion */}
                <div className="mb-5">
                  <div className="p-2 mt-10 flex items-center ">
                    <img
                      src={inventory}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">
                      Remove Byapar Branding from Invoice & Online store
                    </p>
                  </div>
                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={AdvancedGstImage}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">Use Advanced GST themes for Bills</p>
                  </div>
                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={recycle}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">Recover Deleted Invoices</p>
                  </div>
                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={printer}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">Take Thermal Printouts</p>
                  </div>
                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={scanner}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">Create Invoices by scanning barcodes</p>
                  </div>
                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={proforma}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">Create unlimited Proforma Invoices</p>
                  </div>
                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={support}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">Get priority support from our team</p>
                  </div>
                  <div className="p-2 mt-5 flex items-center ">
                    <img
                      src={excel}
                      alt="File"
                      className="ml-15 w-12 h-12 mr-5"
                      loading="lazy"
                    />
                    <p className="">Bulk Edit your items on Byapar Desktop</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* review card */}
        <p className="mt-8 mx-8 font-semibold text-2xl mb-2">Reviews</p>
        <div className="grid grid-cols-3 gap-4 rounded-md p-2 px-5  mb-10">
          {pricing_Review?.map((review) => (
            // card
            <div
              key={review?.id}
              className="card w-full  bg-gradient-to-b from-zinc-200 to-zinc-100  card-xs shadow-lg shadow-zinc-400"
            >
              <div className="card-body  ">
                <div className="flex items-center gap-2 ">
                  <div className="avatar avatar-placeholder">
                    <div
                      className={`w-8 rounded-full text-black`}
                      style={{ backgroundColor: getRandomColorHash() }}
                    >
                      <span className="text-xs">{review?.name[0]}</span>
                    </div>
                  </div>
                  <h2 className="card-title">{review?.name}</h2>
                </div>
                <p>{review?.review}</p>
                <div className="justify-end card-actions text-yellow-500 ">
                  <span className="">{review?.stars}</span>
                  <span className="">{review?.stars}</span>
                  <span className="">{review?.stars}</span>
                  <span className="">{review?.stars}</span>
                  <span className="">{review?.stars}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default DashboardPricingPage;
