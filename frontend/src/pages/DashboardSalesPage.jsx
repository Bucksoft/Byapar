import DashboardNavbar from "../components/DashboardNavbar";
import { dashboardSaledCardsDetails } from "../lib/dashboardSalesCards";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { EllipsisVertical, Plus, Search } from "lucide-react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFileInvoice,
  FaRegEdit,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { container, dashboardLinksItems } from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { queryClient } from "../main";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import CustomLoader from "../components/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { BsTrash3 } from "react-icons/bs";
import { useInvoiceStore } from "../store/invoicesStore";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useBusinessStore } from "../store/businessStore";
import { uploadExcel } from "../../helpers/uploadExcel";

const DashboardSalesPage = () => {
  const { setInvoices, setTotalInvoices } = useInvoiceStore();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [invoiceId, setInvoiceId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const { business } = useBusinessStore();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  // to get all the invoices
  const {
    isLoading,
    data: invoices,
    isSuccess,
  } = useQuery({
    queryKey: ["invoices", business?._id, page],
    queryFn: async () => {
      if (!business) return [];
      const res = await axiosInstance.get(
        `/sales-invoice/${business._id}?page=${page}&limit=${limit}`
      );
      setTotalInvoices(res.data?.totalInvoices);
      return res.data || [];
    },
    enabled: !!business,
    keepPreviousData: true,
  });

  // mutation to delete an invoice
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/sales-invoice/${invoiceId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      document.getElementById("my_modal_2").close();
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (err) => {
      toast.error(err.response.data.msg);
    },
  });

  useEffect(() => {
    if (isSuccess && invoices) {
      setInvoices(invoices);
    }
  }, [isSuccess, invoices]);

  const searchedInvoices =
    invoices && searchQuery
      ? invoices?.invoices.filter(
          (invoice) =>
            invoice?.partyId?.partyName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            invoice?.salesInvoiceNumber
              .toString()
              .toLowerCase()
              .includes(searchQuery.toString().toLowerCase())
        )
      : invoices?.invoices;

  // MUTATION TO UPLOAD ITEMS IN BULK
  const bulkMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post(
        `/sales-invoice/bulk/${business?._id}`,
        data
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.msg || "Uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    const sanitizedData = await uploadExcel(selectedFile);
    if (sanitizedData) {
      bulkMutation.mutate(sanitizedData);
    }
    e.target.value = null;
  };

  return (
    <main className="h-full p-2 ">
      <div className="h-full w-full flex flex-col bg-gradient-to-b from-white to-transparent rounded-lg p-3">
        <DashboardNavbar title={"Sales Invoice"} isReport={"true"} />
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-2"
        >
          {/* TOTAL SALES */}
          <div
            className={`border border-[#84994F] shadow-zinc-500 mt-5 rounded-md p-3  shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
          >
            <p className={`flex items-center gap-3 text-[#84994F]`}>
              <FaFileInvoice />
              Total Sales
            </p>
            <span className="font-medium text-2xl flex items-center gap-2">
              <FaIndianRupeeSign size={15} />
              {invoices
                ? Number(
                    invoices?.invoices
                      .reduce(
                        (acc, invoice) =>
                          acc + Number(invoice?.totalAmount || 0),
                        0
                      )
                      .toFixed(2)
                  ).toLocaleString("en-IN")
                : 0}
            </span>
          </div>

          {/* PAID */}
          <div
            className={`border border-[#84994F] mt-5 shadow-zinc-500 rounded-md p-3  shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
          >
            <p className={`flex items-center gap-3 text-[#84994F]`}>
              <FaFileInvoice />
              Paid
            </p>
            <span className="font-medium text-2xl flex items-center gap-2">
              <FaIndianRupeeSign size={15} />
              {invoices
                ? Number(
                    invoices?.invoices.reduce(
                      (sum, invoice) => sum + (invoice.settledAmount || 0),
                      0
                    )
                  ).toLocaleString("en-IN")
                : 0}
            </span>
          </div>

          {/* UNPAID */}
          <div
            className={`border border-[#84994F] shadow-zinc-500 mt-5 rounded-md p-3  shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
          >
            <p className={`flex items-center gap-3 text-[#84994F]`}>
              <FaFileInvoice />
              Unpaid
            </p>
            <span className="font-medium text-2xl flex items-center gap-2">
              <FaIndianRupeeSign size={15} />
              {invoices
                ? Number(
                    invoices?.invoices.reduce(
                      (sum, invoice) =>
                        sum +
                        (invoice.pendingAmount ??
                          invoice.totalAmount - (invoice.settledAmount || 0)),
                      0
                    )
                  ).toLocaleString("en-IN")
                : 0}
            </span>
          </div>
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
          className="flex items-center justify-between mt-8 "
        >
          <div className="flex items-center gap-2">
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
              to={"/dashboard/parties/sales-invoice"}
              className="btn btn-sm bg-[var(--primary-btn)]"
            >
              <Plus size={14} /> Create Sales Invoice
            </Link>
          </div>
        </motion.div>

        <div className="overflow-x-auto flex-1 bg-base-100 mt-5 ">
          {isLoading ? (
            <div className="w-full py-3 flex justify-center">
              <CustomLoader text={"Getting all invoices..."} />
            </div>
          ) : (
            <div
              className="relative z-10 bg-base-100 mt-8 
             h-[460px] overflow-y-auto overflow-x-auto border border-[var(--table-border)] "
            >
              <motion.table
                initial={{
                  opacity: 0,
                  translateY: 100,
                }}
                animate={{
                  opacity: 1,
                  translateY: 0,
                }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.2,
                  delay: 0.3,
                }}
                className="table table-zebra  table-sm min-w-full"
              >
                {/* head */}
                <thead>
                  <tr className="bg-[var(--primary-background)]">
                    <th>Date</th>
                    <th>Invoice Number</th>
                    <th>Party Name</th>
                    <th>Due In</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {searchedInvoices && searchedInvoices?.length > 0 ? (
                    searchedInvoices.map((invoice) => (
                      <tr
                        key={invoice?._id}
                        onClick={(e) => {
                          navigate(`/dashboard/sales-invoice/${invoice?._id}`);
                        }}
                        className={`cursor-pointer hover:bg-zinc-50 `}
                      >
                        <td>
                          {invoice?.salesInvoiceDate
                            ? invoice?.salesInvoiceDate.split("T")[0]
                            : "-"}
                        </td>
                        <td>{invoice?.salesInvoiceNumber}</td>
                        <td>{invoice?.partyId?.partyName || "-"}</td>
                        <td>{invoice?.dueDate.split("T")[0]}</td>
                        <td className="flex  flex-col gap-1">
                          <div className="flex items-center">
                            <LiaRupeeSignSolid />
                            {Number(invoice?.totalAmount).toLocaleString(
                              "en-IN"
                            )}
                          </div>
                          {invoice?.pendingAmount &&
                          invoice.pendingAmount > 0 ? (
                            <small className="flex items-center text-error">
                              <LiaRupeeSignSolid />{" "}
                              {Number(invoice?.pendingAmount).toLocaleString(
                                "en-IN"
                              )}{" "}
                              unpaid
                            </small>
                          ) : invoice.status !== "cancelled" ? (
                            <small className="flex items-center text-error">
                              <LiaRupeeSignSolid />{" "}
                              {Number(invoice?.totalAmount).toLocaleString(
                                "en-IN"
                              )}{" "}
                              unpaid
                            </small>
                          ) : (
                            ""
                          )}
                        </td>
                        <td>
                          <p
                            className={`badge badge-soft badge-sm ${
                              invoice?.status === "unpaid"
                                ? "badge-error"
                                : invoice?.status === "partially paid"
                                ? "badge-secondary"
                                : invoice?.status === "cancelled"
                                ? "badge-primary"
                                : "badge-success"
                            }`}
                          >
                            {invoice?.status}
                          </p>
                        </td>
                        {invoice?.status !== "cancelled" ? (
                          <td onClick={(e) => e.stopPropagation()}>
                            <div className="dropdown dropdown-end">
                              <div
                                tabIndex={0}
                                role="button"
                                className="btn m-1 btn-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <EllipsisVertical size={13} />
                              </div>
                              <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <li>
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/update/${invoice?._id}?type=sales invoice`
                                      )
                                    }
                                    className="flex items-center gap-2"
                                  >
                                    <FaRegEdit /> Edit
                                  </button>
                                </li>
                                <li>
                                  <a
                                    onClick={() => {
                                      document
                                        .getElementById("my_modal_2")
                                        .showModal();
                                      setInvoiceId(invoice?._id);
                                    }}
                                    className="text-[var(--error-text-color)]"
                                  >
                                    <BsTrash3 />
                                    Delete
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </td>
                        ) : (
                          <td>-</td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-4 text-gray-500"
                      >
                        <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
                          <FaFileInvoice size={40} />
                          <span className="text-sm">
                            No transactions matching the current filter
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </motion.table>
            </div>
          )}

          {(!searchedInvoices || !invoices) && (
            <div className="w-full flex justify-center py-19 flex-col items-center gap-4">
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
                className="icon text-zinc-500 icon-tabler icons-tabler-outline icon-tabler-receipt-rupee"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" />
                <path d="M15 7h-6h1a3 3 0 0 1 0 6h-1l3 3" />
                <path d="M9 10h6" />
              </svg>
              <h1 className="text-zinc-500">
                You haven't generated any invoices yet.
              </h1>
            </div>
          )}
        </div>

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

            <button className="join-item btn btn-sm">{page}</button>

            <button
              onClick={() => {
                if (invoices && page < invoices.totalPages) {
                  setPage((old) => old + 1);
                }
              }}
              disabled={!invoices || page >= invoices.totalPages}
              className="join-item btn btn-neutral btn-sm"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* HANDLING BULK UPLOAD */}
        <div className="p-5 w-full border mt-3 border-zinc-300 shadow-md bg-gradient-to-r from-zinc-100 to-sky-200 ">
          <h1 className="font-semibold">
            Add Multiple Sales information at once
          </h1>
          <p className="text-zinc-500 text-sm">
            Bulk upload all your sales report to Byapar using excel
          </p>
          {/* <small className="mt-1 text-red-500">
            Note* You must follow the sample items excel.
          </small> */}
          <br />
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
              <CustomLoader text={"Adding items..."} />
            ) : (
              <>
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

          {/* <button
            onClick={() => window.open("/sample-sales.xlsx", "_blank")}
            className="btn text-neutral btn-link btn-xs mt-3 ml-3"
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
              className="icon icon-tabler icons-tabler-outline icon-tabler-download"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <path d="M7 11l5 5l5 -5" />
              <path d="M12 4l0 12" />
            </svg>
            Download Sample
          </button> */}
        </div>
      </div>

      {!showDeletePopup && (
        <>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4 text-sm">
                Are you sure you want to delete the selected invoice ? This
                action cannot be undone.
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
        </>
      )}
    </main>
  );
};

export default DashboardSalesPage;
