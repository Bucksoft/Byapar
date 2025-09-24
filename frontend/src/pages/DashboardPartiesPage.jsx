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
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useEffect, useState } from "react";
import CustomLoader from "../components/Loader";
import { usePartyStore } from "../store/partyStore";
import toast from "react-hot-toast";
import { queryClient } from "../main.jsx";
import { useBusinessStore } from "../store/businessStore.js";

const DashboardPartiesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { business } = useBusinessStore();
  const { setParties } = usePartyStore();
  const [toCollect, setToCollect] = useState(0);
  const [toPay, setToPay] = useState(0);
  const navigate = useNavigate();

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

  // FETCHING ALL PARTIES OF A PARTICULAR BUSINESS
  const { isLoading, data } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      if (!business) {
        return;
      }
      const res = await axiosInstance.get(`/parties/all/${business?._id}`);
      setParties(res.data?.data);
      return res.data?.data;
    },
  });

  // SEARCH FUNCTIONALITY
  const parties =
    data &&
    data?.filter((item) =>
      item?.partyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  useEffect(() => {
    // implementing to collect and to pay
    if (!data) return;
    let toCollect = 0;
    let toPay = 0;
    data.forEach((party) => {
      if (party.partyType === "Customer") {
        toCollect += party?.currentBalance || 0;
      } else if (party.partyType === "Supplier") {
        toPay += party?.currentBalance || 0;
      }
    });
    setToCollect(toCollect);
    setToPay(toPay);
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-screen w-full grid place-items-center">
        <CustomLoader text={"Loading...."} />
      </div>
    );
  }

  return (
    <main className="h-full p-2">
      <section className="h-full w-full bg-gradient-to-b from-white to-transparent rounded-lg p-3">
        {/* Parties top navigation bar */}
        <DashboardNavbar title={"Parties"} />

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 text-sm"
        >
          {dashboardPartiesCardDetails?.map((details) => (
            <motion.div
              variants={dashboardLinksItems}
              key={details.id}
              style={{ borderColor: dashboardPartiesCardDetails[0].color }}
              className="border rounded-md p-3 shadow-md shadow-zinc-400 hover:-translate-y-1 hover:bg-emerald-100/10 transition-all ease-in-out duration-200 cursor-pointer"
            >
              <p
                style={{ color: dashboardPartiesCardDetails[0].color }}
                className="flex items-center gap-3"
              >
                {details?.icon} {details?.label}
              </p>
              <span className="font-medium text-2xl flex items-center gap-2">
                {details?.label === "To Collect" && (
                  <>
                    <FaIndianRupeeSign size={15} /> {toCollect}
                  </>
                )}
                {details?.label === "To Pay" && (
                  <>
                    <FaIndianRupeeSign size={15} /> {toPay}
                  </>
                )}
                {details?.label === "All Parties" && (
                  <span>{parties?.length || 0}</span>
                )}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Create */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 gap-3"
        >
          <div className="w-full sm:w-auto">
            <label className="input input-sm w-full">
              <Search size={16} className="text-zinc-400" />
              <input
                type="search"
                required
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </label>
          </div>

          {parties && (
            <div className="w-full sm:w-auto">
              <Link
                to={"/dashboard/add-party"}
                className="btn btn-sm bg-[var(--primary-btn)] w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Create Party
              </Link>
            </div>
          )}
        </motion.div>

        {/* Parties Table */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          className="overflow-x-auto relative z-10 bg-base-100 mt-8"
        >
          {parties ? (
            <table className="table table-zebra text-xs min-w-full">
              <thead>
                <tr className="bg-zinc-100">
                  <th>Party Name</th>
                  <th className="text-center">Category</th>
                  <th className="text-center">Mobile Number</th>
                  <th className="text-center">Party type</th>
                  <th className="text-center">Balance</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {parties.map((party) => (
                  <motion.tr
                    className="cursor-pointer hover:bg-zinc-50"
                    onClick={() => navigate(party?._id)}
                    key={party._id}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{
                      ease: "easeInOut",
                      duration: 0.2,
                      delay: 0.2,
                    }}
                  >
                    <td className="text-left">{party?.partyName || "-"}</td>
                    <td>{party?.categoryName || "-"}</td>
                    <td>{party?.mobileNumber || "-"}</td>
                    <td>{party?.partyType || "-"}</td>
                    <td>₹ {party?.currentBalance || 0}</td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 justify-end"
                    >
                      <Link to={`/dashboard/edit-party/${party?._id}`}>
                        <SquarePen size={14} className="cursor-pointer" />
                      </Link>
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
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-full flex flex-col gap-3 items-center justify-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon text-zinc-500"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
                <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                <path d="M17 10h2a2 2 0 0 1 2 2v1" />
                <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
              </svg>
              <h1 className="text-lg text-zinc-500">
                You haven't created any party yet. Create one
              </h1>
              <Link
                to={"/dashboard/add-party"}
                className="btn btn-sm bg-[var(--primary-btn)]"
              >
                <Plus size={14} /> Create Party
              </Link>
            </div>
          )}
        </motion.div>
      </section>
    </main>
  );
};

export default DashboardPartiesPage;
