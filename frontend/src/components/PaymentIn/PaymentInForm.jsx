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
  const [checkedInvoices, setCheckedInvoices] = useState({});
  const navigate = useNavigate();
  const { setParty } = usePartyStore();
  const { invoices } = useInvoiceStore();
  const { business } = useBusinessStore();
  const { paymentIns, totalPaymentIns, latestPaymentIn } = usePaymentInStore();
  const [selectedParty, setSelectedParty] = useState();
  const [paymentInToEdit, setPaymentInToEdit] = useState();
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [allInvoices, setAllInvoices] = useState([]);
  const paymentAmountRef = useRef();
  const allocationTriggerRef = useRef(false);

  const location = useLocation();

  const handlePaymentInputChange = (value) => {
    allocationTriggerRef.current = true;
    setData((prev) => ({ ...prev, paymentAmount: Number(value || 0) }));
  };

  // DATA TO SEND TO THE BACKEND
  const [data, setData] = useState({
    partyName: "",
    partyId: "",
    paymentAmount: 0,
    paymentDate: new Date(Date.now()),
    paymentMode: "cash",
    paymentInNumber: latestPaymentIn + 1,
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
      return res.data?.data;
    },
  });

  useEffect(() => {
    if (!allParties || !invoices) return;
    const allInvoices = invoices?.filter(
      (invoice) =>
        invoice.partyId?._id.toString() === data?.partyId.toString() ||
        invoice.partyName === location.state?.partyName
    );

    setAllInvoices(allInvoices);
    const totalAmount = invoices?.reduce(
      (acc, item) => item?.totalAmount + acc,
      0
    );
    setTotalInvoiceAmount(totalAmount);
  }, [selectedParty]);

  useEffect(() => {
    if (!allInvoices?.length) return;

    if (!allocationTriggerRef.current) {
      return;
    }
    allocationTriggerRef.current = false;

    let remainingPayment = Number(data.paymentAmount) || 0;
    const newSettled = {};
    const newChecked = {};

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
        newChecked[invoice._id] = settleAmount === pending;
        remainingPayment -= settleAmount;
      } else {
        newSettled[invoice._id] = 0;
        newChecked[invoice._id] = false;
      }
    });

    setSettledInvoices(newSettled);
    setCheckedInvoices(newChecked);
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

  useEffect(() => {
    if (location?.state?.invoiceId && location?.state?.partyName) {
      setSelectedParty(location?.state?.partyName);
    }
  }, [location?.state?.invoiceId, location?.state?.partyName]);

  const handleInvoiceCheckbox = (invoiceId, pending) => {
    // prevent auto-allocation from running in effect
    allocationTriggerRef.current = false;

    setCheckedInvoices((prevChecked) => {
      const isChecked = !prevChecked[invoiceId];
      const nextChecked = { ...prevChecked, [invoiceId]: isChecked };

      // update settledInvoices for just this invoice
      setSettledInvoices((prevSettled) => {
        const nextSettled = { ...prevSettled };
        if (isChecked) {
          nextSettled[invoiceId] = pending; // mark fully settled for this invoice
        } else {
          nextSettled[invoiceId] = 0;
        }
        // update data.settledInvoices and paymentAmount based on nextSettled
        const totalSettledSum = Object.values(nextSettled).reduce(
          (s, v) => s + Number(v || 0),
          0
        );
        setData((prevData) => ({
          ...prevData,
          paymentAmount: totalSettledSum,
          settledInvoices: nextSettled,
        }));
        return nextSettled;
      });

      return nextChecked;
    });
  };

  return (
    <main className="h-screen w-full p-2">
      <div className="h-full w-full bg-white rounded-lg flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-2 sticky top-0 bg-white z-20 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <ArrowLeft
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            />
            <h2 className="font-medium">Payment In</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-soft btn-sm"
            >
              Cancel
            </button>
            <button
              className={`btn btn-sm bg-[var(--primary-btn)]  ${
                mutation?.isPending && "opacity-70 cursor-not-allowed"
              }`}
              disabled={mutation?.isPending}
              onClick={() => mutation.mutate(data)}
            >
              {mutation.isPending ? <CustomLoader text="Saving..." /> : "Save"}
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Form Section */}
          <section className="grid grid-cols-2 gap-4">
            {/* Left Div */}
            <div className="p-4 space-y-3 text-sm border border-[var(--primary-background)] rounded-lg">
              <div>
                <label className="text-zinc-500">Party Name</label>
                <select
                  className="select select-sm w-full mt-1"
                  value={selectedParty}
                  onChange={(e) => {
                    setSelectedParty(e.target.value);
                    setData((prev) => ({
                      ...prev,
                      partyName: e.target.value,
                      partyId: allParties.find(
                        (p) => p.partyName === e.target.value
                      )?._id,
                    }));
                  }}
                >
                  <option className="hidden">Select Party</option>
                  {allParties?.map((party) => (
                    <option key={party._id} value={party.partyName}>
                      {party.partyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-500">Payment Amount</label>
                <input
                  type="text"
                  value={data.paymentAmount}
                  onChange={(e) => handlePaymentInputChange(e.target.value)}
                  ref={paymentAmountRef}
                  className="input input-sm w-full mt-2"
                />
              </div>
            </div>

            {/* Right Div */}
            <div className="p-4 bg-white text-sm border border-[var(--primary-background)] rounded-lg space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col w-full">
                  <label className="text-zinc-500">Payment Date</label>
                  <input
                    type="date"
                    className="input input-sm mt-1"
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
                  <select
                    className="select select-sm mt-1"
                    value={data.paymentMode}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        paymentMode: e.target.value,
                      }))
                    }
                  >
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
                    className="input input-sm mt-1"
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

              <div>
                <label className="text-zinc-500">Notes</label>
                <textarea
                  className="textarea textarea-sm mt-2 w-full"
                  placeholder="Enter notes"
                  value={data.notes}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />
              </div>
            </div>
          </section>

          {/* Party's Invoice Details */}
          {allInvoices && allInvoices.length > 0 && (
            <section className="border border-zinc-300 rounded-lg flex flex-col max-h-[55vh]">
              <p className="p-4 font-medium border-b border-zinc-300">
                Settle invoices
              </p>

              {/* Scrollable Table */}
              <div className="flex-1 overflow-auto">
                <table className="table w-full table-zebra">
                  <thead className="sticky top-0 bg-[var(--primary-background)] z-10">
                    <tr>
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
                        const currentSettled =
                          settledInvoices[invoice?._id] || 0;
                        const pending = Math.max(
                          invoice?.totalAmount -
                            (alreadySettled + currentSettled),
                          0
                        );

                        return (
                          <tr key={invoice?._id} className="hover:bg-gray-50">
                            <td className="px-2 py-2">
                              <input
                                type="checkbox"
                                checked={!!checkedInvoices[invoice._id]}
                                className="checkbox checkbox-sm checkbox-info"
                                onChange={() =>
                                  handleInvoiceCheckbox(invoice._id, pending)
                                }
                              />
                            </td>
                            <td>{invoice?.salesInvoiceDate.split("T")[0]}</td>
                            <td>{invoice?.dueDate.split("T")[0]}</td>
                            <td>{invoice?.salesInvoiceNumber}</td>
                            <td>
                              <span className="inline-flex items-center gap-1">
                                <LiaRupeeSignSolid className="text-gray-600" />
                                {Number(invoice?.totalAmount).toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            </td>
                            <td>
                              <span className="inline-flex items-center gap-1 ">
                                <LiaRupeeSignSolid />
                                {pending.toLocaleString("en-IN")}
                              </span>
                            </td>
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
              </div>

              {/* Footer - Total Amounts */}
              <div className="p-4 font-medium flex justify-between border-t border-zinc-300 bg-white sticky bottom-0">
                <h2>Total</h2>
                <div className="flex items-center gap-10  w-1/3 justify-between ">
                  <span className="flex items-center">
                    <LiaRupeeSignSolid />
                    {totals.totalPending.toLocaleString("en-IN")}
                  </span>
                  <span className="flex items-center">
                    <LiaRupeeSignSolid />
                    {totals.totalSettled.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default PaymentInForm;
