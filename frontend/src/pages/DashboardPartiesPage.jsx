import { FaIndianRupeeSign } from "react-icons/fa6";
import { Plus, Search } from "lucide-react";
import upload from "../assets/upload.png";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import DashboardNavbar from "../components/DashboardNavbar";
import { dashboardPartiesCardDetails } from "../lib/dashboardPartiesCards";
import { motion } from "framer-motion";
import { container, dashboardLinksItems } from "../components/Sidebar";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useState } from "react";
import CustomLoader from "../components/Loader";

const DashboardPartiesPage = () => {
  const { isLoading, data: parties } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      const res = await axiosInstance.get("/parties/all");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full grid place-items-center">
        <CustomLoader text={"Loading...."} />
      </div>
    );
  }

  console.log("PARTIES : -> ", parties);

  return (
    <main className="h-full p-2">
      <section className="h-full w-full bg-white rounded-lg p-3">
        {/* Parties top navigation bar */}
        <DashboardNavbar title={"Parties"} />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-2 mt-4 text-sm"
        >
          {dashboardPartiesCardDetails?.map((details) => (
            <motion.div
              variants={dashboardLinksItems}
              key={details.id}
              className={`border rounded-md p-3 shadow-md border-${details.color} bg-${details.color}/10 hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
            >
              <p className={`flex items-center gap-3 text-${details.color}`}>
                {details.icon} {details.label}
              </p>
              <span className="font-medium text-2xl flex items-center gap-2">
                {details.label === "To Collect" && (
                  <FaIndianRupeeSign size={15} />
                )}
                {details.label === "To Pay" && <FaIndianRupeeSign size={15} />}
                {details.label === "All Parties" && (
                  <span>{parties.length || 0}</span>
                )}
                {/* to collect and to pay data to be displayed yet. */}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            scaleY: 0,
          }}
          animate={{
            opacity: 1,
            scaleY: 1,
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.2,
          }}
          className="flex items-center justify-between mt-8"
        >
          <div className="">
            <label className="input input-sm">
              <Search size={16} className="text-zinc-400" />
              <input type="search" required placeholder="Search" />
            </label>
          </div>

          <div>
            <Link
              to={"/dashboard/add-party"}
              className="btn btn-sm bg-[var(--primary-btn)]"
            >
              <Plus size={14} /> Create Party
            </Link>
          </div>
        </motion.div>

        {/* parties information is displayed here */}
        {parties.map((party) => (
          <motion.div
            key={party?._id}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              ease: "easeInOut",
              duration: 0.2,
            }}
            className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mt-8 "
          >
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Party Name</th>
                  <th>Category</th>
                  <th>Mobile Number</th>
                  <th>Party type</th>
                  <th>Opening balance</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <motion.tr
                  initial={{
                    opacity: 0,
                    scaleY: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scaleY: 1,
                  }}
                  transition={{
                    ease: "easeInOut",
                    duration: 0.2,
                    delay: 0.2,
                  }}
                >
                  <td>{party?.partyName}</td>
                  <td>{party?.categoryName}</td>
                  <td>{party?.mobileNumber}</td>
                  <td>{party?.partyType}</td>
                  <td>₹ {party?.openingBalance}</td>
                </motion.tr>
              </tbody>
            </table>
          </motion.div>
        ))}

        <motion.div
          initial={{
            opacity: 0,
            translateY: 100,
          }}
          animate={{
            opacity: 1,
            translateY: 1,
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.2,
            delay: 0.3,
          }}
          className="w-full mt-7 flex  gap-3 bg-gradient-to-r from-sky-100 to-sky-50 rounded-md p-4"
        >
          <img src={upload} alt="upload" width={120} />
          <div>
            <h2 className="mt-2 text-md font-semibold">
              Add multiple parties at once.
            </h2>
            <p className="text-xs text-zinc-500">
              Bulk upload all your parties to myBillBook using excel
            </p>

            <button className="btn btn-sm mt-5 btn-soft btn-success">
              <PiMicrosoftExcelLogoFill size={15} />
              Upload Excel
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default DashboardPartiesPage;
