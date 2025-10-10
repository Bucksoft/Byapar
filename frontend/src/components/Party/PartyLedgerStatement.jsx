import {
  ChevronDown,
  Download,
  MessageSquare,
  Printer,
  Share,
} from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { useBusinessStore } from "../../store/businessStore";
import { DayPicker } from "react-day-picker";
import { useEffect, useMemo, useState } from "react";
import { useSalesReturnStore } from "../../store/salesReturnStore";
import { usePaymentInStore } from "../../store/paymentInStore";
import { useInvoiceStore } from "../../store/invoicesStore";
import { useCreditNoteStore } from "../../store/creditNoteStore";
import { LuIndianRupee } from "react-icons/lu";

const PartyLedgerStatement = ({ party }) => {
  const { business } = useBusinessStore();

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  });

  // GET ALL THE INVOICES HERE
  const { salesReturn } = useSalesReturnStore();
  const { paymentIns } = usePaymentInStore();
  const { invoices } = useInvoiceStore();
  const { creditNotes } = useCreditNoteStore();

  const ledgerEntries = useMemo(() => {
    const allEntries = [];

    // PUSH THE INVOICES
    invoices?.invoices.forEach((invoice) => {
      allEntries.push({
        date: invoice?.salesInvoiceDate || "-",
        voucher: invoice?.type || "Sales Invoice",
        srNo: invoice?.salesInvoiceNumber || "-",
        credit: 0,
        debit: invoice?.totalAmount || "-",
        tdsDeductedByParty: invoice?.tdsDeductedByParty || 0,
        tdsDeductedBySelf: invoice?.tdsDeductedBySelf || 0,
      });
    });

    // PUSH THE PAYMENT INS
    paymentIns?.forEach((paymentIn) => {
      allEntries.push({
        date: paymentIn?.paymentDate || "-",
        voucher: paymentIn?.type || "Payment In",
        srNo: paymentIn?.paymentInNumber || "-",
        credit: paymentIn?.paymentAmount || "-",
        debit: 0,
        tdsDeductedByParty: paymentIn?.tdsDeductedByParty || 0,
        tdsDeductedBySelf: paymentIn?.tdsDeductedBySelf || 0,
      });
    });

    // PUSH THE SALES RETURNS
    salesReturn?.forEach((sr) => {
      allEntries.push({
        date: sr.date || "-",
        voucher: sr.type || "Sales Return",
        srNo: sr.returnNumber || "-",
        debit: 0,
        credit: Number(sr.totalAmount) || "-",
        tdsDeductedByParty: sr?.tdsDeductedByParty || 0,
        tdsDeductedBySelf: sr?.tdsDeductedBySelf || 0,
      });
    });

    // PUSH THE CREDIT NOTES
    creditNotes?.forEach((cn) => {
      allEntries.push({
        date: cn.creditNoteDate,
        voucher: cn.type || "Credit Note",
        srNo: cn.creditNoteNumber || "-",
        debit: 0,
        credit: Number(cn?.totalAmount),
        tdsDeductedByParty: cn?.tdsDeductedByParty || 0,
        tdsDeductedBySelf: cn?.tdsDeductedBySelf || 0,
      });
    });
    return allEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [invoices, paymentIns, salesReturn, creditNotes]);

  // CALCULATING LEDGER'S BALANCE
  const ledgerWithBalance = useMemo(() => {
    let runningBalance =
      party.openingBalanceStatus === "To Collect"
        ? party?.openingBalance
        : -party?.openingBalance;
    return ledgerEntries.map((entry) => {
      runningBalance += entry.debit - entry.credit;
      return { ...entry, balance: runningBalance };
    });
  }, [ledgerEntries]);

  // CALCULATING THE TOTAL BALANCE AT THE END OF THE DAY
  const totalBalance = useMemo(() => {
    if (!ledgerWithBalance.length) return party?.openingBalance || 0;

    const lastEntryBalance =
      ledgerWithBalance[ledgerWithBalance.length - 1].balance;

    return (
      (party?.openingBalanceStatus === "To Collect" ? 1 : -1) *
        (party?.openingBalance || 0) +
      lastEntryBalance
    );
  }, [ledgerWithBalance, party]);

  // FILTERING THE ENTRIES
  const filteredEntries = useMemo(() => {
    return ledgerWithBalance.filter(
      (entry) =>
        new Date(entry.date) >= new Date(dateRange.from) &&
        new Date(entry.date) <= new Date(dateRange.to)
    );
  }, [dateRange, ledgerWithBalance]);

  return (
    <section className="relative mt-5">
      <div>
        {/* DOWNLOAD */}
        <button className="btn btn-sm w-1/8 ">
          <Download size={14} /> Download
        </button>

        {/* PRINTER */}
        <button className="btn btn-sm ml-2 w-1/8">
          <Printer size={14} /> Print
        </button>

        {/* SHARE */}
        <button
          className="btn btn-sm ml-2 w-1/8"
          popoverTarget="popover-1"
          style={{ anchorName: "--anchor-1" }}
        >
          <Share size={14} />
          Share
          <ChevronDown size={14} className="ml-10" />
        </button>

        {/* CUSTOM DAY PICKER */}
        <button
          className="btn btn-sm ml-2"
          onClick={() => setOpenDatePicker(!openDatePicker)}
        >
          Select Custom Date
        </button>

        {openDatePicker && (
          <div
            className="absolute top-12 left-0 z-[9999] bg-white shadow-lg rounded-md "
            style={{
              position: "absolute",
              top: "60px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <DayPicker
              selected={dateRange}
              onSelect={setDateRange}
              className="react-day-picker"
              mode="range"
            />
          </div>
        )}

        <ul
          className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
          popover="auto"
          id="popover-1"
          style={{ positionAnchor: "--anchor-1" }}
        >
          <li>
            <a>
              <MessageSquare size={13} /> Send SMS
            </a>
          </li>
          <li>
            <a>
              <BsWhatsapp size={13} /> Whatsapp
            </a>
          </li>
        </ul>
      </div>

      <div className="h-full border rounded-md mt-4 border-zinc-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold">{business?.businessName}</h1>
            <p className="text-xs text-zinc-500">
              Phone no. {business?.companyPhoneNo}
            </p>
          </div>
          Party Ledger
        </div>
        <div className="divider" />
        <div className="text-xs flex items-start justify-between">
          <div className="leading-4.5">
            To, <br />
            <span className="font-semibold">{party?.partyName}</span> <br />
            {party?.mobileNumber}
          </div>
          <div className="text-right border-2 border-zinc-200 p-2 flex flex-col">
            <p className="pb-2 border-b-2 border-zinc-200">
              {dateRange?.from?.toLocaleDateString()} -{" "}
              {dateRange?.to?.toLocaleDateString()}
            </p>
            <h4 className="mt-3 ">Total Receivable</h4>
            <p className="font-semibold flex items-center justify-end gap-1">
              <LuIndianRupee />
              {ledgerWithBalance?.length
                ? ledgerWithBalance[
                    ledgerWithBalance.length - 1
                  ].balance.toLocaleString("en-IN")
                : 0}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto mt-5 border border-base-content/5 bg-base-100">
          <table className="table text-xs table-zebra">
            <thead>
              <tr className="bg-zinc-200">
                <th>Date</th>
                <th>Voucher</th>
                <th>Sr No</th>
                <th>Credit</th>
                <th>Debit</th>
                <th>TDS deducted by party</th>
                <th>TDS deducted by self</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {/* THIS FIRST ROW IS FOR OPENING BALANCE */}
              <tr>
                <td></td>
                <td>Opening Balance</td>
                <td>-</td>
                <td>
                  {party?.openingBalanceStatus === "To Pay" ? (
                    <div className="flex items-center ">
                      <LuIndianRupee />
                      {Number(party?.openingBalance).toLocaleString("en-IN")}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {party?.openingBalanceStatus === "To Collect" ? (
                    <div className="flex items-center ">
                      <LuIndianRupee />
                      {Number(party?.openingBalance).toLocaleString("en-IN")}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td>-</td>
                <td>-</td>
                <td>
                  <div className="flex items-center">
                    <LuIndianRupee />
                    {Number(party?.openingBalance).toLocaleString("en-IN") ||
                      0.0}
                  </div>
                </td>
              </tr>

              {/* THIS IS FOR LEDGER */}
              {ledgerWithBalance &&
                ledgerWithBalance.length > 0 &&
                ledgerWithBalance.map((entry) => (
                  <tr>
                    <td>{entry?.date?.split("T")[0]}</td>
                    <td>{entry?.voucher}</td>
                    <td>{entry?.srNo}</td>
                    <td>
                      <div className="flex items-center">
                        <LuIndianRupee />
                        {Number(entry?.credit).toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <LuIndianRupee />
                        {Number(entry?.debit).toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <LuIndianRupee />
                        {Number(entry?.tdsDeductedByParty).toLocaleString(
                          "en-IN"
                        ) || 0}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <LuIndianRupee />
                        {Number(entry?.tdsDeductedBySelf).toLocaleString(
                          "en-IN"
                        ) || 0}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <LuIndianRupee />
                        {Number(entry?.balance).toLocaleString("en-IN")}
                      </div>
                    </td>
                  </tr>
                ))}

              {/* THIS IS FOR CLOSING BALANCE */}
              <tr>
                <td></td>
                <td>Closing Balance</td>
                <td>-</td>
                <td>
                  {totalBalance < 0 ? (
                    <div className="flex items-center">
                      <LuIndianRupee />
                      {Math.abs(totalBalance).toLocaleString("en-IN")}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {totalBalance > 0 ? (
                    <div className="flex items-center ">
                      <LuIndianRupee />
                      {Math.abs(totalBalance).toLocaleString("en-IN")}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td>-</td>
                <td>-</td>
                <td>
                  <div className="flex items-center gap-1">
                    <LuIndianRupee />
                    {Number(Math.abs(totalBalance || 0)).toLocaleString(
                      "en-IN"
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PartyLedgerStatement;
