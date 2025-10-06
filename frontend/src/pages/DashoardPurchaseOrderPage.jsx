import { BsCartXFill, BsTrash3 } from "react-icons/bs";
import DashboardNavbar from "../components/DashboardNavbar";
import SalesNavigationMenus from "../components/SalesNavigationMenus";
import { useBusinessStore } from "../store/businessStore";
import { usePurchaseOrderStore } from "../store/purchaseOrderStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import { EllipsisVertical } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa6";
import { LiaRupeeSignSolid } from "react-icons/lia";
import CustomLoader from "../components/Loader";
import dayjs from "dayjs";

const DashoardPurchaseOrderPage = () => {
  const { business } = useBusinessStore();
  const { setTotalPurchaseOrders, setPurchaseOrders } = usePurchaseOrderStore();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [type, setType] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [invoiceId, setInvoiceId] = useState();
  const navigate = useNavigate();

  // MUTATION TO DELETE INVOICE
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/purchase-order/${invoiceId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      queryClient.invalidateQueries({
        queryKey: ["purchaseOrder", business?._id],
      });
      document.getElementById("my_modal_2").close();
    },
  });

  // QUERY TO FETCH ALL PURCHASE INVOICES
  const { isLoading, data: purchaseOrders } = useQuery({
    queryKey: ["purchaseOrder"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/purchase-order/${business?._id}`);
      setPurchaseOrders(res.data?.purchaseOrders);
      setTotalPurchaseOrders(res.data?.totalPurchaseOrders);
      return res.data?.purchaseOrders;
    },
  });

  // FILTERING INVOICE BASED ON SEARCH QUERY
  const filteredPurchaseOrders =
    purchaseOrders &&
    purchaseOrders.filter((order) => {
      const purchaseOrderDate = dayjs(
        order?.purchaseOrderDate || order?.createdAt
      );

      // --- Date filter ---
      switch (filterDate) {
        case "today":
          if (!purchaseOrderDate.isSame(dayjs(), "day")) return false;
          break;
        case "yesterday":
          if (!purchaseOrderDate.isSame(dayjs().subtract(1, "day"), "day"))
            return false;
          break;
        case "thisWeek":
          if (
            !purchaseOrderDate.isBetween(
              dayjs().startOf("isoWeek"),
              dayjs().endOf("isoWeek"),
              null,
              "[]"
            )
          )
            return false;
          break;
        case "lastWeek":
          const startLastWeek = dayjs().subtract(1, "week").startOf("isoWeek");
          const endLastWeek = dayjs().subtract(1, "week").endOf("isoWeek");
          if (
            !purchaseOrderDate.isBetween(startLastWeek, endLastWeek, null, "[]")
          )
            return false;
          break;
        default:
          break;
      }

      // --- Search filter ---
      if (searchedQuery.trim()) {
        const query = searchedQuery.toLowerCase();
        const matchesText =
          order?.purchaseOrderNumber
            ?.toString()
            .toLowerCase()
            .includes(query) ||
          order?.partyId?.partyName?.toLowerCase().includes(query);
        return matchesText;
      }

      // FILTERING BASED ON QUOTATION TYPE
      if (type === "open" || type === "closed") {
        const matchesText = order?.status
          ?.toLowerCase()
          .includes(type.toLowerCase());
        return matchesText;
      } else {
        return order;
      }

      return true;
    });

  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Purchase Orders"} />
        <SalesNavigationMenus
          btnText={"Purchase Order"}
          title={"Purchase Orders"}
          selectText={"Orders"}
          type={type}
          setType={setType}
          setFilterDate={setFilterDate}
          setSearchedQuery={setSearchedQuery}
        />
        <div className=" mt-5 mx-4 ">
          {isLoading ? (
            <div className="w-full flex justify-center py-16">
              <CustomLoader text={"Loading..."} />
            </div>
          ) : (
            <table className="table table-zebra border border-[var(--table-border)]">
              {/* head */}
              <thead>
                <tr className="bg-[var(--primary-background)]">
                  <th>Date</th>
                  <th>Purchase Order Number</th>
                  <th>Party Name</th>
                  <th>Valid till</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPurchaseOrders && filteredPurchaseOrders.length > 0 ? (
                  filteredPurchaseOrders.map((invoice) => (
                    <tr
                      key={invoice?._id}
                      onClick={() =>
                        navigate(`/dashboard/purchase-order/${invoice?._id}`)
                      }
                      className="cursor-pointer"
                    >
                      <td>{invoice?.purchaseOrderDate.split("T")[0]}</td>
                      <td>{invoice?.purchaseOrderNumber}</td>
                      <td>{invoice?.partyId?.partyName}</td>
                      <td>{invoice?.validityDate.split("T")[0]}</td>
                      <td>
                        <div className="flex items-center">
                          <LiaRupeeSignSolid />
                          {Number(invoice?.totalAmount).toLocaleString("en-IN")}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`badge badge-soft badge-sm  ${
                            invoice.status === "unpaid" ||
                            invoice.status === "expired"
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
                    <td colSpan="7" className="text-center py-4 text-gray-500">
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
            </table>
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

export default DashoardPurchaseOrderPage;
