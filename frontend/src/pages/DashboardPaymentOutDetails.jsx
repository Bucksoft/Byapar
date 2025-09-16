import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../config/axios";
import { ArrowLeft, Download, SquarePen } from "lucide-react";
import { BsTrash3 } from "react-icons/bs";
import { LiaRupeeSignSolid } from "react-icons/lia";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import CustomLoader from "../components/Loader";
import { usePaymentOutStore } from "../store/paymentOutStore";

const DashboardPaymentOutDetails = () => {
  const { id } = useParams();
  const { setPaymentOut } = usePaymentOutStore();
  const navigate = useNavigate();

  const { isLoading, data: paymentOut } = useQuery({
    queryKey: ["paymentOut"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/payment-out/${id}`);
      console.log(res);
      if (res.data.success) {
        setPaymentOut(res.data.data);
      }
      return res.data.data;
    },
  });

  function handleShare(e) {
    console.log(e.target.value);
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/payment-out/${id}`);
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
    <main className="h-full p-2">
      <section className="h-full w-full bg-white rounded-lg p-3">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeft onClick={() => navigate(-1)} />
            <p className="text-lg">
              Payment Out{" "}
              <span className="font-semibold">
                #{paymentOut?.paymentOut?.paymentOutNumber}
              </span>{" "}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-sm">
              <SquarePen size={15} />
              Edit
            </button>

            <button
              className=" btn btn-sm text-[var(--error-text-color)]"
              onClick={() => document.getElementById("my_modal_2").showModal()}
            >
              <BsTrash3 />
            </button>
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
          </div>
        </header>

        {/* MENUS */}
        <section className="flex items-center gap-2 mt-7 w-3/4 ">
          <button className="btn btn-sm">
            <Download size={15} /> Download PDF
          </button>
          <select className="select select-sm w-1/6">
            <option className="hidden">Print PDF</option>
            <option>Print PDF</option>
            <option>Print Thermal</option>
            <option>Print Duplicate</option>
            <option>Print Triplicate</option>
          </select>

          <select onChange={handleShare} className="select select-sm w-1/6">
            <option className="hidden">Share</option>
            <option value={"whatsapp"}>Whatsapp</option>
          </select>
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
                  <span>
                    {paymentOut?.paymentOut?.partyId?.partyName || "-"}
                  </span>
                </div>
                <div className="text-xs space-y-2">
                  <p className="text-zinc-500">Payment Date</p>
                  <span>
                    {paymentOut?.paymentOut?.paymentDate.split("T")[0] || "-"}
                  </span>
                </div>
                <div className="text-xs space-y-2">
                  <p className="text-zinc-500">Payment Amount</p>
                  <span className="flex items-center">
                    <LiaRupeeSignSolid />
                    {Number(
                      paymentOut?.paymentOut?.paymentAmount
                    ).toLocaleString("en-IN") || "-"}
                  </span>
                </div>
                <div className="text-xs space-y-2">
                  <p className="text-zinc-500">Payment Mode</p>
                  <span>{paymentOut?.paymentOut?.paymentMode || "-"}</span>
                </div>
                <div className="text-xs space-y-2">
                  <p className="text-zinc-500">Notes</p>
                  <span>{paymentOut?.paymentOut?.notes || "-"}</span>
                </div>
              </div>
            </section>

            {/* {SETTLED INVOICE DETAILS} */}
            <section className="w-full mt-8 text-sm border border-zinc-300 rounded-lg">
              <div className="border-b border-b-zinc-300 p-3 bg-zinc-100">
                <h1>Invoices Settled</h1>
              </div>

              <div className="overflow-x-auto">
                <table className="table">
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
                    {paymentOut?.invoices?.map((invoice, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{invoice?.purchaseInvoiceNumber}</td>
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
    </main>
  );
};

export default DashboardPaymentOutDetails;
