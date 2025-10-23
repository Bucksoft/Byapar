import DashboardNavbar from "../components/DashboardNavbar";
import { dashboardPurchaseDetails } from "../lib/dashboardPurhaseCards";
import { Calendar, EllipsisVertical, Plus, Search } from "lucide-react";
import { FaFileInvoice, FaIndianRupeeSign } from "react-icons/fa6";
import { motion } from "framer-motion";
import { container, dashboardLinksItems } from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useBusinessStore } from "../store/businessStore";
import { usePurchaseInvoiceStore } from "../store/purchaseInvoiceStore";
import toast from "react-hot-toast";
import { useState } from "react";
import CustomLoader from "../components/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { BsTrash3 } from "react-icons/bs";
import { BiDuplicate } from "react-icons/bi";
import { MdOutlineHistory } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

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
  } = usePurchaseInvoiceStore();

  // MUTATION TO DELETE INVOICE
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/purchase-invoice/${invoiceId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      queryClient.invalidateQueries({ queryKey: ["purchaseInvoice"] });
      document.getElementById("my_modal_2").close();
    },
  });

  // QUERY TO FETCH ALL PURCHASE INVOICES
  const { isLoading, data: purchaseInvoices } = useQuery({
    queryKey: ["purchaseInvoice"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/purchase-invoice/${business?._id}`);
      setPurchaseInvoices(res.data?.purchaseInvoices);
      setTotalPurchaseInvoices(res.data?.totalPurchaseInvoices);
      return res.data?.purchaseInvoices;
    },
  });

  // FILTERING INVOICE BASED ON SEARCH QUERY
  const filteredInvoices = purchaseInvoices?.filter((invoice) => {
    const query = searchQuery.toLowerCase();

    return (
      invoice?.purchaseInvoiceNumber
        ?.toString()
        .toLowerCase()
        .includes(query) ||
      invoice?.partyName?.toLowerCase().includes(query) ||
      invoice?.totalAmount?.toString().toLowerCase().includes(query)
    );
  });

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
          {/* TOTAL SALES */}
          <div
            className={`border border-[#456882] shadow-zinc-500 mt-5 rounded-md p-3  shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
          >
            <p className={`flex items-center gap-3 text-[#456882]`}>
              <FaFileInvoice />
              Total Purchases
            </p>
            <span className="font-medium text-2xl flex items-center gap-2">
              <FaIndianRupeeSign size={15} />
              {purchaseInvoices
                ? Number(
                    purchaseInvoices
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
            className={`border border-[#456882] mt-5 shadow-zinc-500 rounded-md p-3  shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
          >
            <p className={`flex items-center gap-3 text-[#456882]`}>
              <FaFileInvoice />
              Paid
            </p>
            <span className="font-medium text-2xl flex items-center gap-2">
              <FaIndianRupeeSign size={15} />
              {purchaseInvoices
                ? Number(
                    purchaseInvoices.reduce(
                      (sum, invoice) => sum + (invoice.settledAmount || 0),
                      0
                    )
                  ).toLocaleString("en-IN")
                : 0}
            </span>
          </div>

          {/* UNPAID */}
          <div
            className={`border border-[#456882] shadow-zinc-500 mt-5 rounded-md p-3  shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
          >
            <p className={`flex items-center gap-3 text-[#456882]`}>
              <FaFileInvoice />
              Unpaid
            </p>
            <span className="font-medium text-2xl flex items-center gap-2">
              <FaIndianRupeeSign size={15} />
              {purchaseInvoices
                ? Number(
                    purchaseInvoices.reduce(
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
            <div className="dropdown dropdown-center dropdown-sm">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 btn-sm btn-wide bg-[var(--primary-btn)] text-nowrap"
              >
                <Calendar size={14} /> Last 365 days
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li>
                  <a>Today</a>
                </li>
                <li>
                  <a>Yesterday</a>
                </li>
                <li>
                  <a>This week</a>
                </li>
                <li>
                  <a>Last week</a>
                </li>
              </ul>
            </div>
          </div>

          <Link to={"/dashboard/purchase-invoice"}>
            <button className="btn btn-sm bg-[var(--primary-btn)]">
              <Plus size={14} /> Create Purchase Invoice
            </button>
          </Link>
        </motion.div>

        <div className="mt-8 h-[460px] overflow-x-auto  border border-base-content/15 bg-base-100 overflow-y-auto">
          {isLoading ? (
            <div className="w-full flex justify-center py-16">
              <CustomLoader text={"Loading..."} />
            </div>
          ) : purchaseInvoices ? (
            <>
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
                className="table table-zebra  "
              >
                {/* head */}
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
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice?._id}
                        onClick={() =>
                          navigate(
                            `/dashboard/purchase-invoice/${invoice?._id}`
                          )
                        }
                        className="cursor-pointer"
                      >
                        <td>{invoice?.purchaseInvoiceDate.split("T")[0]}</td>
                        <td>{invoice?.purchaseInvoiceNumber}</td>
                        <td>{invoice?.partyId?.partyName}</td>
                        <td>{"-"}</td>
                        <td>
                          <div className="flex items-center ">
                            <LiaRupeeSignSolid size={12}/>
                            {Number(invoice?.totalAmount).toLocaleString(
                              "en-IN"
                            )}
                          </div>
                        </td>
                        <td>
                          <div
                            className={`badge badge-soft badge-sm  ${
                              invoice.status === "unpaid" ||
                              invoice.status === "cancelled"
                                ? "badge-error"
                                : "badge-success"
                            }`}
                          >
                            {invoice?.status}
                          </div>
                        </td>
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
                              className="dropdown-content menu bg-base-100 rounded-box shadow-sm z-[9999] w-52 p-2 fixed"
                              style={{ top: "auto", left: "auto" }}
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
                                  <BsTrash3 /> Delete
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
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
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ease: "easeInOut", duration: 0.2, delay: 0.4 }}
              className="w-full flex items-center justify-center my-8 flex-col gap-3 text-zinc-400"
            >
              <FaFileInvoice size={40} />
              No transactions matching the current filter
            </motion.div>
          )}
        </div>
      </div>
      {!showDeletePopup && (
        <>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4 text-sm">
                Are you sure you want to delete the selected item(s)? This
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

export default DashboardPurchasesPage;
