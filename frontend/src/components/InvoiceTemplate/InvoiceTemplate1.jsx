import { useEffect, useRef, useState } from "react";
import { useBusinessStore } from "../../store/businessStore";
import { useQueries, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import { useAuthStore } from "../../store/authStore";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { toWords } from "../../../helpers/wordsToCurrency";
import { LuIndianRupee } from "react-icons/lu";

const InvoiceTemplate1 = ({
  color,
  textColor,
  checkBoxSetting,
  invoice,
  type,
  printRef,
  setInvoiceIdToDownload,
}) => {
  const themeColor = color || "#E7000B"; // main theme color
  const headerTextColor = textColor || "#fff"; // text color for header areas
  const fontColor = "#000"; // main body text color
  const { business } = useBusinessStore();
  const { user } = useAuthStore();
  const invoiceIdToDownload = useRef();
  const [bankAccount, setBankAccount] = useState(null);

  const { isLoading, data: bankAccounts } = useQuery({
    queryKey: ["businessBankAccounts"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/bank-account/${business?._id}`);
      const activeAccount = res.data?.find((acc) => acc.isActive);
      return activeAccount;
    },
  });

  const { data: supplierBankAccount } = useQuery({
    queryKey: ["bankAccounts", business?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/bank-account/party/${invoice?.partyId?._id}`
      );
      return res.data;
    },
    enabled: type === "Purchase Invoice",
  });

  useEffect(() => {
    if (type === "Sales Invoice" && bankAccounts) {
      setBankAccount(bankAccounts);
    } else if (type === "Purchase Invoice" && supplierBankAccount) {
      setBankAccount(supplierBankAccount);
    } else {
      setBankAccount(null);
    }
  }, [type, bankAccounts, supplierBankAccount]);

  useEffect(() => {
    if (invoiceIdToDownload?.current?.id) {
      // setInvoiceIdToDownload(invoiceIdToDownload?.current?.id);
    }
  }, [invoiceIdToDownload]);

  const parseAmount = (val) => {
    if (!val) return 0;
    return parseFloat(val.toString().replace(/,/g, ""));
  };

  const getGSTPercentage = (rateString) => {
    const match = rateString?.match(/(\d+)%/);
    return match ? parseFloat(match[1]) : rateString;
  };

  const items = invoice?.items || [];

  // Check if any item has a discount
  const hasDiscount = items?.some(
    (item) => item?.discountAmount && Number(item?.discountAmount) > 0
  );

  // Check if any item has HSN/SAC
  const hasHSNSAC = items?.some(
    (item) => item?.HSNCode?.length > 0 || item?.SACCode?.length > 0
  );

  // Calculate totals
  const subtotalQuantity = items.reduce(
    (acc, item) => acc + (Number(item?.quantity) || 0),
    0
  );

  const subtotalTaxable = items.reduce((acc, item) => {
    const price = Number(item?.basePrice || item?.salesPrice) || 0;
    const quantity = Number(item?.quantity) || 0;
    return acc + price * quantity;
  }, 0);

  const subtotalTax = items.reduce((acc, item) => {
    const tax =
      Number(item?.gstAmount) ||
      (Number(item?.salesPrice) * Number(item?.gstTaxRate || 0)) / 100 ||
      0;
    return acc + tax;
  }, 0);

  const subtotalDiscount = hasDiscount
    ? items.reduce((acc, item) => acc + (Number(item?.discountAmount) || 0), 0)
    : 0;

  const subtotalTotal = items.reduce((acc, item) => {
    const total =
      Number(item?.totalAmount) ||
      (Number(item?.salesPrice) || Number(item?.basePrice) || 0) *
        (Number(item?.quantity) || 0) *
        (1 + (Number(item?.gstTaxRate) || 0) / 100) -
        (Number(item?.discountAmount) || 0);

    return acc + (isNaN(total) ? 0 : total);
  }, 0);

  const currentInvoiceTheme = JSON.parse(localStorage.getItem("invoiceTheme"));
  const { data: theme } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/invoiceTheme/settings/${currentInvoiceTheme}`
      );
      return res.data;
    },
  });

  return (
    <main
      style={{
        padding: "24px",
        width: "800px",
        minHeight: "100vh",
        backgroundColor: "#fff",
        color: fontColor,
        fontSize: "14px",
        overflowX: "hidden",
      }}
      ref={printRef}
      class="print-invoice"
    >
      {/* Header */}
      <div
        ref={invoiceIdToDownload}
        id="invoice"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fecaca",
            overflow: "hidden",
          }}
        >
          <img
            src={business?.logo || ""}
            alt="Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        <h1
          style={{
            textTransform: "uppercase",
            fontSize: "18px",
            textAlign: "right",
          }}
        >
          {type === "Sales Return"
            ? "Sales Return"
            : type === "Sales Invoice"
            ? "Tax Invoice"
            : type === "Quotation"
            ? "Quotation"
            : type === "Delivery Challan"
            ? "Delivery Challan"
            : type === "Proforma Invoice"
            ? "Proforma Invoice"
            : type === "Purchase Invoice"
            ? "Purchase Invoice"
            : type === "Credit Note"
            ? "Credit Note"
            : type === "Purchase Order"
            ? "Purchase Order"
            : type === "Debit Note"
            ? "Debit Note"
            : type === "Purchase Return"
            ? "Purchase Return "
            : ""}
        </h1>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "60%" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700" }}>
            {business?.businessName}
          </h1>
          {/* <div style={{ textAlign: "right" }}>
          {
            <p style={{ fontWeight: "700" }}>
              {theme?.options.find((t) => t.name === "showPhone")?.checked && (
                <span>
                  Mobile :{" "}
                  {business?.companyPhoneNo
                    ? business?.companyPhoneNo
                    : "478569321"}
                </span>
              )}
            </p>
          }
        </div> */}
          <p>{business?.billingAddress}</p>
          <p>
            {business?.gstNumber.length > 0 && (
              <p
                style={{
                  display: "flex",
                  fontSize: "0.875rem",
                  color: "#52525b",
                }}
              >
                <span
                  style={{
                    marginRight: "0.5rem",
                  }}
                >
                  GSTIN :
                </span>
                {business?.gstNumber}
              </p>
            )}
          </p>
          <div>
            {business?.companyEmail.length > 0 && (
              <p
                style={{
                  display: "flex",
                  fontSize: "0.875rem",
                  color: "#52525b",
                }}
              >
                <span
                  style={{
                    marginRight: "0.5rem",
                  }}
                >
                  Email :
                </span>
                {business?.companyEmail}
              </p>
            )}
          </div>
        </div>

        {/* PO, E-Way, Vehicle Number */}
        <div>
          {checkBoxSetting?.poNumber && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: "600" }}>
                <p>PO Number:</p>
              </div>
              <div>
                <p>PO12345</p>
              </div>
            </div>
          )}
          {checkBoxSetting?.eWayBillNo && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: "600" }}>
                <p>E-Way Bill No.</p>
              </div>
              <div>
                <p>12345</p>
              </div>
            </div>
          )}
          {checkBoxSetting?.vechileNumber && (
            <div
              style={{
                display: "flex",
                gap: "50px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontWeight: "600" }}>
                <p>Vechile No.</p>
              </div>
              <div>
                <p>jh02AM 0472</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Info */}
      <div
        style={{
          backgroundColor: themeColor,
          color: headerTextColor,
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          fontWeight: "600",
          // borderRadius: "4px 4px 0 0",
          marginTop: "20px",
        }}
      >
        {/* number */}
        <p style={{}}>
          {type === "Sales Return"
            ? "Sales Return No. : "
            : type === "Sales Invoice"
            ? "Sales Invoice No. : "
            : type === "Quotation"
            ? "Quotation No. : "
            : type === "Delivery Challan"
            ? "Delivery Challan No. : "
            : type === "Proforma Invoice"
            ? "Proforma Invoice No. : "
            : type === "Purchase Invoice"
            ? "Purchase Invoice No. : "
            : type === "Credit Note"
            ? "Credit Note No. : "
            : type === "Purchase Order"
            ? "Purchase Order No. : "
            : type === "Debit Note"
            ? "Debit Note No. : "
            : "Invoice No. : "}

          <span>
            {type === "Sales Return"
              ? invoice?.salesReturnNumber
              : type === "Sales Invoice"
              ? invoice?.salesInvoiceNumber
              : type === "Quotation"
              ? invoice?.quotationNumber
              : type === "Delivery Challan"
              ? invoice?.deliveryChallanNumber
              : type === "Proforma Invoice"
              ? invoice?.proformaInvoiceNumber
              : type === "Purchase Invoice"
              ? invoice?.purchaseInvoiceNumber
              : type === "Credit Note"
              ? invoice?.creditNoteNumber
              : type === "Purchase Order"
              ? invoice?.purchaseOrderNumber
              : type === "Debit Note"
              ? invoice?.debitNoteNumber
              : "452"}
          </span>
        </p>
        <p style={{ fontWeight: "600" }}>
          {type === "Sales Return"
            ? "Sales Return Date : "
            : type === "Sales Invoice"
            ? "Sales Invoice Date : "
            : type === "Quotation"
            ? "Quotation Date : "
            : type === "Delivery Challan"
            ? "Delivery Challan Date : "
            : type === "Proforma Invoice"
            ? "Proforma Invoice Date : "
            : type === "Purchase Invoice"
            ? "Purchase Invoice Date : "
            : type === "Credit Note"
            ? "Credit Note Date : "
            : type === "Purchase Order"
            ? "Purchase Order Date : "
            : type === "Debit Note"
            ? "Debit Note Date : "
            : "Invoice Date : "}

          <span>
            {type === "Sales Return"
              ? invoice?.salesReturnDate?.split("T")[0]
              : type === "Sales Invoice"
              ? invoice?.salesInvoiceDate?.split("T")[0]
              : type === "Quotation"
              ? invoice?.quotationDate?.split("T")[0]
              : type === "Delivery Challan"
              ? invoice?.deliveryChallanDate?.split("T")[0]
              : type === "Proforma Invoice"
              ? invoice?.proformaInvoiceDate?.split("T")[0]
              : type === "Purchase Invoice"
              ? invoice?.purchaseInvoiceDate?.split("T")[0]
              : type === "Credit Note"
              ? invoice?.creditNoteDate?.split("T")[0]
              : type === "Purchase Order"
              ? invoice?.purchaseOrderDate?.split("T")[0]
              : type === "Debit Note"
              ? invoice?.debitNoteDate?.split("T")[0]
              : "2025-05-14"}
          </span>
        </p>
        <p style={{ fontWeight: "600" }}>
          {type === "Quotation" ||
          type === "Proforma Invoice" ||
          type === "Purchase Order"
            ? "Expiry Date"
            : type === "Credit Note"
            ? ""
            : type === "Debit Note"
            ? ""
            : "Due Date : "}

          <span>
            {type === "Sales Return"
              ? invoice?.dueDate?.split("T")[0]
              : type === "Sales Invoice"
              ? invoice?.dueDate?.split("T")[0]
              : type === "Quotation"
              ? invoice?.validityDate?.split("T")[0]
              : type === "Delivery Challan"
              ? invoice?.dueDate?.split("T")[0]
              : type === "Proforma Invoice"
              ? invoice?.dueDate?.split("T")[0]
              : type === "Purchase Invoice"
              ? invoice?.dueDate?.split("T")[0]
              : type === "Purchase Order"
              ? invoice?.validityDate?.split("T")[0]
              : "2025-05-14"}
          </span>
        </p>
      </div>

      {/* Bill To & Ship To */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          border: `1px solid ${themeColor}`,
          borderTop: "none",
          padding: "16px",
          fontSize: "13px",
        }}
      >
        <section style={{ fontSize: "13px", width: "100%" }}>
          <h3 style={{ fontWeight: "bold" }}>
            {type === "Credit Note"
              ? "PARTY NAME"
              : type === "Purchase Order"
              ? "BILL FROM"
              : ""}
          </h3>
          <div>
            {theme?.options.find((t) => t.name === "billTo")?.name && (
              <div>
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                  BILL TO
                </span>
                <div>
                  {invoice?.partyId?.partyName ? (
                    <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                      {" "}
                      {invoice?.partyId?.partyName}{" "}
                    </span>
                  ) : (
                    <div style={{}}>
                      <p style={{ fontWeight: "600", margin: "0" }}>
                        Sample Party
                      </p>
                      <p style={{ margin: "0" }}>
                        No F2, Outer Circle, Connaught Circus, New Delhi, DELHI
                        110001
                      </p>
                      <p style={{ margin: "0" }}>
                        <b>Mobile:</b> 7400417400
                      </p>
                      <p style={{ margin: "0" }}>
                        <b>GSTIN:</b> 07ABCCH2702H4ZZ
                      </p>
                    </div>
                  )}
                </div>

                <p style={{ fontSize: "14px" }}>
                  {type === "Purchase Order"
                    ? invoice?.partyId?.shippingAddress
                    : invoice?.partyId?.billingAddress}
                </p>

                {invoice?.partyId?.mobileNumber.length > 0 && (
                  <p style={{ fontWeight: 600 }}>
                    Mobile :{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {invoice?.partyId?.mobileNumber}
                    </span>
                  </p>
                )}
                {invoice?.partyId?.GSTIN.length > 0 && (
                  <p style={{ fontWeight: 600 }}>
                    GSTIN :{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {invoice?.partyId?.GSTIN}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section style={{ fontSize: "14px", width: "100%" }}>
          {theme?.options.find((t) => t.name === "shipTo")?.name && (
            <div>
              <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                SHIP TO
              </span>
              <div>
                {invoice?.partyId?.shippingAddress ? (
                  <span style={{ fontWeight: "", fontSize: "14px" }}>
                    {" "}
                    {invoice?.partyId?.shippingAddress}
                  </span>
                ) : (
                  <div style={{ padding: "", borderLeft: "3px" }}>
                    <p>1234123 324324234, Bengaluru</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Items Table */}
      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
          border: `1px solid ${themeColor}`,
          fontSize: "13px",
        }}
      >
        <thead
          style={{
            backgroundColor: themeColor,
            color: headerTextColor,
            width: "100%",
          }}
        >
          <tr>
            <th style={{ padding: "8px", fontWeight: "600" }}>No</th>
            <th
              style={{ padding: "8px", fontWeight: "600", textAlign: "center" }}
            >
              Items
            </th>
            <th style={{ padding: "8px", fontWeight: "600" }}>HSN No.</th>

            <th style={{ padding: "8px", fontWeight: "600" }}>Qty.</th>

            <th style={{ padding: "8px", fontWeight: "600" }}>Rate</th>

            <th style={{ padding: "8px", fontWeight: "600" }}>Tax</th>

            {hasDiscount && (
              <th style={{ padding: "8px", fontWeight: "600" }}>Discount</th>
            )}

            <th style={{ padding: "8px", fontWeight: "600" }}>Total</th>
          </tr>
        </thead>

        <tbody style={{ textAlign: "center" }}>
          {Array.isArray(items) && items.length > 0 ? (
            <>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "8px", textAlign: "center" }}>
                    {typeof index === "number" ? index + 1 : 1}
                  </td>

                  <td style={{ padding: "8px" }}>
                    <span>{item?.itemName ?? "-"}</span>
                    <p className="text-xs text-zinc-500">
                      {item?.description || ""}
                    </p>
                  </td>

                  <td style={{ padding: "8px" }}>
                    {item?.HSNCode || item?.SACCode || "-"}
                  </td>

                  <td style={{ padding: "8px" }}>{item?.quantity || 0}</td>

                  {/* Rate */}
                  <td style={{ padding: "8px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LuIndianRupee />
                      {Number(
                        item?.basePrice || item?.salesPrice || 0
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </td>

                  {/* Tax */}
                  <td style={{ padding: "6px" }}>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LuIndianRupee />
                        {Number(
                          item?.gstAmount ||
                            (item?.salesPrice * (item?.gstTaxRate || 0)) / 100
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      {item?.gstTaxRate && (
                        <div style={{ marginLeft: "4px", color: "#52525c" }}>
                          ({getGSTPercentage(item?.gstTaxRate)}%)
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Discount (conditionally) */}
                  {hasDiscount && (
                    <td style={{ padding: "6px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LuIndianRupee />
                        {Number(item?.discountAmount || 0).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </div>
                    </td>
                  )}

                  {/* Total */}
                  <td style={{ padding: "8px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LuIndianRupee />
                      {Number(
                        item?.totalAmount ??
                          (Number(item?.salesPrice) || 0) *
                            (Number(item?.quantity) || 0) *
                            (1 + (Number(item?.gstTaxRate) || 0) / 100) -
                            (Number(item?.discountAmount) || 0)
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                </tr>
              ))}

              {/* Subtotal Row (placed outside the map) */}
              <tr style={{ backgroundColor: "#e1e1e3", fontWeight: 600 }}>
                <td style={{ padding: "6px" }}>Subtotal</td>
                <td></td>
                <td></td>
                <td style={{ padding: "6px" }}>{subtotalQuantity}</td>
                {/* Taxable */}
                <td style={{ padding: "6px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LiaRupeeSignSolid />
                    {subtotalTaxable.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </td>

                {/* Tax */}
                <td style={{ padding: "6px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LiaRupeeSignSolid />
                    {subtotalTax.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </td>
                {/* Discount */}
                {hasDiscount ? (
                  <td style={{ padding: "6px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LiaRupeeSignSolid />
                      {subtotalDiscount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                ) : (
                  <td></td>
                )}

                {/* Total */}
                <td style={{ padding: "6px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LiaRupeeSignSolid />
                    {subtotalTotal.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </td>
              </tr>
            </>
          ) : (
            // 👇 fallback dummy row if no items
            <>
              <tr>
                <td style={{ padding: "8px", textAlign: "center" }}>1</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  Samsung A30
                </td>
                <td style={{ padding: "6px" }}>SEC425</td>
                <td style={{ padding: "6px" }}>2</td>
                <td style={{ padding: "6px" }}>20000</td>
                <td style={{ padding: "6px" }}>200</td>
                <td style={{ padding: "6px" }}>40200</td>
              </tr>
              {/* Subtotal */}
              <tr style={{ backgroundColor: "#e1e1e3", fontWeight: 600 }}>
                <td style={{ padding: "6px" }}>Subtotal</td>
                <td></td>
                <td></td>
                <td style={{ padding: "6px" }}>2</td>
                <td></td>

                {/* Tax */}
                <td style={{ padding: "6px" }}>200</td>
                {/* Total */}
                <td style={{ padding: "6px" }}>40200</td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <hr style={{ margin: "10px 0", borderColor: "#d4d4d8" }} />
      <section
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "space-between",
          fontSize: "14px",
          gap: "20px",
        }}
      >
        <div style={{ width: "50%" }}>
          {bankAccount ? (
            <div key={bankAccount?._id} style={{ marginTop: "12px" }}>
              <div>
                <h4 style={{ fontWeight: 600 }}>Bank Details</h4>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ color: "#52525c" }}>Account holder's name</h3>
                  <p style={{ whiteSpace: "pre-line" }}>
                    {bankAccount?.accountHoldersName || "N/A"}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ color: "#52525c" }}>Bank account number</h3>
                  <p style={{ whiteSpace: "pre-line" }}>
                    {bankAccount?.bankAccountNumber || "N/A"}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ color: "#52525c" }}>IFSC Code</h3>
                  <p style={{ whiteSpace: "pre-line" }}>
                    {bankAccount?.IFSCCode || "N/A"}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ color: "#52525c" }}>UPI Id</h3>
                  <p style={{ whiteSpace: "pre-line" }}>
                    {bankAccount?.upiId || "N/A"}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <h3 style={{ color: "#52525c" }}>Bank and Branch</h3>
                  <p style={{ whiteSpace: "pre-line", textAlign: "right" }}>
                    {bankAccount?.bankAndBranchName || "N/A"}
                  </p>
                </div>

                {/* Optional extra info */}
                {bankAccount?.ifscCode && (
                  <p style={{ whiteSpace: "pre-line" }}>
                    {bankAccount?.ifscCode}
                  </p>
                )}
                {bankAccount?.bankName && (
                  <p style={{ whiteSpace: "pre-line" }}>
                    {bankAccount?.bankName}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: "30px" }}>
              <h4 style={{ fontWeight: 600 }}>Bank Details</h4>
              <p style={{ fontWeight: "550" }}>
                Account Holder Name:{" "}
                <span style={{ fontWeight: "400" }}>
                  SHIVSHAKTI ENTERPRISES
                </span>
              </p>
              <p style={{ fontWeight: "550" }}>
                Bank Name: <span style={{ fontWeight: "400" }}>SBI</span>
              </p>
              <p style={{ fontWeight: "550" }}>
                Account Number:{" "}
                <span style={{ fontWeight: "400" }}>41452481808</span>
              </p>
              <p style={{ fontWeight: "550" }}>
                Branch Name:{" "}
                <span style={{ fontWeight: "400" }}>MOHRABADI</span>
              </p>
              <p style={{ fontWeight: "550" }}>
                IFSC Code:{" "}
                <span style={{ fontWeight: "400" }}>SBIN0016002</span>
              </p>
            </div>
          )}
        </div>

        {/* FOOTER RIGHT SECTION (TOTAL'S) */}
        <div style={{ marginTop: "12px", width: "50%" }}>
          {/* TAXABLE AMOUNT */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Taxable Amount</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <LiaRupeeSignSolid />
              {(subtotalTaxable ?? 40000).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          {/* CGST */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>CGST</p>
            <span style={{ display: "flex", alignItems: "center" }}>
              <LiaRupeeSignSolid />
              {typeof invoice?.cgst === "number" && !isNaN(invoice?.sgst)
                ? invoice.sgst.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : (
                    invoice?.items?.reduce((acc, item) => {
                      const gstRate = Number(item?.gstTaxRate) || 0;
                      const gstAmount =
                        Number(item?.gstAmount) ||
                        (Number(item?.salesPrice) * gstRate) / 100 ||
                        0;
                      return acc + gstAmount / 2;
                    }, 0) || 0
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </span>
          </div>

          {/* SGST */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>SGST</p>
            <span style={{ display: "flex", alignItems: "center" }}>
              <LiaRupeeSignSolid />
              {typeof invoice?.sgst === "number" && !isNaN(invoice?.sgst)
                ? invoice.sgst.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : (
                    invoice?.items?.reduce((acc, item) => {
                      const gstRate = Number(item?.gstTaxRate) || 0;
                      const gstAmount =
                        Number(item?.gstAmount) ||
                        (Number(item?.salesPrice) * gstRate) / 100 ||
                        0;
                      return acc + gstAmount / 2;
                    }, 0) || 0
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </span>
          </div>

          {/* ADDITIONAL CHARGE */}
          {(invoice?.additionalChargeAmount ?? 200) > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>{invoice?.additionalChargeReason || "Transport Charges"}</p>
              <span style={{ display: "flex", alignItems: "center" }}>
                <LiaRupeeSignSolid />
                {invoice?.additionalChargeAmount ?? 200}
              </span>
            </div>
          )}

          {/* DISCOUNT PERCENTAGE */}
          {invoice?.additionalDiscountPercent > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>Additional discount</p>
              <span style={{ display: "flex", alignItems: "center" }}>
                {/* <LiaRupeeSignSolid /> */}
                {invoice?.additionalDiscountPercent}%
              </span>
            </div>
          )}

          {/* DISCOUNT */}
          {(invoice?.additionalDiscountAmount ?? 150) > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>Discount Amount</p>
              <span style={{ display: "flex", alignItems: "center" }}>
                <LiaRupeeSignSolid />
                {(invoice?.additionalDiscountAmount ?? 150).toFixed(2)}
              </span>
            </div>
          )}

          {hasDiscount && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p>Discount</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <LiaRupeeSignSolid />
                {subtotalDiscount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          )}

          {/* TOTAL */}
          <div
            style={{
              height: "1px",
              margin: "12px 0",
              backgroundColor: themeColor,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "600",
              fontSize: "16px",
              color: "#52525c",
            }}
          >
            <p>Total Amount</p>
            <span style={{ display: "flex", alignItems: "center" }}>
              <LiaRupeeSignSolid />
              {(invoice?.totalAmount ?? 40200).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div
            style={{
              height: "0.5px",
              marginTop: "12px",
              backgroundColor: themeColor,
            }}
          />

          <div
            style={{
              marginTop: "16px",
              fontSize: "12px",
              color: "#52525c",
            }}
          >
            <p style={{ fontWeight: 600, fontSize: "14px" }}>
              Total Amount (in words)
            </p>
            <span>
              {toWords?.convert(invoice?.totalAmount ?? 40200).toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
          }}
        >
          {/* TERMS AND CONDITION SECTION */}
          {invoice?.termsAndCondition || business?.termsAndCondition ? (
            <div>
              <h4 style={{ fontWeight: 600 }}>Terms & Conditions</h4>
              <p
                style={{
                  whiteSpace: "pre-line",
                  color: "#52525c",
                  fontStyle: "italic",
                  fontSize: "12px",
                  marginTop: "6px",
                }}
              >
                {invoice?.termsAndCondition || business?.termsAndCondition}
              </p>
            </div>
          ) : (
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: "10px" }}>
                Terms & Conditions
              </h4>
              <ol style={{ paddingLeft: "20px" }}>
                <li
                  style={{
                    fontStyle: "italic",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  # ALL LEGAL ISSUES UNDER THE JURISDICTION OF JHARKHAND
                  GOVERNMENT.
                </li>
                <li
                  style={{
                    fontStyle: "italic",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  # WE DECLARE THAT THIS INVOICE SHOWS THE ACTUAL PRICE OF THE
                  GOODS.
                </li>
                <li
                  style={{
                    fontStyle: "italic",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  # ALL PARTICULARS ARE TRUE AND CORRECT TO THE BEST OF OUR
                  KNOWLEDGE.
                </li>
              </ol>
            </div>
          )}

          {/* NOTES SECTION (if available) */}
          {(invoice?.notes || business?.notes) && (
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontWeight: 600 }}>Notes</h4>
              <p
                style={{
                  whiteSpace: "pre-line",
                  color: "#52525c",
                  fontStyle: "italic",
                  fontSize: "12px",
                  marginTop: "6px",
                }}
              >
                {invoice?.notes || business?.notes}
              </p>
            </div>
          )}
        </div>
        <div style={{ marginTop: "12px" }}>
          {type === "Sales Invoice" && business?.signature !== "null" ? (
            <img src={business?.signature} alt="signature" width={"250px"} />
          ) : (
            <div>{/* DISPLAY THE PARTY's SIGNATURE */}</div>
          )}

          <hr style={{ margin: "16px 0", borderColor: "#d4d4d8" }} />
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "100px",
            }}
          >
            {business?.businessName}
          </p>
        </div>
      </div>
    </main>
  );
};

export default InvoiceTemplate1;
