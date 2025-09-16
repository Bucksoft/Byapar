import { BsCartXFill, BsTrash3 } from "react-icons/bs";
import DashboardNavbar from "../components/DashboardNavbar";
import SalesNavigationMenus from "../components/SalesNavigationMenus";
import { useNavigate } from "react-router-dom";
import { useBusinessStore } from "../store/businessStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import PaymentInForm from "../components/PaymentIn/PaymentInForm";
import { useState } from "react";
import { usePaymentOutStore } from "../store/paymentOutStore";
import CustomLoader from "../components/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { EllipsisVertical } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import toast from "react-hot-toast";

const DashboardPaymentOutPage = () => {
  const [page, setPage] = useState("");
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [invoiceId, setInvoiceId] = useState();
  const { setPaymentOuts } = usePaymentOutStore();
  const [searchedQuery, setSearchedQuery] = useState("");
  const { business } = useBusinessStore();

  // mutation to delete an invoice
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/payment-out/${invoiceId}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg);
      document.getElementById("my_modal_2").close();
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  const { isLoading, data: paymentOuts } = useQuery({
    queryKey: ["paymentOuts"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/payment-out/all/${business?._id}`);
      setPaymentOuts(res.data?.paymentOuts);
      return res.data.paymentOuts;
    },
  });

  const searchedInvoices =
    paymentOuts && searchedQuery
      ? paymentOuts.filter(
          (paymentOut) =>
            paymentOut?.partyName
              ?.toLowerCase()
              .includes(searchedQuery.toLowerCase()) ||
            paymentOut?.paymentOutNumber === Number(searchedQuery)
        )
      : paymentOuts;

  return (
    <main className="h-full p-2">
      {page === "Payment Out" ? (
        <PaymentInForm />
      ) : (
        <>
          <div className="h-full w-full bg-white rounded-lg p-3">
            <DashboardNavbar title={"Payment Out"} />
            <SalesNavigationMenus
              btnText={"Payment Out"}
              selectText={"btn"}
              setPage={setPage}
              setSearchedQuery={setSearchedQuery}
            />

            <div className=" mt-5 h-80 rounded-md mx-4 ">
              {isLoading ? (
                <div className="w-full flex justify-center py-16">
                  <CustomLoader text={"Loading..."} />
                </div>
              ) : paymentOuts?.length > 0 ? (
                <table className="table ">
                  <thead>
                    <tr className="text-xs bg-zinc-100">
                      <th>Date</th>
                      <th>Payment Number</th>
                      <th className="text-center">Party Name</th>
                      <th className="text-right">Payment Amount</th>
                      <th className="text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(searchedInvoices || paymentOuts)?.map((paymentOut) => (
                      <tr
                        key={paymentOut?._id}
                        onClick={() =>
                          navigate(`/dashboard/payment-out/${paymentOut?._id}`)
                        }
                        className="cursor-pointer"
                      >
                        <td>{paymentOut?.paymentDate?.split("T")[0]}</td>
                        <td>{paymentOut?.paymentOutNumber || "-"}</td>
                        <td className="text-center">
                          {paymentOut?.partyName || "-"}
                        </td>
                        <td>
                          <div className="flex items-center justify-end">
                            <LiaRupeeSignSolid />
                            {Number(paymentOut?.paymentAmount).toLocaleString(
                              "en-IN"
                            ) || "-"}
                          </div>
                        </td>
                        <td
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center"
                        >
                          <div className="dropdown dropdown-end">
                            <div
                              tabIndex={0}
                              role="button"
                              className="btn btn-xs m-1"
                            >
                              <EllipsisVertical size={15} />
                            </div>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                            >
                              <li>
                                <a>
                                  <FaRegEdit /> Edit
                                </a>
                              </li>
                              <li>
                                <a
                                  onClick={() => {
                                    document
                                      .getElementById("my_modal_2")
                                      .showModal();
                                    setInvoiceId(paymentOut?._id);
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
                </table>
              ) : (
                <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
                  <FaFileInvoice size={40} />
                  <span className="text-sm">
                    No transactions matching the current filter
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
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

export default DashboardPaymentOutPage;
