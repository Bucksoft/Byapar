import React from "react";
import { GrDocumentExcel } from "react-icons/gr";
import { LiaRupeeSignSolid } from "react-icons/lia";

const PartyTransactions = ({ party, partyInvoices }) => {
  console.log(partyInvoices);
  return (
    <section>
      <div className="overflow-x-auto">
        <table className="table">
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
            {partyInvoices?.length > 0 &&
              partyInvoices.map((partyInvoice, index) => (
                <tr key={partyInvoice?._id}>
                  <td>{index + 1}</td>
                  <td>{partyInvoice?.salesInvoiceDate.split("T")[0] || "-"}</td>
                  <td>{partyInvoice?.type || "-"}</td>
                  <td>{partyInvoice?.salesInvoiceNumber || "-"}</td>
                  <td>
                    <div className="flex items-center">
                      <LiaRupeeSignSolid />
                      {Number(partyInvoice?.totalAmount).toLocaleString(
                        "en-IN"
                      ) || "-"}
                    </div>
                  </td>
                  <td>
                    <div
                      className={`badge badge-sm  ${
                        partyInvoice?.status === "unpaid"
                          ? "badge-error"
                          : "badge-success"
                      }`}
                    >
                      {partyInvoice?.status}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex items-center justify-center w-full py-16 flex-col text-zinc-500 gap-2">
          <GrDocumentExcel size={25} />
          No transactions yet
        </div>
      </div>
    </section>
  );
};

export default PartyTransactions;
