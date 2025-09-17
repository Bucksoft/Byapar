import React from "react";
import { GrDocumentExcel } from "react-icons/gr";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useInvoiceStore } from "../../store/invoicesStore";
import { useQuotationStore } from "../../store/quotationStore";
import { usePaymentInStore } from "../../store/paymentInStore";
import { useEffect } from "react";
import { useState } from "react";

const PartyTransactions = ({ party, filter }) => {
  const { invoices } = useInvoiceStore();
  const { quotations } = useQuotationStore();
  const { paymentIns } = usePaymentInStore();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const partyInvoices = invoices
      .filter((invoice) => invoice.partyName === party?.partyName)
      .map((invoice) => ({ ...invoice, type: "sales invoice" }));

    const partyQuotations = quotations
      .filter((quotation) => quotation.partyName === party?.partyName)
      .map((quotation) => ({ ...quotation, type: "quotation" }));

    const partyPaymentIns = paymentIns
      .filter((paymentIn) => paymentIn.partyName === party?.partyName)
      .map((paymentIn) => ({ ...paymentIn, type: "payment in" }));

    setTransactions([...partyInvoices, ...partyPaymentIns, ...partyQuotations]);
  }, [invoices, quotations, paymentIns, party]);

  const filteredTransactions =
    filter && filter !== "all_transactions"
      ? transactions.filter(
          (t) => t.type.replace(" ", "_") === filter.toLowerCase() // sales_invoice → sales invoice
        )
      : transactions;

  return (
    <section>
      <div className="overflow-x-auto">
        <table className="table table-sm">
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
            {filteredTransactions?.length > 0 &&
              filteredTransactions.map((transaction, index) => (
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
                      className={`  ${
                        transaction.status && "badge badge-sm badge-soft"
                      }    ${
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
