import { LiaRupeeSignSolid } from "react-icons/lia";
import { useInvoiceStore } from "../store/invoicesStore";
import { dateRanges } from "../utils/constants";
import { useState } from "react";

const DashboardAllTransactionsPage = () => {
  const { invoices } = useInvoiceStore();
  const [searchQuery, setSearchQuery] = useState("");

  const searchedInvoices =
    invoices && searchQuery
      ? invoices.filter(
          (invoice) =>
            invoice?.partyId?.partyName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            invoice?.salesInvoiceNumber === Number(searchQuery)
        )
      : invoices;

  return (
    <main className="h-full w-full p-2">
      <section className="bg-white h-full w-full rounded-lg p-3">
        <h1 className="font-semibold text-lg">All Transactions</h1>
        <div className="flex items-center mt-10 gap-3 ">
          <input
            type="text"
            placeholder="Search"
            className="input input-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select defaultValue="Today" className=" select select-sm">
            {dateRanges.map((date) => (
              <option>{date}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="table mt-5 table-sm">
            {/* head */}
            <thead>
              <tr className="bg-[var(--primary-background)]">
                <th>Date</th>
                <th>Transaction Number</th>
                <th>Type</th>
                <th>Party Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(searchedInvoices || invoices)?.map((invoice) => (
                <tr>
                  <td>{invoice?.salesInvoiceDate.split("T")[0] || "-"}</td>
                  <td>{invoice?.salesInvoiceNumber || "-"}</td>
                  <td>{invoice?.type || "-"}</td>
                  <td>{invoice?.partyId?.partyName || "-"}</td>
                  <td className="flex items-center">
                    <LiaRupeeSignSolid />
                    {Number(invoice?.totalAmount).toLocaleString("en-IN") ||
                      "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default DashboardAllTransactionsPage;
