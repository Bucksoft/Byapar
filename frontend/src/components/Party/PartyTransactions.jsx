import { GrDocumentExcel } from "react-icons/gr";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useQuotationStore } from "../../store/quotationStore";
import { usePaymentInStore } from "../../store/paymentInStore";
import { useEffect } from "react";
import { useState } from "react";

const PartyTransactions = ({ party, filter, partyInvoices: invoices }) => {
  const { quotations } = useQuotationStore();
  const { paymentIns } = usePaymentInStore();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const safeArray = (x) => (Array.isArray(x) ? x : []);

    const rawPaymentList = Array.isArray(paymentIns)
      ? paymentIns
      : Array.isArray(paymentIns?.paymentIns)
      ? paymentIns.paymentIns
      : [];

    const invoiceList = safeArray(invoices);
    const quotationList = safeArray(quotations);

    const partyInvoices = invoiceList
      .filter((inv) => inv.partyName === party?.partyName)
      .map((inv) => ({ ...inv, type: "sales invoice" }));

    const partyQuotations = quotationList
      .filter((q) => q?.partyName === party?.partyName)
      .map((q) => ({ ...q, type: "quotation" }));

    const partyPaymentIns = rawPaymentList
      .filter((p) => p?.partyName === party?.partyName)
      .map((p) => ({ ...p, type: "payment in" }));

    setTransactions([...partyInvoices, ...partyPaymentIns, ...partyQuotations]);
  }, [invoices, quotations, paymentIns, party]);

  const filteredTransactions =
    filter && filter !== "all_transactions"
      ? transactions.filter(
          (t) => t.type.replace(" ", "_") === filter.toLowerCase()
        )
      : transactions;

  return (
    <section>
      <div className="overflow-x-auto border border-zinc-200 rounded-md mb-4">
        <table className="table table-sm table-zebra ">
          {/* head */}
          <thead>
            <tr className="bg-zinc-100">
              <th>S.No.</th>
              <th>Date</th>
              <th>Transaction Type</th>
              <th>Transaction Number</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions
              ?.slice() 
              .sort((a, b) => {
                const dateA = new Date(
                  a.salesInvoiceDate || a.quotationDate || a.paymentDate
                );
                const dateB = new Date(
                  b.salesInvoiceDate || b.quotationDate || b.paymentDate
                );
                return dateB - dateA; // descending order
              })
              .map((transaction, index) => (
                <tr key={transaction?._id}>
                  <td>{index + 1}</td>
                  <td>
                    {transaction?.salesInvoiceDate?.split("T")[0] ||
                      transaction?.quotationDate?.split("T")[0] ||
                      transaction?.paymentDate?.split("T")[0] ||
                      "-"}
                  </td>
                  <td>{transaction?.type || "-"}</td>
                  <td>
                    {transaction?.salesInvoiceNumber ||
                      transaction?.quotationNumber ||
                      transaction?.paymentInNumber ||
                      "-"}
                  </td>
                  <td>
                    <div className="flex items-center">
                      <LiaRupeeSignSolid />
                      {transaction?.totalAmount != null
                        ? Number(transaction.totalAmount).toLocaleString(
                            "en-IN"
                          )
                        : transaction?.paymentAmount != null
                        ? Number(transaction.paymentAmount).toLocaleString(
                            "en-IN"
                          )
                        : "-"}
                    </div>
                  </td>
                  <td>
                    <div
                      className={`${
                        transaction.status && "badge badge-sm badge-soft"
                      } ${
                        transaction?.status === "unpaid"
                          ? "badge-error"
                          : "badge-success"
                      }`}
                    >
                      {transaction?.status && transaction?.status}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <div className="flex items-center justify-center w-full py-16 flex-col text-zinc-500 gap-2">
            <GrDocumentExcel size={25} />
            No transactions yet
          </div>
        )}
      </div>
    </section>
  );
};

export default PartyTransactions;
