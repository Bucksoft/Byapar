import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../config/axios";
import { usePaymentInStore } from "../store/paymentInStore";
import { ArrowLeft, Download, Printer, SquarePen } from "lucide-react";
import { BsTrash3 } from "react-icons/bs";
import { LiaRupeeSignSolid } from "react-icons/lia";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import CustomLoader from "../components/Loader";
import { useState } from "react";
import PaymentInTemplate from "../components/Invoices/PaymentIn";
import { downloadPDF } from "../../helpers/downloadPdf";
import { useRef } from "react";
import { handlePaymentPrint, handlePrint } from "../../helpers/print";

const DashboardPaymentInDetails = () => {
  const { id } = useParams();
  const { setPaymentIn } = usePaymentInStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [paymentInIdToDownload, setPaymentIdToDownload] = useState("");
  const printRef = useRef();
  const navigate = useNavigate();

  // QUERY TO FETCH ALL THE PAYMENT INS
  const { isLoading, data: PaymentIn } = useQuery({
    queryKey: ["payment-in"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/payment-in/${id}`);
      if (res.data.success) {
        setPaymentIn(res.data.data);
      }
      return res.data.data;
    },
  });

  function handleShare(e) {
    console.log(e.target.value);
  }

  // MUTATION TO DELETE THE PAYMENT IN
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/payment-in/${id}`);
      return res.data.msg;
    },
    onSuccess: (data) => {
      toast.success(data);
      document.getElementById("my_modal_2").close();
      queryClient.invalidateQueries({ queryKey: ["paymentIns"] });
      navigate(-1);
    },
  });

  return (
    <main className="h-full p-2 relative">
      <section className="h-full w-full bg-white rounded-lg p-3">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeft onClick={() => navigate(-1)} />
            <p className="text-lg">
              Payment In{" "}
              <span className="font-semibold">
                #{PaymentIn?.paymentIn?.paymentInNumber}
              </span>{" "}
              {PaymentIn?.paymentIn?.status === "cancelled" && (
                <span className="badge badge-error badge-soft ml-2">
                  Cancelled
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {PaymentIn?.paymentIn?.status !== "cancelled" && (
              <button
                onClick={() =>
                  navigate(`/dashboard/parties/create-payment-in`, {
                    state: { id: id },
                  })
                }
                className="btn btn-sm rounded-xl"
              >
                <SquarePen size={15} />
                Edit
              </button>
            )}

            {PaymentIn?.paymentIn?.status !== "cancelled" && (
              <button
                className="btn rounded-xl btn-sm text-[var(--error-text-color)]"
                onClick={() =>
                  document.getElementById("my_modal_2").showModal()
                }
              >
                <BsTrash3 />
              </button>
            )}

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
                    className="btn rounded-xl btn-sm btn-ghost  ml-auto text-[var(--error-text-color)]"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="btn btn-sm rounded-xl">close</button>
              </form>
            </dialog>
          </div>
        </header>

        {/* MENUS */}
        <section className="flex items-center gap-2 mt-7 w-3/4 ">
          {/* DOWNLOAD PDF */}
          {PaymentIn?.paymentIn?.status !== "cancelled" && (
            <button
              className="btn btn-sm rounded-xl"
              onClick={() => {
                setPaymentIdToDownload(PaymentIn?.paymentIn?._id);
                document.getElementById("my_modal_1").showModal();
              }}
            >
              <Download size={15} /> Download PDF
            </button>
          )}

          {/* PRINT BUTTON */}
          {PaymentIn?.paymentIn?.status !== "cancelled" && (
            <button
              onClick={() => handlePaymentPrint(printRef)}
              className="btn btn-sm btn-dash rounded-xl"
            >
              <Printer size={15} /> Print
            </button>
          )}

          {PaymentIn?.paymentIn?.status !== "cancelled" && (
            <select onChange={handleShare} className="select select-sm w-1/6">
              <option className="hidden">Share</option>
              <option value={"whatsapp"}>Whatsapp</option>
            </select>
          )}
        </section>

        {isLoading ? (
          <div className="w-full flex justify-center py-16">
            <CustomLoader text={"Loading..."} />
          </div>
        ) : (
          <>
            {/* PAYMENT DETAILS */}
            <section className="w-full mt-8 text-sm border border-zinc-300 rounded-lg">
              <div className="border-b border-b-zinc-300 p-3 bg-zinc-100">
                <h1>Payment Details</h1>
              </div>
              <div className="grid grid-cols-5 gap-3 p-3">
                <div className="text-xs space-y-2">
                  <p className="text-zinc-500">Party Name</p>
                  <span>{PaymentIn?.paymentIn?.partyId?.partyName || "-"}</span>
                </div>
                <div className="text-xs space-y-2">
                  <p className="text-zinc-500">Payment Date</p>
                  <span>
                    {PaymentIn?.paymentIn?.paymentDate.split("T")[0] || "-"}
                  </span>
                </div>
                <div className="text-xs space-y-2">
                  <p className="text-zinc-500">Payment Amount</p>
                  <span className="flex items-center">
                    <LiaRupeeSignSolid />
                    {Number(PaymentIn?.paymentIn?.paymentAmount).toLocaleString(
                      "en-IN"
                    ) || "-"}
                  </span>
                </div>
                <div className="text-xs space-y-2">
                  <p className="text-zinc-500">Payment Mode</p>
                  <span>{PaymentIn?.paymentIn?.paymentMode || "-"}</span>
                </div>
                <div className="text-xs space-y-2">
                  <p className="text-zinc-500">Notes</p>
                  <span>{PaymentIn?.paymentIn?.notes || "-"}</span>
                </div>
              </div>
            </section>

            {/* {SETTLED INVOICE DETAILS} */}
            <section className="w-full mt-8 text-sm border border-zinc-300 rounded-lg">
              <div className="border-b border-b-zinc-300 p-3 bg-zinc-100">
                <h1>Invoices Settled</h1>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  {/* head */}
                  <thead>
                    <tr className="bg-zinc-200">
                      <th>Sr No.</th>
                      <th>Invoice Number</th>
                      <th>Invoice Amount</th>
                      <th>Invoice Amount Settled</th>
                      <th>TDS Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PaymentIn?.invoices?.map((invoice, index) => (
                      <tr key={invoice?._id}>
                        <td>{index + 1}</td>
                        <td>{invoice?.salesInvoiceNumber}</td>
                        <td>
                          <div className="flex items-center">
                            <LiaRupeeSignSolid />
                            {Number(invoice?.totalAmount).toLocaleString(
                              "en-IN"
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <LiaRupeeSignSolid />
                            {Number(invoice?.settledAmount).toLocaleString(
                              "en-IN"
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <LiaRupeeSignSolid />0
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </section>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <PaymentInTemplate
            data={PaymentIn}
            id={paymentInIdToDownload}
            printRef={printRef}
          />
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm rounded-xl">Close</button>
            </form>
            <button
              onClick={() =>
                downloadPDF(
                  paymentInIdToDownload,
                  `${PaymentIn?.paymentIn?.partyId?.partyName
                    ?.split(" ")
                    .join("-")
                    .concat("_paymentIn")}`,
                  setIsDownloading
                )
              }
              className="btn rounded-xl btn-sm btn-info"
            >
              {isDownloading ? (
                <CustomLoader text={""} />
              ) : (
                <>
                  <Download size={15} /> Download
                </>
              )}
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
};

export default DashboardPaymentInDetails;
