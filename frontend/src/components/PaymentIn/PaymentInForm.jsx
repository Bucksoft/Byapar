import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePartyStore } from "../../store/partyStore";
import { useEffect, useRef, useState } from "react";
import { useInvoiceStore } from "../../store/invoicesStore";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useMutation, useQuery } from "@tanstack/react-query";
import CustomLoader from "../../components/Loader";
import toast from "react-hot-toast";
import { useBusinessStore } from "../../store/businessStore";
import { axiosInstance } from "../../config/axios";
import { queryClient } from "../../main";
import { usePurchaseInvoiceStore } from "../../store/purchaseInvoiceStore";
import { usePaymentInStore } from "../../store/paymentInStore";

const PaymentInForm = () => {
  const [settledInvoices, setSettledInvoices] = useState({});
  const navigate = useNavigate();
  const { parties, setParty } = usePartyStore();
  const { invoices } = useInvoiceStore();
  const { business } = useBusinessStore();
  const { paymentIns, totalPaymentIns } = usePaymentInStore();
  const [selectedParty, setSelectedParty] = useState();
  const [paymentInToEdit, setPaymentInToEdit] = useState();
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [allInvoices, setAllInvoices] = useState([]);
  const paymentAmountRef = useRef();
  const location = useLocation();

  const [data, setData] = useState({
    partyName: "",
    paymentAmount: 0,
    paymentDate: new Date(Date.now()),
    paymentMode: "cash",
    paymentInNumber: totalPaymentIns + 1,
    notes: "",
    settledInvoices: {},
  });

  // fetching all parties
  const { data: allParties } = useQuery({
    queryKey: ["allParties", business?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/parties/all-parties/${business?._id}`
      );
      return res.data?.parties;
    },
  });

  useEffect(() => {
    if (!parties || !invoices) return;
    const allInvoices = invoices?.invoices?.filter(
      (invoice) => invoice.partyName === selectedParty
    );
    setAllInvoices(allInvoices);
    const totalAmount = invoices?.invoices?.reduce(
      (acc, item) => item?.totalAmount + acc,
      0
    );
    setTotalInvoiceAmount(totalAmount);
  }, [selectedParty]);

  useEffect(() => {
    if (!allInvoices?.length) return;

    let remainingPayment = data.paymentAmount;
    const newSettled = {};

    // Sort invoices by oldest first
    const sorted = [...allInvoices].sort(
      (a, b) =>
        new Date(a.salesInvoiceDate).getTime() -
        new Date(b.salesInvoiceDate).getTime()
    );

    sorted.forEach((invoice) => {
      const alreadySettled = invoice?.settledAmount || 0;
      const pending = Math.max(invoice.totalAmount - alreadySettled, 0);
      if (remainingPayment > 0 && pending > 0) {
        const settleAmount = Math.min(pending, remainingPayment);
        newSettled[invoice._id] = settleAmount;
        remainingPayment -= settleAmount;
      } else {
        newSettled[invoice._id] = 0;
      }
    });

    setSettledInvoices(newSettled);
    setData((prev) => ({ ...prev, settledInvoices: newSettled }));
  }, [data.paymentAmount, allInvoices]);

  // Edit payment in useEffect
  useEffect(() => {
    if (!location?.state?.id || !paymentIns?.length) return;

    const paymentIn = paymentIns.find((p) => p?._id === location.state.id);

    if (paymentIn) {
      setPaymentInToEdit(paymentIn);

      // Fill all state values into data
      setSelectedParty(paymentIn?.partyName);
      setData((prev) => ({
        ...prev,
        partyName: paymentIn.partyName || "",
        paymentAmount: Number(paymentIn.paymentAmount) || 0,
        paymentDate: paymentIn.paymentDate
          ? new Date(paymentIn.paymentDate)
          : new Date(Date.now()),
        paymentMode: paymentIn.paymentMode || "cash",
        paymentInNumber: paymentIn.paymentInNumber || 1,
        notes: paymentIn.notes || "",
        settledInvoices: paymentIn.settledInvoices || {},
      }));
    }
  }, [location?.state?.id, paymentIns]);

  // handling actual form submission
  const mutation = useMutation({
    mutationFn: async (data) => {
      if (!selectedParty) {
        throw new Error("Please select a party");
      }
      if (data?.paymentAmount <= 0) {
        paymentAmountRef.current.style.outlineColor = "red";
        paymentAmountRef.current.style.borderColor = "red";
        paymentAmountRef.current.focus();
        throw new Error("Please enter a payment amount");
      }
      let res;

      if (paymentInToEdit?._id) {
        res = await axiosInstance.patch(
          `/payment-in/${business?._id}/${paymentInToEdit._id}`,
          data
        );
      } else {
        res = await axiosInstance.post(`/payment-in/${business?._id}`, data);
      }
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.msg || "Payment In recorded successfully");
      setParty(data);
      navigate("/dashboard/payment-in");
      queryClient.invalidateQueries({ queryKey: ["paymentIns", "invoices"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.msg || err?.message);
    },
  });

  // THIS FUNCTION IS USED FOR CALCULATING TOTAL VALUES
  const totals =
    allInvoices?.length &&
    allInvoices?.reduce(
      (acc, invoice) => {
        const alreadySettled = invoice?.settledAmount || 0;
        const currentSettled = settledInvoices[invoice?._id] || 0;

        const pending = Math.max(
          invoice?.totalAmount - (alreadySettled + currentSettled),
          0
        );

        acc.totalPending += pending;
        acc.totalSettled += alreadySettled + currentSettled;

        return acc;
      },
      { totalPending: 0, totalSettled: 0 }
    );

  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <main className="h-full w-full p-2 ">
      <div className="h-full w-full bg-white rounded-lg">
        {/* Header */}
        <header className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <ArrowLeft onClick={() => navigate(-1)} />
            Payment In
          </div>
          <div>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-soft btn-sm mr-2"
            >
              Cancel
            </button>
            <button
              className={`btn btn-sm bg-[var(--primary-btn)] ${
                mutation?.isPending && ""
              } `}
              disabled={mutation?.isPending}
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
                  partyName: e.target.value,
                }));
              }}
            >
              <option className="hidden">Select Party</option>
              {allParties &&
                allParties?.map((party) => (
                  <option value={party?.partyName} key={party?._id}>
                    {party?.partyName}
                  </option>
                ))}
            </select>

            {selectedParty && (
              <p className="flex items-center mb-1 text-green-500 text-xs">
                Current Balance :
                <LiaRupeeSignSolid />{" "}
                {
                  parties?.filter(
                    (party) => party?.partyName === selectedParty
                  )[0]?.currentBalance
                }
              </p>
            )}

            <label className="text-zinc-500 ">Payment Amount</label>
            <br />
            <input
              type="number"
              placeholder="0"
              ref={paymentAmountRef}
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
                <input
                  type="date"
                  className="input input-sm mt-2"
                  value={formatDateForInput(data?.paymentDate)}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      paymentDate: e.target.value,
                    }))
                  }
                />
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
                <label className="text-zinc-500">Payment In Number</label>
                <input
                  type="text"
                  className="input input-sm mt-2"
                  placeholder="1"
                  name="paymentInNumber"
                  value={data?.paymentInNumber}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      paymentInNumber: e.target.value,
                    }))
                  }
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
          {allInvoices && allInvoices.length > 0 && (
            <div className="overflow-x-auto border border-zinc-300 rounded-lg">
              <p className="p-4 font-medium">Settle invoices</p>
              <table className="table w-full table-zebra ">
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
                    .map((invoice) => {
                      const alreadySettled = invoice?.settledAmount || 0;
                      const currentSettled = settledInvoices[invoice?._id] || 0;
                      const pending = Math.max(
                        invoice?.totalAmount -
                          (alreadySettled + currentSettled),
                        0
                      );

                      return (
                        <tr key={invoice?._id} className="hover:bg-gray-50">
                          {/* Checkbox → mark as fully settled if pending is 0 */}
                          <td className="px-2 py-2">
                            <input
                              type="checkbox"
                              checked={pending === 0}
                              className="checkbox checkbox-sm checkbox-info"
                              // readOnly
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
                              {pending.toLocaleString("en-IN")}
                            </span>
                          </td>

                          {/* Amount Settled (previous + current) */}
                          <td className="inline-flex items-center gap-1 justify-end w-full">
                            <LiaRupeeSignSolid />
                            {Number(
                              alreadySettled + currentSettled
                            ).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {/* total amount */}
              <div className="p-4 font-medium  flex justify-between border-t border-zinc-300">
                <h2>Total</h2>
                <div className="flex items-center  w-3/9 justify-between">
                  <span className="flex items-center ">
                    <LiaRupeeSignSolid />
                    {/*  pending amount ka total */}
                    {totals.totalPending.toLocaleString("en-IN")}
                  </span>

                  {/* Settled amount ka total */}
                  <span className="flex items-center ">
                    <LiaRupeeSignSolid />
                    {/*  pending amount ka total */}
                    {totals.totalSettled.toLocaleString("en-IN")}
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
