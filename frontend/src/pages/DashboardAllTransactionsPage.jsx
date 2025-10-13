import { LiaRupeeSignSolid } from "react-icons/lia";
import { useInvoiceStore } from "../store/invoicesStore";
import { dateRanges } from "../utils/constants";
import { useMemo, useState } from "react";
import not_found from "../assets/not-found.png";
import dayjs from "dayjs";

const DashboardAllTransactionsPage = () => {
  const { invoices } = useInvoiceStore();
  const [day, setDay] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // FUNCTION TO SEARCH INVOICES
  const searchedInvoices = useMemo(() => {
    if (!invoices?.invoices) return [];

    const now = dayjs();
    let startDate, endDate;

    switch (day) {
      case "Today":
        startDate = now.startOf("day");
        endDate = now.endOf("day");
        break;
      case "Yesterday":
        startDate = now.subtract(1, "day").startOf("day");
        endDate = now.subtract(1, "day").endOf("day");
        break;
      case "This Week":
        startDate = now.startOf("week");
        endDate = now.endOf("week");
        break;
      case "Last Week":
        startDate = now.subtract(1, "week").startOf("week");
        endDate = now.subtract(1, "week").endOf("week");
        break;
      case "This Month":
        startDate = now.startOf("month");
        endDate = now.endOf("month");
        break;
      case "Last Month":
        startDate = now.subtract(1, "month").startOf("month");
        endDate = now.subtract(1, "month").endOf("month");
        break;
      case "Last 365 Days":
        startDate = now.subtract(1, "year").startOf("year");
        endDate = now.subtract(1, "year").endOf("year");
        break;
      default:
        startDate = null;
        endDate = null;
        break;
    }

    const query = searchQuery?.trim()?.toLowerCase() || "";

    return invoices.invoices.filter((invoice) => {
      const invoiceDate = dayjs(invoice?.salesInvoiceDate);
      const isWithinRange =
        !startDate ||
        (!endDate
          ? true
          : invoiceDate.isBetween(startDate, endDate, null, "[]"));

      const partyName = invoice?.partyId?.partyName?.toLowerCase() || "";
      const invoiceNumber = String(invoice?.salesInvoiceNumber || "");
      const matchesSearch =
        !query ||
        partyName.includes(query) ||
        invoiceNumber === query ||
        invoiceNumber.includes(query);

      return isWithinRange && matchesSearch;
    });
  }, [invoices?.invoices, searchQuery, day]);

  return (
    <main className="h-screen bg-white overflow-y-scroll w-full p-2">
      <section className="h-full w-full rounded-lg p-3 flex flex-col">
        <h1 className="font-semibold text-lg">All Transactions</h1>

        {/* Search and filter */}
        <div className="flex items-center mt-4 gap-3">
          <input
            type="text"
            placeholder="Search by party name or transaction number"
            className="input input-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            onChange={(e) => setDay(e.target.value)}
            value={day}
            className="select select-sm"
          >
            <option value="" disabled>
              --Select Day--
            </option>
            {dateRanges.map((date, idx) => (
              <option key={idx} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {/* Scrollable table only */}
        <div className="my-5 flex-1 rounded-md ">
          {searchedInvoices.length === 0 ? (
            <div className="flex items-center justify-center flex-col">
              <img src={not_found} alt="not_found" width={250} loading="lazy" />
              <h3 className="font-semibold">No matching items found</h3>
              <p className="text-zinc-500 text-xs text-center max-w-sm">
                No items found matching “{searchQuery}”. Try a different name or
                clear your search.
              </p>
              <button
                className="btn btn-outline btn-sm mt-3"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </button>
            </div>
          ) : (
            <table className="table table-sm table-zebra w-full border border-zinc-200  ">
              <thead className="bg-[var(--primary-background)] ">
                <tr>
                  <th>Date</th>
                  <th>Transaction Number</th>
                  <th>Type</th>
                  <th>Party Name</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(searchedInvoices || invoices?.invoices || [])
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b?.salesInvoiceDate) -
                      new Date(a?.salesInvoiceDate)
                  )
                  .map((invoice, idx) => (
                    <tr key={idx}>
                      <td>{invoice?.salesInvoiceDate?.split("T")[0] || "-"}</td>
                      <td>{invoice?.salesInvoiceNumber || "-"}</td>
                      <td>{invoice?.type || "-"}</td>
                      <td>{invoice?.partyId?.partyName || "-"}</td>
                      <td className="flex items-center gap-1 justify-end">
                        <LiaRupeeSignSolid />
                        {invoice?.totalAmount
                          ? Number(invoice.totalAmount).toLocaleString("en-IN")
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
};

export default DashboardAllTransactionsPage;
