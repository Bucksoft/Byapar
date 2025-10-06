import { FaArrowLeft, FaArrowRight, FaIndianRupeeSign } from "react-icons/fa6";
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
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useEffect, useRef, useState } from "react";
import CustomLoader from "../components/Loader";
import { usePartyStore } from "../store/partyStore";
import toast from "react-hot-toast";
import { queryClient } from "../main.jsx";
import { useBusinessStore } from "../store/businessStore.js";
import Excel from "exceljs";
import { cleanKeys } from "../../helpers/cleanKeys.js";
import { v4 as uuid } from "uuid";
import { uploadExcel } from "../../helpers/uploadExcel.js";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { IoArrowDownSharp } from "react-icons/io5";

const DashboardPartiesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { business } = useBusinessStore();
  const { setParties, setTotalParties, totalParties } = usePartyStore();
  const [toCollect, setToCollect] = useState(0);
  const [toPay, setToPay] = useState(0);
  const [page, setPage] = useState(1);
  const fileRef = useRef();
  const navigate = useNavigate();

  const limit = 10;

  // MUTATION TO UPLOAD BULK PARTY DATA
  const bulkMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post(
        `/parties/bulk/${business?._id}`,
        data
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.msg || "Uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });

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
    queryKey: ["parties", page],
    queryFn: async () => {
      if (!business) {
        return [];
      }
      const res = await axiosInstance.get(
        `/parties/all/${business?._id}?page=${page}&limit=${limit}`
      );
      setToCollect(res.data.toCollect);
      setToPay(res.data.toPay);
      setTotalParties(res.data.totalParties);
      setParties(res.data?.data);
      return res.data;
    },
    keepPreviousData: true,
  });

  // SEARCH FUNCTIONALITY
  const parties =
    data &&
    data?.data?.filter((item) =>
      item?.partyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (isLoading) {
    return (
      <div className="h-screen w-full grid place-items-center">
        <CustomLoader text={"Loading...."} />
      </div>
    );
  }

  // EXCEL FILE INPUT CHANGE HANDLER
  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    const sanitizedData = await uploadExcel(selectedFile);
    if (sanitizedData) {
      bulkMutation.mutate(sanitizedData);
    }
  };

  return (
    <main className="h-screen overflow-y-scroll p-2">
      {
        <section className=" h-full w-full bg-gradient-to-b from-white to-transparent rounded-lg p-3">
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
                      <FaIndianRupeeSign size={15} />{" "}
                      {Number(toCollect).toLocaleString("en-IN")}
                    </>
                  )}
                  {details?.label === "To Pay" && (
                    <>
                      <FaIndianRupeeSign size={15} />{" "}
                      {Number(toPay).toLocaleString("en-IN")}
                    </>
                  )}
                  {details?.label === "All Parties" && (
                    <span>{totalParties || 0}</span>
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
            className="relative z-10 bg-base-100 mt-8 
             h-[460px] overflow-y-auto overflow-x-auto border border-[var(--table-border)] "
          >
            {parties ? (
              <table className="table table-zebra table-sm min-w-full">
                <thead className="sticky top-0 bg-[var(--primary-background)] z-20">
                  <tr>
                    <th>S.No.</th>
                    <th>Party Name</th>
                    <th className="text-center">Category</th>
                    <th className="text-center">Mobile Number</th>
                    <th className="text-center">Party type</th>
                    <th className="text-center">Balance</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {parties.map((party, index) => (
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
                      <td>{index + 1}</td>
                      <td className="text-left">{party?.partyName || "-"}</td>
                      <td>{party?.categoryName || "-"}</td>
                      <td>{party?.mobileNumber || "-"}</td>
                      <td>{party?.partyType || "-"}</td>
                      <td className="">
                        <div className="flex items-center justify-center gap-2">
                          {party?.currentBalance > 0 ? (
                            <IoMdArrowUp className="text-success" />
                          ) : party?.currentBalance < 0 ? (
                            <IoMdArrowDown className="text-error" />
                          ) : (
                            ""
                          )}{" "}
                          ₹ {Math.abs(party?.currentBalance) || 0}
                        </div>
                      </td>
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
                <h1 className="text-zinc-500">
                  No parties found for this business
                </h1>
                <Link to={"/dashboard/add-party"} className="btn btn-info">
                  Create party
                </Link>
              </div>
            )}
          </motion.div>

          {/* PAGINATION  */}
          <div className="w-full flex items-center justify-end p-4">
            <div className="join join-sm">
              <button
                className="join-item btn btn-neutral btn-sm"
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1}
              >
                <FaArrowLeft />
              </button>

              <button className="join-item btn btn-sm">
                {page}/{data?.totalPages || 1}
              </button>

              <button
                onClick={() => {
                  if (data && page < data.totalPages) {
                    setPage((old) => old + 1);
                  }
                }}
                disabled={!data || page >= data.totalPages}
                className="join-item btn btn-neutral btn-sm"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>

          {/* BULK ADD PARTIES AT ONCE */}
          <div className="p-5 w-full border mb-5 border-zinc-300 shadow-md bg-gradient-to-r from-zinc-100 to-sky-200">
            <h1 className="font-semibold">Add Multiple Parties at once</h1>
            <p className="text-zinc-500 text-sm">
              {" "}
              Bulk upload all your parties to Byapar using excel
            </p>
            <input
              type="file"
              className="file-input file-input-sm hidden"
              ref={fileRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileRef.current.click()}
              disabled={bulkMutation.isPending}
              className="btn btn-success btn-sm mt-3 "
            >
              {bulkMutation.isPending ? (
                <CustomLoader text={"Adding parties..."} />
              ) : (
                <>
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                    <path d="M8 11h8v7h-8z" />
                    <path d="M8 15h8" />
                    <path d="M11 11v7" />
                  </svg>{" "}
                  Upload Excel
                </>
              )}
            </button>

            <button
              onClick={() => window.open("/sample-party.xlsx", "_blank")}
              className="btn text-neutral btn-link btn-xs mt-3 ml-3"
            >
              <svg
                xmlns="http://wwww3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-download"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                <path d="M7 11l5 5l5 -5" />
                <path d="M12 4l0 12" />
              </svg>
              Download Sample
            </button>
          </div>
        </section>
      }

      {/* DELETE MODAL */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4 text-sm">
            Are you sure you want to delete the selected invoice ? This action
            cannot be undone.
          </p>
          <div className="flex w-full">
            <button
              onClick={() => mutation.mutate()}
              className="btn btn-sm btn-ghost  ml-auto text-[var(--error-text-color)]"
            >
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </main>
  );
};

export default DashboardPartiesPage;
