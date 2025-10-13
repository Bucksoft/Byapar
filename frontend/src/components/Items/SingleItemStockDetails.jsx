import { FaFilePdf } from "react-icons/fa6";
import { dateRanges } from "../../utils/constants";
import { useInvoiceStore } from "../../store/invoicesStore";
import { useEffect } from "react";
import { useState } from "react";

const SingleItemStockDetails = ({ item }) => {
  const { invoices } = useInvoiceStore();
  const [invoicesWithItem, setInvoicesWithItem] = useState([]);

  console.log(invoices);  

  useEffect(() => {
    if (!invoices || !Array.isArray(invoices?.invoices) || !item?.itemName)
      return;

    const filtered = invoices.invoices.filter(
      (invoice) =>
        Array.isArray(invoice.items) &&
        invoice.items.some((i) => i?.itemName === item.itemName)
    );

    setInvoicesWithItem(filtered);
  }, [item, invoices]);

  return (
    <main className="flex flex-col px-5 py-4">
      {/* Header */}
      <header className="w-full flex justify-between items-center">
        <select defaultValue="Select Date" className="select select-sm">
          <option disabled={true}>Select Date</option>
          {dateRanges.length &&
            dateRanges.map((range, index) => (
              <option key={index}>{range}</option>
            ))}
        </select>
        <button className="btn btn-sm flex items-center gap-2">
          <FaFilePdf size={15} />
          Download PDF
        </button>
      </header>

      {/* Table container (scrollable area) */}
      <div className="flex-1 overflow-y-auto sticky overflow-x-auto mt-4 rounded-md border border-zinc-200">
        <table className="table table-zebra w-full ">
          <thead className="bg-zinc-100 sticky top-0">
            <tr>
              <th>Date</th>
              <th>Transaction Type</th>
              <th>Quantity</th>
              <th>Invoice Number</th>
              <th>Closing Stock</th>
            </tr>
          </thead>
          <tbody>
            {invoicesWithItem?.length ? (
              invoicesWithItem.map((invoice, idx) => (
                <tr key={idx}>
                  <td>
                    {(invoice?.salesInvoiceDate &&
                      invoice?.salesInvoiceDate.split("T")[0]) ||
                      "-"}
                  </td>
                  <td>{invoice?.type || "-"}</td>
                  <td>-</td>
                  <td>{invoice?.salesInvoiceNumber || "-"}</td>
                  <td>-</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-zinc-400">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default SingleItemStockDetails;
