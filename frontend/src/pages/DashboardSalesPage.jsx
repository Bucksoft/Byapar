import DashboardNavbar from "../components/DashboardNavbar";
import { dashboardSaledCardsDetails } from "../lib/dashboardSalesCards";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { EllipsisVertical, Plus, Search } from "lucide-react";
import { FaFileInvoice, FaRegEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import { container, dashboardLinksItems } from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { queryClient } from "../main";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import CustomLoader from "../components/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { MdOutlineHistory } from "react-icons/md";
import { BiDuplicate } from "react-icons/bi";
import { BsTrash3 } from "react-icons/bs";
import { useInvoiceStore } from "../store/invoicesStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DashboardSalesPage = () => {
  const { setInvoices } = useInvoiceStore();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [invoiceId, setInvoiceId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // to get all the invoices
  const {
    isLoading,
    data: invoices,
    isSuccess,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await axiosInstance.get("/sales-invoice");
      return res.data?.invoices;
    },
  });

  // mutation to delete an invoice
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/sales-invoice/${invoiceId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  useEffect(() => {
    if (isSuccess && invoices) {
      setInvoices(invoices);
    }
  }, [isSuccess, invoices]);

  const searchedInvoices =
    invoices && searchQuery
      ? invoices.filter(
          (invoice) =>
            invoice?.partyId?.partyName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            invoice?.salesInvoiceNumber === Number(searchQuery)
        )
      : invoices;

  return (
    <main className="h-full p-2 ">
      <div className="h-full w-full flex flex-col bg-white rounded-lg p-3">
        <DashboardNavbar title={"Sales Invoice"} isReport={"true"} />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-2"
        >
          {dashboardSaledCardsDetails?.map((details) => (
            <motion.div
              variants={dashboardLinksItems}
              key={details.id}
              style={{
                borderColor: `${details.color}`,
                // backgroundColor: `${details.color}`,
              }}
              className={`border mt-5 rounded-md p-3  shadow-md hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
            >
              <p
                style={{
                  color: `${details.color}`,
                }}
                className={`flex items-center gap-3 `}
              >
                {details.icon} {details.label}
              </p>
              <span className="font-medium text-2xl flex items-center gap-2">
                {<FaIndianRupeeSign size={15} />}
                {details.label === "Total Sales" && invoices
                  ? Number(
                      invoices
                        .reduce(
                          (acc, invoice) =>
                            acc + Number(invoice?.totalAmount || 0),
                          0
                        )
                        .toFixed(2)
                    ).toLocaleString("en-IN")
                  : 0}
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

        <div className="overflow-x-auto flex-1 rounded-box border border-base-content/5 bg-base-100 mt-5 ">
          {isLoading ? (
            <div className="w-full py-3 flex justify-center">
              <CustomLoader text={"Getting all invoices..."} />
            </div>
          ) : (
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
              className="table"
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
                {(searchedInvoices || invoices).map((invoice) => (
                  <tr
                    key={invoice?._id}
                    onClick={() =>
                      navigate(`/dashboard/sales-invoice/${invoice?._id}`)
                    }
                    className="cursor-pointer"
                  >
                    <td>{invoice?.salesInvoiceDate.split("T")[0]}</td>
                    <td>{invoice?.salesInvoiceNumber}</td>
                    <td>{invoice?.partyId?.partyName}</td>
                    <td>{invoice?.dueDate.split("T")[0]}</td>
                    <td className="flex items-center gap-1">
                      <LiaRupeeSignSolid />
                      {Number(invoice?.totalAmount).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <p
                        className={`badge badge-soft badge-sm ${
                          invoice?.status === "unpaid"
                            ? "badge-error"
                            : "badge-success"
                        }  `}
                      >
                        Unpaid
                      </p>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn m-1 btn-xs"
                        >
                          <EllipsisVertical size={13} />
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
                        >
                          <li>
                            <a>
                              <FaRegEdit /> Edit
                            </a>
                          </li>
                          <li>
                            <a>
                              <MdOutlineHistory />
                              Edit History
                            </a>
                          </li>
                          <li>
                            <a>
                              <BiDuplicate />
                              Duplicate
                            </a>
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
                  </tr>
                ))}
              </tbody>
            </motion.table>
          )}

          {invoices?.length <= 0 && (
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

export default DashboardSalesPage;
