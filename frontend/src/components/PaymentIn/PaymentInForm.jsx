import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePartyStore } from "../../store/partyStore";
import { useEffect, useState } from "react";
import { useInvoiceStore } from "../../store/invoicesStore";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import CustomLoader from "../../components/Loader";
import toast from "react-hot-toast";

const PaymentInForm = () => {
  const [settledInvoices, setSettledInvoices] = useState({});
  const navigate = useNavigate();
  const { parties } = usePartyStore();
  const { invoices } = useInvoiceStore();
  const [selectedParty, setSelectedParty] = useState();
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [allInvoices, setAllInvoices] = useState([]);
  const [data, setData] = useState({
    partyName: "",
    paymentAmount: 0,
    paymentDate: new Date(Date.now()),
    paymentMode: "cash",
    paymentInNumber: 1,
    notes: "",
    settledInvoices: {},
  });

  useEffect(() => {
    if (!parties || !invoices) return;
    const allInvoices = invoices.filter(
      (invoice) => invoice.partyId?.partyName === selectedParty
    );
    setAllInvoices(allInvoices);
    const totalAmount = allInvoices.reduce(
      (acc, item) => item?.totalAmount + acc,
      0
    );
    setTotalInvoiceAmount(totalAmount);
  }, [selectedParty]);

  useEffect(() => {
    if (!allInvoices.length) return;

    let remainingPayment = data.paymentAmount;
    const newSettled = {};

    const sorted = [...allInvoices].sort(
      (a, b) =>
        new Date(a.salesInvoiceDate).getTime() -
        new Date(b.salesInvoiceDate).getTime()
    );

    sorted.forEach((invoice) => {
      if (remainingPayment > 0) {
        const settleAmount = Math.min(invoice.totalAmount, remainingPayment);
        newSettled[invoice?._id] = settleAmount;
        remainingPayment -= settleAmount;
      } else {
        newSettled[invoice._id] = 0;
      }
    });

    setSettledInvoices(newSettled);
    setData((prev) => ({ ...prev, settledInvoices: newSettled }));
  }, [data.paymentAmount, allInvoices]);

  // handling actual form submission
  const mutation = useMutation({
    mutationFn: async (data) => {
      console.log(data);
      const res = await axiosInstance.post("/payment-in", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Payment Successfull");
      setParty(data);
      queryClient.invalidateQueries({ queryKey: ["payment"] });
    },
    onError: (err) => {
      toast.error(err.response.data.msg || err.response.data.err);
    },
  });

  return (
    <main className="h-full w-full p-2">
      <div className="h-full w-full bg-white rounded-lg">
        {/* Header */}
        <header className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <ArrowLeft onClick={() => navigate(-1)} />
            Payment In
          </div>
          <div>
            <button className="btn btn-soft btn-sm mr-2">Cancel</button>
            <button
              className={`btn btn-sm bg-[var(--primary-btn)] ${
                mutation.isPending && ""
              } `}
              disabled={mutation.isPending}
              onClick={() => mutation.mutate(data)}
            >
              {mutation.isPending ? (
                <CustomLoader text={"Saving..."} />
              ) : (
                <>Save</>
              )}
            </button>
          </div>
        </header>

        {/* form */}
        <section className="grid grid-cols-2 py-2 px-4 gap-2">
          {/* left div */}
          <div className="p-4  text-sm border border-[var(--primary-background)] rounded-lg">
            <label className="text-zinc-500">Party Name</label>
            <br />
            <select
              className="select select-sm w-full mt-2 mb-5"
              value={selectedParty}
              onChange={(e) => {
                setSelectedParty(e.target.value);
                setData((prev) => ({
                  ...prev,
                  partyName: e.target.value, // 🔑 keep data.partyName updated
                }));
              }}
            >
              <option className="hidden">Select Party</option>
              {parties.map((party) => (
                <option value={party?.partyName} key={party?._id}>
                  {party?.partyName}
                </option>
              ))}
            </select>

            {selectedParty && (
              <p className="flex items-center mb-1 text-green-500 text-xs">
                Current Balance :
                <LiaRupeeSignSolid />{" "}
                {Number(totalInvoiceAmount).toLocaleString("en-IN")}
              </p>
            )}

            <label className="text-zinc-500 ">Payment Amount</label>
            <br />
            <input
              type="number"
              placeholder="0"
              value={data.paymentAmount}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  paymentAmount: Number(e.target.value),
                }))
              }
              className="input input-sm w-full mt-2"
            />
          </div>

          {/* right div */}
          <div className="p-4  text-sm border border-[var(--primary-background)] rounded-lg">
            <div className="flex items-center justify-center gap-3 ">
              <div className="flex flex-col w-full">
                <label className="text-zinc-500">Payment Date</label>
                <input type="date" className="input input-sm mt-2 " />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-zinc-500">Payment Mode</label>
                <select className="select select-sm mt-2">
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Netbanking">Netbanking</option>
                  <option value="Bank transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label className="text-zinc-500">Payment Out Number</label>
                <input
                  type="text"
                  className="input input-sm mt-2"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="flex flex-col mt-5">
              <label className="text-zinc-500">Notes</label>
              <textarea
                className="textarea mt-3 w-full"
                placeholder="Enter notes"
                value={data.notes}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>
          </div>
        </section>

        {/* PARTY's INVOICE DETAILS */}
        <section className="m-4">
          {allInvoices.length > 0 && (
            <div className="overflow-x-auto border border-zinc-300 rounded-lg">
              <p className="p-4 font-medium">Settle invoices</p>
              <table className="table w-full ">
                {/* head */}
                <thead>
                  <tr className="bg-[var(--primary-background)] ">
                    <th className="w-10"></th>
                    <th>Date</th>
                    <th>Due Date</th>
                    <th>Invoice Number</th>
                    <th>Invoice Amount</th>
                    <th>Pending Amount</th>
                    <th className="text-right">Amount Settled</th>
                  </tr>
                </thead>

                <tbody>
                  {[...allInvoices]
                    .sort(
                      (a, b) =>
                        new Date(a.salesInvoiceDate).getTime() -
                        new Date(b.salesInvoiceDate).getTime()
                    )
                    .map((invoice) => (
                      <tr key={invoice?._id} className="hover:bg-gray-50">
                        <td className="px-2 py-2">
                          <input
                            type="checkbox"
                            checked={
                              Number(
                                Math.max(
                                  invoice?.totalAmount -
                                    (settledInvoices[invoice?._id] || 0),
                                  0
                                )
                              ) === 0
                            }
                            className="checkbox checkbox-sm checkbox-info"
                          />
                        </td>

                        <td>{invoice?.salesInvoiceDate.split("T")[0]}</td>
                        <td>{invoice?.dueDate.split("T")[0]}</td>
                        <td>{invoice?.salesInvoiceNumber}</td>

                        {/* Invoice Amount */}
                        <td>
                          <span className="inline-flex items-center gap-1">
                            <LiaRupeeSignSolid className="text-gray-600" />
                            {Number(invoice?.totalAmount).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </td>

                        {/* Pending Amount */}
                        <td>
                          <span className="inline-flex items-center gap-1">
                            <LiaRupeeSignSolid />
                            {Number(
                              Math.max(
                                invoice?.totalAmount -
                                  (settledInvoices[invoice?._id] || 0),
                                0
                              )
                            ).toLocaleString("en-IN")}
                          </span>
                        </td>

                        {/* Amount Settled */}
                        <td className="inline-flex items-center gap-1 justify-end w-full">
                          <LiaRupeeSignSolid />
                          {Number(
                            settledInvoices[invoice?._id] || 0
                          ).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* total amount */}
              <div className="p-4 font-medium  flex justify-between border-t border-zinc-300">
                <h2>Total</h2>
                <div className="flex items-center  w-3/9 justify-between">
                  <span className="flex items-center ">
                    <LiaRupeeSignSolid />
                    {/*  pending amount ka total */}
                    {allInvoices
                      .reduce(
                        (sum, inv) =>
                          sum +
                          Math.max(
                            inv?.totalAmount - (settledInvoices[inv._id] || 0),
                            0
                          ),
                        0
                      )
                      .toLocaleString("en-IN")}
                  </span>

                  {/* Settled amount ka total */}
                  <span className="flex items-center ">
                    <LiaRupeeSignSolid />
                    {/*  pending amount ka total */}
                    {allInvoices
                      .reduce(
                        (sum, inv) =>
                          sum + Math.max(settledInvoices[inv._id] || 0, 0),
                        0
                      )
                      .toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default PaymentInForm;
