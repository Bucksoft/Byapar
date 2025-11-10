import DashboardNavbar from "../components/DashboardNavbar";
import { dashboardPurchaseDetails } from "../lib/dashboardPurhaseCards";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  EllipsisVertical,
  Plus,
  Search,
} from "lucide-react";
import { FaFileInvoice, FaIndianRupeeSign } from "react-icons/fa6";
import { motion } from "framer-motion";
import { container, dashboardLinksItems } from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useBusinessStore } from "../store/businessStore";
import { usePurchaseInvoiceStore } from "../store/purchaseInvoiceStore";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import CustomLoader from "../components/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { BsTrash3 } from "react-icons/bs";
import { BiDuplicate } from "react-icons/bi";
import { MdOutlineHistory } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useMemo } from "react";
import not_found from "../assets/not-found.png";

const DashboardPurchasesPage = () => {
  const { business } = useBusinessStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [invoiceId, setInvoiceId] = useState();
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const {
    setPurchaseInvoices,
    purchaseInvoices: ad,
    setTotalPurchaseInvoices,
    setLatestPurchaseInvoiceNumber,
  } = usePurchaseInvoiceStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // QUERY TO FETCH ALL PURCHASE INVOICES
  const { isLoading, data: purchaseInvoices } = useQuery({
    queryKey: ["purchaseInvoice"],
    queryFn: async () => {
      if (!business) return [];
      const res = await axiosInstance.get(`/purchase-invoice/${business?._id}`);
      setPurchaseInvoices(res.data?.purchaseInvoices);
      setTotalPurchaseInvoices(res.data?.totalPurchaseInvoices);
      setLatestPurchaseInvoiceNumber(res.data?.latestPurchaseInvoiceNumber);
      return res.data?.purchaseInvoices;
    },
    enabled: !!business?._id,
    keepPreviousData: true,
    retry: 1,
  });

  // MUTATION TO DELETE INVOICE
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/purchase-invoice/${invoiceId}`);
      return res.data;
    },
    onSuccess: async (data) => {
      toast.success(data?.msg);
      await queryClient.invalidateQueries({ queryKey: ["purchaseInvoice"] });
      setTimeout(() => {
        const modal = document.getElementById("delete_modal");
        modal?.close();
        setInvoiceId(null);
      }, 150);
    },
    onError: (err) => {
      toast.error("Failed to delete invoice");
    },
  });

  // FILTERING INVOICE BASED ON SEARCH QUERY
  const searchedInvoices = useMemo(() => {
    if (!purchaseInvoices) return [];

    return purchaseInvoices?.filter((item) => {
      const invoiceMatch = item?.purchaseInvoiceNumber
        ?.toString()
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const partyMatch = item?.partyId?.partyName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      return invoiceMatch || partyMatch;
    });
  }, [purchaseInvoices, searchQuery]);

  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return searchedInvoices?.slice(startIndex, endIndex) || [];
  }, [searchedInvoices, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil((purchaseInvoices?.length || 0) / itemsPerPage);

  const handleDelete = (id) => {
    setInvoiceId(id);
    mutation.mutate(id);
  };

  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Purchase Invoice"} isReport={"true"} />
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-2"
        >
          {/* TOTAL PURCHASES */}
          <div
            className={`border-l-4 border-[#F4991A] shadow-zinc-500 mt-5  rounded-md p-3  shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer bg-gradient-to-tl from-[rgba(244,153,26,0.1)] to-white`}
          >
            <p className={`flex items-center gap-3 text-[#F4991A]`}>
              <FaFileInvoice />
              Total Purchases
            </p>
            <span className="font-medium text-2xl flex items-center gap-2">
              <FaIndianRupeeSign size={15} />
              {purchaseInvoices
                ? Number(
                    purchaseInvoices
                      .filter((inv) => inv.status !== "cancelled")
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
            className={`border-l-4 border-[#F7374F] mt-5 shadow-zinc-500 rounded-md p-3 bg-gradient-to-tl from-[rgba(247,55,79,0.1)] shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
          >
            <p className={`flex items-center gap-3 text-[#F7374F]`}>
              <FaFileInvoice />
              Paid
            </p>
            <span className="font-medium text-2xl flex items-center gap-2">
              <FaIndianRupeeSign size={15} />
              {purchaseInvoices
                ? Number(
                    purchaseInvoices
                      .filter((inv) => inv.status !== "cancelled")
                      .reduce(
                        (sum, invoice) => sum + (invoice.settledAmount || 0),
                        0
                      )
                  ).toLocaleString("en-IN")
                : 0}
            </span>
          </div>

          {/* UNPAID */}
          <div
            className={`border-l-4 border-[#255F38] shadow-zinc-500 mt-5 rounded-md p-3 bg-gradient-to-tl from-[rgba(37,95,56,0.1)] shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
          >
            <p className={`flex items-center gap-3 text-[#255F38]`}>
              <FaFileInvoice />
              Unpaid
            </p>
            <span className="font-medium text-2xl flex items-center gap-2">
              <FaIndianRupeeSign size={15} />
              {purchaseInvoices
                ? Number(
                    purchaseInvoices
                      .filter((inv) => inv.status !== "cancelled")
                      .reduce(
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
          className="flex items-center justify-between mt-8"
        >
          <div className="flex items-center gap-3">
            <label className="input input-sm">
              <Search size={16} className="text-zinc-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="search"
                required
                placeholder="Search"
              />
            </label>
          </div>

          <Link to={"/dashboard/purchase-invoice"}>
            <button className="btn btn-sm bg-[var(--primary-btn)] rounded-xl">
              <Plus size={14} /> Create Purchase Invoice
            </button>
          </Link>
        </motion.div>

        <div className="flex-1 bg-base-100 mt-5 rounded-md border border-[var(--table-border)] shadow-sm">
          <div className="relative z-10 bg-base-100 h-[460px] overflow-y-auto overflow-x-auto">
            <motion.table
              initial={{ opacity: 0, translateY: 100 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ ease: "easeInOut", duration: 0.2, delay: 0.3 }}
              className="table table-zebra table-sm min-w-full"
            >
              <thead>
                <tr className="bg-[var(--primary-background)]">
                  <th>Date</th>
                  <th>Purchase Invoice Number</th>
                  <th>Party Name</th>
                  <th>Due In</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {searchedInvoices?.length === 0 && searchQuery.trim() !== "" ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
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
                        <img
                          src={not_found}
                          alt="no_items"
                          width={250}
                          loading="lazy"
                        />
                        <h3 className="font-semibold">
                          No matching invoices found
                        </h3>
                        <p className="text-zinc-500 text-xs text-center max-w-sm">
                          No invoices found matching “{searchQuery}”. Try a
                          different name or clear your search.
                        </p>
                        <button
                          className="btn btn-outline btn-sm mt-3 rounded-xl"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear search
                        </button>
                      </motion.div>
                    </td>
                  </tr>
                ) : paginatedInvoices?.length > 0 ? (
                  paginatedInvoices.map((invoice) => (
                    <tr
                      key={invoice?._id}
                      onClick={() =>
                        navigate(`/dashboard/purchase-invoice/${invoice?._id}`)
                      }
                      className="cursor-pointer hover:bg-zinc-50"
                    >
                      <td>
                        {invoice?.purchaseInvoiceDate
                          ? invoice?.purchaseInvoiceDate.split("T")[0]
                          : "-"}
                      </td>
                      <td>{invoice?.purchaseInvoiceNumber}</td>
                      <td>{invoice?.partyId?.partyName || "-"}</td>
                      <td>{invoice?.dueDate?.split("T")[0] || "-"}</td>
                      <td className="">
                        <div className="flex items-center">
                          <LiaRupeeSignSolid />
                          {Number(invoice?.totalAmount).toLocaleString("en-IN")}
                        </div>
                      </td>
                      <td>
                        <p
                          className={`badge badge-soft badge-sm ${
                            invoice?.status === "unpaid"
                              ? "badge-primary"
                              : invoice?.status === "partially paid"
                              ? "badge-secondary"
                              : invoice?.status === "cancelled"
                              ? "badge-error"
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
                              className="dropdown-content menu bg-base-100 border border-zinc-300 text-xs rounded-box z-10 w-36 p-1 shadow-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <li>
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/update/${invoice?._id}?type=purchase invoice`
                                    )
                                  }
                                  className="flex items-center gap-2 rounded-xl"
                                >
                                  <FaRegEdit /> Edit
                                </button>
                              </li>
                              <li>
                                <a
                                  onClick={() => {
                                    document
                                      .getElementById("delete_modal")
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
                  /* : No invoices at all */
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
                        <FaFileInvoice size={40} />
                        <span className="text-sm">
                          You haven’t generated any invoices yet.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </motion.table>
          </div>
        </div>

        {/* PAGINATION  */}
        <div className="w-full flex items-center justify-end p-4">
          <div className="join join-sm flex items-center">
            <button
              className="btn btn-sm btn-neutral rounded-xl"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ArrowLeft size={14} />
            </button>

            <span className="text-xs px-4">
              {currentPage} of {totalPages}
            </span>

            <button
              className="btn btn-sm btn-neutral rounded-xl"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {!showDeletePopup && (
        <>
          <dialog id="delete_modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4 text-sm">
                Are you sure you want to delete the selected item(s)? This
                action cannot be undone.
              </p>
              <div className="flex w-full">
                <button
                  onClick={() => mutation.mutate(invoiceId)}
                  className="btn btn-sm rounded-xl btn-ghost  ml-auto text-[var(--error-text-color)]"
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

export default DashboardPurchasesPage;
