import { FaIndianRupeeSign } from "react-icons/fa6";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import upload from "../assets/upload.png";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import DashboardNavbar from "../components/DashboardNavbar";
import { dashboardPartiesCardDetails } from "../lib/dashboardPartiesCards";
import { motion } from "framer-motion";
import { container, dashboardLinksItems } from "../components/Sidebar";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useState } from "react";
import CustomLoader from "../components/Loader";
import { usePartyStore } from "../store/partyStore";
import toast from "react-hot-toast";
import { queryClient } from "../main.jsx";

const DashboardPartiesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { setParties } = usePartyStore();

  // DELETE PARTY
  const mutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/parties/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.msg);
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });

  // FETCHING ALL PARTIES
  const { isLoading, data } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      const res = await axiosInstance.get("/parties/all");
      setParties(res.data);
      return res.data;
    },
  });

  // SEARCH FUNCTIONALITY
  const parties = data?.filter((item) =>
    item?.partyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-screen w-full grid place-items-center">
        <CustomLoader text={"Loading...."} />
      </div>
    );
  }

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
              <input
                type="search"
                required
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
        {
          <motion.div
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
            className="overflow-x-auto relative z-10 rounded-box border border-base-content/5 bg-base-100 mt-8 "
          >
            <table className="table text-xs ">
              {/* head */}
              <thead>
                <tr>
                  <th>Party Name</th>
                  <th className="text-center">Category</th>
                  <th className="text-center">Mobile Number</th>
                  <th className="text-center">Party type</th>
                  <th className="text-center">Opening balance</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {/* row 1 */}
                {parties.map((party) => (
                  <motion.tr
                    key={party._id}
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
                    <td className="text-left">
                      <Link to={party?._id}>{party?.partyName}</Link>
                    </td>
                    <td>{party?.categoryName}</td>
                    <td>{party?.mobileNumber}</td>
                    <td>{party?.partyType}</td>
                    <td>₹ {party?.openingBalance}</td>
                    <td className="flex items-center gap-2 justify-end">
                      <Link to={`/dashboard/edit-party/${party?._id}`}>
                        <SquarePen size={14} className="cursor-pointer" />{" "}
                      </Link>
                      {/* Open the modal using document.getElementById('ID').showModal() method */}

                      <button
                        onClick={() =>
                          document.getElementById("my_modal_3").showModal()
                        }
                      >
                        <Trash2
                          size={14}
                          className="text-[var(--error-text-color)] cursor-pointer"
                        />
                      </button>
                      <dialog id="my_modal_3" className="modal">
                        <div className="modal-box">
                          <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>
                          <h3 className="font-bold text-lg">Are you sure ?</h3>
                          <p className="py-4">
                            This action cannot be undone. All values associated
                            with this field will be lost.
                          </p>
                          <div className="w-full grid place-items-end">
                            <button
                              onClick={() => mutation.mutate(party?._id)}
                              className="btn btn-sm bg-[var(--error-text-color)] text-[var(--primary-text-color)]"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </dialog>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        }

        {/* Pagination */}
        <div className="w-full flex justify-center my-5">
          <div className="join">
            <button className="join-item btn btn-sm">
              <ChevronLeft size={15} />
            </button>
            <button className="join-item btn btn-sm">Page 1</button>
            <button className="join-item btn btn-sm">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

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
          className="w-full mt-7 flex gap-3 bg-gradient-to-r from-sky-100 to-sky-50 rounded-md p-4"
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
