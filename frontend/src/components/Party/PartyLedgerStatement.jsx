import { Download, MessageSquare, Printer } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { useBusinessStore } from "../../store/businessStore";
import { DayPicker } from "react-day-picker";
import { useMemo, useState } from "react";
import { LuIndianRupee } from "react-icons/lu";
import { downloadPDF } from "../../../helpers/downloadPdf";
import CustomLoader from "../Loader";
import { handlePaymentPrint, handlePrint } from "../../../helpers/print";
import { useRef } from "react";
import { toTitleCase } from "../../../helpers/titleCaseString";

const PartyLedgerStatement = ({
  party,
  invoices,
  purchaseInvoices,
  paymentIns,
  salesReturns,
  creditNotes,
  purchaseReturns,
}) => {
  const { business } = useBusinessStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 1)),
    to: new Date(),
  });

  const printRef = useRef();

  // ALL THE LEDGER ENTRIES
  const ledgerEntries = useMemo(() => {
    if (!party) return [];

    const allEntries = [];

    // --- INVOICES ---
    Array.isArray(invoices) &&
      invoices.forEach((invoice) => {
        const invoicePartyId =
          invoice?.partyId && typeof invoice.partyId === "object"
            ? invoice.partyId._id
            : invoice?.partyId;

        if (!invoicePartyId || invoicePartyId !== party._id) return;

        allEntries.push({
          date: invoice.salesInvoiceDate,
          voucher: "Sales Invoice",
          srNo: invoice.salesInvoiceNumber,
          debit: Number(invoice.totalAmount) || 0,
          credit: 0,
          status: invoice.status,
          tdsDeductedByParty: Number(invoice?.tdsDeductedByParty) || 0,
          tdsDeductedBySelf: Number(invoice?.tdsDeductedBySelf) || 0,
        });
      });

    // purchase invoices
    Array.isArray(purchaseInvoices) &&
      purchaseInvoices.forEach((invoice) => {
        const invoicePartyId =
          invoice?.partyId && typeof invoice.partyId === "object"
            ? invoice.partyId._id
            : invoice?.partyId;

        if (!invoicePartyId || invoicePartyId !== party._id) return;

        allEntries.push({
          date: invoice?.purchaseInvoiceDate || new Date(),
          voucher: invoice?.type || "Purchase Invoice",
          srNo: invoice?.purchaseInvoiceNumber ?? "-",
          credit: Number(invoice?.totalAmount) || 0,
          debit: 0,
          tdsDeductedByParty: Number(invoice?.tdsDeductedByParty) || 0,
          tdsDeductedBySelf: Number(invoice?.tdsDeductedBySelf) || 0,
          status: invoice?.status,
        });
      });

    // --- PAYMENT INS ---
    Array.isArray(paymentIns) &&
      paymentIns.forEach((paymentIn) => {
        if (!party?._id || paymentIn?.partyId !== party._id) return;

        allEntries.push({
          date: paymentIn?.paymentDate || new Date(),
          voucher: paymentIn?.type || "Payment In",
          srNo: paymentIn?.paymentInNumber ?? "-",
          credit: Number(paymentIn?.paymentAmount) || 0,
          debit: 0,
          tdsDeductedByParty: Number(paymentIn?.tdsDeductedByParty) || 0,
          tdsDeductedBySelf: Number(paymentIn?.tdsDeductedBySelf) || 0,
          status: paymentIn?.status,
        });
      });

    // --- SALE RETURNS ---
    Array.isArray(salesReturns) &&
      salesReturns.forEach((sr) => {
        const srPartyId =
          sr?.partyId && typeof sr.partyId === "object"
            ? sr.partyId._id
            : sr?.partyId;
        if (!srPartyId || srPartyId !== party._id) return;

        allEntries.push({
          date: sr?.salesReturnDate || new Date(),
          voucher: sr?.type || "Sales Return",
          srNo: sr?.salesReturnNumber ?? "-",
          debit: 0,
          credit: Number(sr?.totalAmount) || 0,
          tdsDeductedByParty: Number(sr?.tdsDeductedByParty) || 0,
          tdsDeductedBySelf: Number(sr?.tdsDeductedBySelf) || 0,
          status: sr?.status,
        });
      });

    // PURCHASE RETURNS
    Array.isArray(purchaseReturns) &&
      purchaseReturns.forEach((sr) => {
        const srPartyId =
          sr?.partyId && typeof sr.partyId === "object"
            ? sr.partyId._id
            : sr?.partyId;
        if (!srPartyId || srPartyId !== party._id) return;

        allEntries.push({
          date: sr?.purchaseReturnDate || new Date(),
          voucher: sr?.type || "Purchase Return",
          srNo: sr?.purchaseReturnNumber ?? "-",
          debit: 0,
          credit: Number(sr?.totalAmount) || 0,
          tdsDeductedByParty: Number(sr?.tdsDeductedByParty) || 0,
          tdsDeductedBySelf: Number(sr?.tdsDeductedBySelf) || 0,
          status: sr?.status,
        });
      });

    // --- CREDIT NOTES ---
    Array.isArray(creditNotes) &&
      creditNotes.forEach((cn) => {
        const cnPartyId =
          cn?.partyId && typeof cn.partyId === "object"
            ? cn.partyId._id
            : cn?.partyId;
        if (!cnPartyId || cnPartyId !== party._id) return;

        allEntries.push({
          date: cn?.creditNoteDate || new Date(),
          voucher: cn?.type || "Credit Note",
          srNo: cn?.creditNoteNumber ?? "-",
          debit: 0,
          credit: Number(cn?.totalAmount) || 0,
          tdsDeductedByParty: Number(cn?.tdsDeductedByParty) || 0,
          tdsDeductedBySelf: Number(cn?.tdsDeductedBySelf) || 0,
          status: cn?.status,
        });
      });

    // Sort entries by date ascending
    return allEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [invoices, paymentIns, salesReturns, creditNotes, party]);

  const ledgerWithBalance = useMemo(() => {
    let runningBalance =
      party.openingBalanceStatus === "To Collect"
        ? Number(party?.openingBalance) || 0
        : -Number(party?.openingBalance) || 0;

    return ledgerEntries.map((entry) => {
      const effectiveBalance =
        entry.status === "cancelled"
          ? 0
          : runningBalance + (entry.debit - entry.credit);

      // Update running balance only if not cancelled
      if (entry.status !== "cancelled") {
        runningBalance = effectiveBalance;
      }

      return {
        ...entry,
        balance: effectiveBalance,
      };
    });
  }, [ledgerEntries, party]);

  // FILTER BY DATE
  const filteredEntries = useMemo(() => {
    if (!dateRange) return ledgerWithBalance;

    const from = new Date(dateRange.from);
    from.setHours(0, 0, 0, 0);

    const to = new Date(dateRange.to);
    to.setHours(23, 59, 59, 999);

    return ledgerWithBalance.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= from && entryDate <= to;
    });
  }, [dateRange, ledgerWithBalance]);

  // total balance
  const totalBalance = useMemo(() => {
    if (filteredEntries.length === 0) {
      return party.openingBalanceStatus === "To Collect"
        ? Number(party?.openingBalance) || 0
        : -Number(party?.openingBalance) || 0;
    }

    // find last non-cancelled entry
    const lastValidEntry = [...filteredEntries]
      .reverse()
      .find((entry) => entry.status !== "cancelled");

    // if all are cancelled → show opening balance
    if (!lastValidEntry) {
      return party.openingBalanceStatus === "To Collect"
        ? Number(party?.openingBalance) || 0
        : -Number(party?.openingBalance) || 0;
    }

    // otherwise return last valid balance
    return lastValidEntry.balance;
  }, [filteredEntries, party]);

  return (
    <section className="relative mt-5">
      <div>
        {/* DOWNLOAD */}
        <button
          onClick={() =>
            downloadPDF(
              "ledger",
              `${party?.partyName?.split(" ").join("_").concat("_ledger")}`,
              setIsDownloading
            )
          }
          className="btn btn-sm btn-dash rounded-xl"
        >
          {isDownloading ? (
            <div className="">
              <CustomLoader text={"Downloading..."} />
            </div>
          ) : (
            <>
              <Download size={15} /> Download PDF
            </>
          )}
        </button>

        {/* PRINTER */}
        <button
          onClick={() => handlePaymentPrint(printRef)}
          className="btn btn-sm ml-2 w-1/8 rounded-xl"
        >
          <Printer size={14} /> Print
        </button>

        {/* SHARE */}
        {/* <button
          className="btn btn-sm ml-2 w-1/8 rounded-xl"
          popoverTarget="popover-1"
          style={{ anchorName: "--anchor-1" }}
        >
          <Share size={14} />
          Share
          <ChevronDown size={14} className="ml-10" />
        </button> */}

        {/* CUSTOM DAY PICKER */}
        <button
          className="btn btn-sm ml-2 rounded-xl"
          onClick={() => {
            setOpenDatePicker(!openDatePicker);
            document.getElementById("day_picker").showModal();
          }}
        >
          Select Custom Date
        </button>

        <dialog id="day_picker" className="modal">
          <div className="modal-box w-fit absolute top-50 right-125 p-0 bg-none">
            <DayPicker
              selected={dateRange}
              onSelect={setDateRange}
              className="react-day-picker"
              mode="range"
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

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

      {/* LEDGER COMPONENT HERE */}
      <div
        id="ledger"
        ref={printRef}
        style={{
          height: "100%",
          border: "1px solid rgb(228, 228, 231)",
          borderRadius: "6px",
          marginTop: "16px",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontWeight: 600,
              }}
            >
              {business?.businessName}
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "#71717b",
              }}
            >
              Phone no. : {business?.companyPhoneNo}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#71717b",
              }}
            >
              Address : {business?.billingAddress}
            </p>
          </div>
          Party Ledger
        </div>
        <div className="divider" />
        <div
          style={{
            fontSize: "12px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              lineHeight: "18px",
            }}
          >
            To, <br />
            <span
              style={{
                fontWeight: 600,
              }}
            >
              {party?.partyName}
            </span>
            <br />
            <div>{party?.mobileNumber}</div>
            <div>{party?.billingAddress}</div>
          </div>

          <div
            style={{
              textAlign: "right",
              border: "2px solid rgb(228, 228, 231)",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              width: "200px",
            }}
          >
            <p
              style={{
                paddingBottom: "",
                display: "flex",
                justifyContent: "flex-end",
                gap: "4px",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                }}
              >
                {" "}
                {dateRange?.from?.toLocaleDateString()}
              </span>{" "}
              -{" "}
              <span style={{ fontWeight: 600 }}>
                {dateRange?.to?.toLocaleDateString()}
              </span>
            </p>

            <h4
              style={{
                marginTop: "12px",
                fontWeight: 600,
                borderTop: "2px solid rgb(228, 228, 231)",
                paddingTop: "8px",
              }}
            >
              {Number(Math.abs(totalBalance || 0)) > 0
                ? "Total Receivable"
                : "Total Payable"}
            </h4>

            <p
              style={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <LuIndianRupee />
              {Number(Math.abs(totalBalance || 0)).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <div
          style={{
            overflowX: "auto",
            marginTop: "20px",
            border: "1px",
            borderColor: "",
            backgroundColor: "",
          }}
        >
          <table
            style={{
              width: "100%",
              border: "1px solid rgb(228, 228, 231)",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#e4e4e7" }}>
                <th style={{ padding: "5px", textAlign: "left" }}>Date</th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  Voucher
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  Txn No
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  Credit
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  Debit
                </th>

                {/* 👇 Check if any TDS-related value exists */}
                {filteredEntries?.some(
                  (entry) =>
                    (entry?.tdsDeductedByParty &&
                      entry.tdsDeductedByParty > 0) ||
                    (entry?.tdsDeductedBySelf && entry.tdsDeductedBySelf > 0)
                ) ? (
                  <>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      TDS (By Party)
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      TDS (By Self)
                    </th>
                  </>
                ) : (
                  <>
                    {/* Empty columns for alignment */}
                    <th colSpan={2}></th>
                  </>
                )}

                <th style={{ padding: "8px", textAlign: "right" }}>Balance</th>
              </tr>
            </thead>

            <tbody>
              {/* Compute the same condition as header for consistency */}
              {(() => {
                const showTDSColumns = filteredEntries?.some(
                  (entry) =>
                    (entry?.tdsDeductedByParty &&
                      entry.tdsDeductedByParty > 0) ||
                    (entry?.tdsDeductedBySelf && entry.tdsDeductedBySelf > 0)
                );

                return (
                  <>
                    {/* OPENING BALANCE ROW */}
                    <tr>
                      <td style={{ padding: "6px" }}></td>
                      <td style={{ padding: "6px", whiteSpace: "nowrap" }}>
                        Opening Balance
                      </td>
                      <td style={{ padding: "6px" }}>-</td>
                      <td style={{ padding: "6px" }}>
                        {party?.openingBalanceStatus === "To Pay" ? (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <LuIndianRupee />
                            {Number(party?.openingBalance).toLocaleString(
                              "en-IN"
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={{ padding: "6px" }}>
                        {party?.openingBalanceStatus === "To Collect" ? (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <LuIndianRupee />
                            {Number(party?.openingBalance).toLocaleString(
                              "en-IN"
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* TDS columns - maintain alignment */}
                      {showTDSColumns ? (
                        <>
                          <td style={{ padding: "6px" }}>-</td>
                          <td style={{ padding: "6px" }}>-</td>
                        </>
                      ) : (
                        <td colSpan={2}></td>
                      )}

                      <td style={{ padding: "6px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <LuIndianRupee />
                          {Number(party?.openingBalance).toLocaleString(
                            "en-IN"
                          ) || 0.0}
                        </div>
                      </td>
                    </tr>

                    {/* LEDGER ROWS */}
                    {ledgerWithBalance &&
                      ledgerWithBalance.length > 0 &&
                      filteredEntries.map((entry, idx) => (
                        <tr key={idx}>
                          <td
                            style={{
                              padding: "6px",
                              textAlign: "left",
                              width: "100px",
                            }}
                          >
                            {entry?.date?.split("T")[0]}
                          </td>
                          <td style={{ padding: "6px" }}>
                            {toTitleCase(entry?.voucher)}{" "}
                            {entry?.status === "cancelled" && (
                              <small className="text-red-500  ml-1">
                                (Cancelled)
                              </small>
                            )}
                          </td>
                          <td style={{ padding: "6px" }}>{entry?.srNo}</td>
                          <td style={{ padding: "6px" }}>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <LuIndianRupee />
                              {Number(entry?.credit).toLocaleString("en-IN")}
                            </div>
                          </td>
                          <td style={{ padding: "6px" }}>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <LuIndianRupee />
                              {Number(entry?.debit).toLocaleString("en-IN")}
                            </div>
                          </td>

                          {showTDSColumns ? (
                            <>
                              <td style={{ padding: "6px" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <LuIndianRupee />
                                  {Number(
                                    entry?.tdsDeductedByParty || 0
                                  ).toLocaleString("en-IN")}
                                </div>
                              </td>
                              <td style={{ padding: "6px" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <LuIndianRupee />
                                  {Number(
                                    entry?.tdsDeductedBySelf || 0
                                  ).toLocaleString("en-IN")}
                                </div>
                              </td>
                            </>
                          ) : (
                            <td colSpan={2}></td>
                          )}

                          <td style={{ padding: "6px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                              }}
                            >
                              <LuIndianRupee />
                              {Number(entry?.balance).toLocaleString("en-IN")}
                            </div>
                          </td>
                        </tr>
                      ))}

                    {/* CLOSING BALANCE ROW */}
                    <tr>
                      <td style={{ padding: "6px" }}></td>
                      <td style={{ padding: "6px" }}>Closing Balance</td>
                      <td style={{ padding: "6px" }}>-</td>
                      <td style={{ padding: "6px" }}>
                        {totalBalance < 0 ? (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <LuIndianRupee />
                            {Math.abs(totalBalance).toLocaleString("en-IN")}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={{ padding: "6px" }}>
                        {totalBalance > 0 ? (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <LuIndianRupee />
                            {Math.abs(totalBalance).toLocaleString("en-IN")}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Keep columns consistent */}
                      {showTDSColumns ? (
                        <>
                          <td style={{ padding: "6px" }}>-</td>
                          <td style={{ padding: "6px" }}>-</td>
                        </>
                      ) : (
                        <td colSpan={2}></td>
                      )}

                      <td style={{ padding: "6px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <LuIndianRupee />
                          {Number(Math.abs(totalBalance || 0)).toLocaleString(
                            "en-IN"
                          )}
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PartyLedgerStatement;
