import { FaIndianRupeeSign } from "react-icons/fa6";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import upload from "../assets/upload.png";
import not_found from "../assets/not-found.png";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import DashboardNavbar from "../components/DashboardNavbar";
import { dashboardPartiesCardDetails } from "../lib/dashboardPartiesCards";
import { motion } from "framer-motion";
import { container, dashboardLinksItems } from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useEffect, useMemo, useRef, useState } from "react";
import CustomLoader from "../components/Loader";
import { usePartyStore } from "../store/partyStore";
import toast from "react-hot-toast";
import { queryClient } from "../main.jsx";
import { useBusinessStore } from "../store/businessStore.js";
import { uploadExcel } from "../../helpers/uploadExcel.js";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import no_party from "../assets/no_party.png";

const DashboardPartiesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { business } = useBusinessStore();
  const { setParties, setTotalParties, totalParties, parties } =
    usePartyStore();
  const [toCollect, setToCollect] = useState(0);
  const [toPay, setToPay] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [partyIdToDelete, setPartyIdToDelete] = useState(null);
  const fileRef = useRef();
  const navigate = useNavigate();

  // FETCHING ALL PARTIES OF A PARTICULAR BUSINESS
  const { isLoading, data } = useQuery({
    queryKey: ["parties", business?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/parties/all-parties/${business?._id}`
      );
      console.log(res);
      setToCollect(res.data?.toCollect);
      setToPay(res.data?.toPay);
      setTotalParties(res.data?.totalParties);
      setParties(res.data?.data);
      return res.data?.data;
    },
    enabled: !!business?._id,
    keepPreviousData: true,
  });

  console.log(business);

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
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/parties/${partyIdToDelete}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.msg);
      document.getElementById("my_modal_3").close();
      queryClient.invalidateQueries({ queryKey: ["parties", business?._id] });
    },
  });

  const totalPages = Math.ceil((parties?.length || 0) / itemsPerPage);

  // SEARCH FUNCTIONALITY
  const searchedParties = useMemo(() => {
    if (!parties?.length) return [];
    return parties.filter((item) =>
      item?.partyName.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  }, [parties, searchQuery]);

  const paginatedParties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return searchedParties?.slice(startIndex, endIndex) || [];
  }, [currentPage, searchedParties]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
    <main className="h-screen overflow-y-auto p-2 ">
      <section className="min-h-full w-full bg-gradient-to-b from-white to-transparent rounded-lg p-3 sm:p-5">
        {/* Top Navigation */}
        <DashboardNavbar title="Parties" />

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 mt-4 text-sm"
        >
          {dashboardPartiesCardDetails?.map((details) => (
            <motion.div
              variants={dashboardLinksItems}
              key={details.id}
              style={{
                borderColor: details.color,
                background: `linear-gradient(to top left, ${details.rgb}, white)`,
              }}
              className={`border-l-4 
              rounded-md p-3 sm:p-4 shadow-md shadow-zinc-300 hover:-translate-y-1 hover:bg-emerald-100/10 transition-all duration-200 cursor-pointer`}
            >
              <p
                style={{ color: `${details.color}` }}
                className="flex items-center gap-2 sm:gap-3 text-base"
              >
                {details?.icon} {details?.label}
              </p>
              <span className="font-medium text-xl sm:text-2xl flex items-center gap-2 mt-1">
                {details?.label === "To Collect" && (
                  <>
                    <FaIndianRupeeSign size={14} />
                    {Number(toCollect).toLocaleString("en-IN")}
                  </>
                )}
                {details?.label === "To Pay" && (
                  <>
                    <FaIndianRupeeSign size={14} />
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

        {/* Search + Create */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 gap-3 sm:gap-5"
        >
          <div className="w-full sm:w-1/2 md:w-1/3">
            <label className="input input-sm w-full flex items-center gap-2 border border-zinc-300 rounded-md">
              <Search size={16} className="text-zinc-400" />
              <input
                type="search"
                required
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full focus:outline-none"
              />
            </label>
          </div>

          {parties && (
            <div className="w-full sm:w-auto">
              <Link
                to="/dashboard/add-party"
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
          className="relative z-10 h-[400px] bg-base-100 mt-8 border border-[var(--table-border)] rounded-md overflow-x-auto"
          key="party-table-container"
        >
          {searchedParties?.length === 0 && searchQuery.trim() !== "" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                ease: "easeInOut",
                duration: 0.2,
                delay: 0.2,
              }}
              className="flex items-center justify-center flex-col"
            >
              <img src={not_found} alt="no_items" width={250} loading="lazy" />
              <h3 className="font-semibold">No matching parties found</h3>
              <p className="text-zinc-500 text-xs text-center max-w-sm">
                No parties found matching “{searchQuery}”. Try a different name
                or clear your search.
              </p>
              <button
                className="btn btn-outline btn-sm mt-3"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </button>
            </motion.div>
          ) : paginatedParties?.length > 0 ? (
            <table className="table table-zebra table-sm min-w-[600px] w-full">
              <thead className="sticky top-0 bg-[var(--primary-background)] z-20 text-xs sm:text-sm">
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
              <tbody className="text-center text-xs sm:text-sm">
                {paginatedParties.map((party, index) => (
                  <tr
                    key={party._id}
                    className="cursor-pointer hover:bg-zinc-50"
                    onClick={() => navigate(party?._id)}
                  >
                    <td>{index + 1}</td>
                    <td className="text-left">{party?.partyName || "-"}</td>
                    <td>{party?.categoryName || "-"}</td>
                    <td>{party?.mobileNumber || "-"}</td>
                    <td>{party?.partyType || "-"}</td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        {party?.currentBalance > 0 ? (
                          <IoMdArrowUp className="text-success" />
                        ) : party?.currentBalance < 0 ? (
                          <IoMdArrowDown className="text-error" />
                        ) : (
                          ""
                        )}
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
                        onClick={() => {
                          setPartyIdToDelete(party?._id);
                          document.getElementById("my_modal_3").showModal();
                        }}
                      >
                        <Trash2
                          size={14}
                          className="text-[var(--error-text-color)] cursor-pointer"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-full flex flex-col gap-3 items-center justify-center py-16 text-center">
              <img src={no_party} alt="no_parties" width={180} />
              <h1 className="text-zinc-500 text-sm sm:text-base">
                No parties found for this business
              </h1>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        <div className="w-full flex items-center justify-end p-3 sm:p-4">
          <div className="join join-sm flex items-center">
            <button
              className="btn btn-sm btn-neutral"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ArrowLeft size={14} />
            </button>

            <span className="text-xs px-4">
              {currentPage} of {totalPages}
            </span>

            <button
              className="btn btn-sm btn-neutral"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Bulk Upload Section */}
        <div className="p-4 sm:p-6 w-full border mb-5 border-zinc-300 shadow-md bg-gradient-to-r from-zinc-100 to-sky-200 rounded-md">
          <h1 className="font-semibold text-base sm:text-lg">
            Add Multiple Parties at Once
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Bulk upload all your parties using Excel.
          </p>
          <input
            type="file"
            className="file-input file-input-sm hidden"
            ref={fileRef}
            onChange={handleFileUpload}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-3">
            <button
              onClick={() => fileRef.current.click()}
              disabled={bulkMutation.isPending}
              className="btn btn-success btn-sm flex items-center gap-2"
            >
              {bulkMutation.isPending ? (
                <CustomLoader text="Adding parties..." />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                    <path d="M8 11h8v7h-8z" />
                    <path d="M8 15h8" />
                    <path d="M11 11v7" />
                  </svg>
                  Upload Excel
                </>
              )}
            </button>

            <button
              onClick={() => window.open("/sample-party.xlsx", "_blank")}
              className="btn text-neutral btn-link btn-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                <path d="M7 11l5 5l5 -5" />
                <path d="M12 4v12" />
              </svg>
              Download Sample
            </button>
          </div>
        </div>
      </section>

      {/* Delete Modal */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box max-w-sm sm:max-w-md md:max-w-lg">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4 text-sm">
            Are you sure you want to delete the selected invoice? This action
            cannot be undone.
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => mutation.mutate()}
              className="btn btn-sm btn-ghost text-[var(--error-text-color)]"
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
