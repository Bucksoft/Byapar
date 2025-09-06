import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../config/axios";
import { usePaymentInStore } from "../store/paymentInStore";
import { ArrowLeft, Download, SquarePen } from "lucide-react";
import { BsTrash3 } from "react-icons/bs";
import { LiaRupeeSignSolid } from "react-icons/lia";
import toast from "react-hot-toast";
import { queryClient } from "../main";
import CustomLoader from "../components/Loader";

const DashboardPaymentInDetails = () => {
  const { id } = useParams();
  const { setPaymentIn } = usePaymentInStore();
  const navigate = useNavigate();

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
    <main className="h-full p-2">
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
                    {PaymentIn?.invoices?.map((invoice, index) => (
                      <tr>
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
    </main>
  );
};

export default DashboardPaymentInDetails;
