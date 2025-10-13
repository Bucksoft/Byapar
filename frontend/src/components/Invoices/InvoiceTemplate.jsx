import { BsTelephone } from "react-icons/bs";
import { useBusinessStore } from "../../store/businessStore";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useEffect, useRef } from "react";
import { toWords } from "../../../helpers/wordsToCurrency";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import bspl_logo from "../../assets/bspl_logo.png";
import signature_bspl from "../../assets/signature_bspl.png";
import { LuIndianRupee } from "react-icons/lu";

const InvoiceTemplate = ({
  type,
  color,
  invoice,
  setInvoiceIdToDownload,
  printRef,
}) => {
  const { business } = useBusinessStore();
  const invoiceIdToDownload = useRef();

  const { isLoading, data: bankAccounts } = useQuery({
    queryKey: ["businessBankAccounts"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/bank-account/${business?._id}`);
      return res.data;
    },
  });

  useEffect(() => {
    setInvoiceIdToDownload(invoiceIdToDownload?.current?.id);
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

  console.log(invoice);

  return (
    <main
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        alignItems: "start",
        minHeight: "100vh",
        padding: "1rem 0",
        overflowX: "hidden",
        overflowY: "auto",
      }}
      ref={printRef}
      class="print-invoice"
    >
      <div
        ref={invoiceIdToDownload}
        id="invoice"
        class="invoice-content"
        style={{
          margin: "auto",
          boxSizing: "border-box",
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#fff",
          // boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          padding: "30px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            // flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
            }}
          >
            {business?.logo !== "null" && (
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fecaca",
                  overflow: "hidden",
                }}
              >
                <img
                  src={
                    business?.logo ||
                    "https://bucksoftech.com/wp-content/uploads/2025/02/cropped-logo.png"
                  }
                  alt="Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <h2 style={{ fontWeight: 600, fontSize: "20px" }}>
              {business?.businessName}
            </h2>
            <p
              style={{
                fontSize: "0.875rem", // text-sm
                color: "#52525b", // text-gray-600
              }}
            >
              {business?.billingAddress}
            </p>

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
                    fontWeight: 600,
                    marginRight: "0.5rem",
                  }}
                >
                  GSTIN
                </span>
                {business?.gstNumber}
              </p>
            )}

            {business?.companyEmail.length > 0 && (
              <p
                style={{
                  display: "flex",
                  fontSize: "0.875rem",
                  color: "#52525b",
                }}
              >
                {business?.companyEmail}
              </p>
            )}
          </div>
          <div>
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
                : ""}
            </h1>
            {/* NUMBER */}
            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ color: color, fontWeight: "600" }}>
                {type === "Sales Return"
                  ? "Sales Return No."
                  : type === "Sales Invoice"
                  ? "Sales Invoice No."
                  : type === "Quotation"
                  ? "Quotation No."
                  : type === "Delivery Challan"
                  ? "Delivery Challan No."
                  : type === "Proforma Invoice"
                  ? "Proforma Invoice No."
                  : type === "Purchase Invoice"
                  ? "Purchase Invoice No."
                  : type === "Credit Note"
                  ? "Credit Note No."
                  : type === "Purchase Order"
                  ? "Purchase Order No."
                  : type === "Debit Note"
                  ? "Debit Note No."
                  : ""}
              </p>
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
                  : ""}
              </span>
            </div>
            {/* DATE */}
            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "32px",
              }}
            >
              <p style={{ color: color, fontWeight: "600" }}>
                {type === "Sales Return"
                  ? "Sales Return Date"
                  : type === "Sales Invoice"
                  ? "Sales Invoice Date"
                  : type === "Quotation"
                  ? "Quotation Date"
                  : type === "Delivery Challan"
                  ? "Delivery Challan Date"
                  : type === "Proforma Invoice"
                  ? "Proforma Invoice Date"
                  : type === "Purchase Invoice"
                  ? "Purchase Invoice Date"
                  : type === "Credit Note"
                  ? "Credit Note Date"
                  : type === "Purchase Order"
                  ? "Purchase Order Date"
                  : type === "Debit Note"
                  ? "Debit Note Date"
                  : ""}
              </p>
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
                  : ""}
              </span>
            </div>
            {/* DUE DATE */}
            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "32px",
              }}
            >
              <p style={{ color: color, fontWeight: "600" }}>
                {type === "Quotation" ||
                type === "Proforma Invoice" ||
                type === "Purchase Order"
                  ? "Expiry Date"
                  : type === "Credit Note"
                  ? ""
                  : type === "Debit Note"
                  ? ""
                  : "Due Date"}
              </p>
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
                  : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "#3f3f46",
          }}
        >
          <span style={{ color: color }}>
            <BsTelephone />
          </span>
          {business?.companyPhoneNo}
        </div>

        <hr style={{ margin: "16px 0", borderColor: "#d4d4d8" }} />

        {/* Bill to */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <section style={{ fontSize: "14px", width: "50%" }}>
            <h3 style={{ fontWeight: "bold" }}>
              {type === "Credit Note"
                ? "PARTY NAME"
                : type === "Purchase Order"
                ? "BILL FROM"
                : "BILL TO"}
            </h3>
            <p style={{ fontWeight: "bold" }}>{invoice?.partyId?.partyName}</p>
            <p style={{ fontSize: "14px", color: "#3f3f46" }}>
              {type === "Purchase Order"
                ? invoice?.partyId?.shippingAddress
                : invoice?.partyId?.billingAddress}
            </p>
            {invoice?.partyId?.mobileNumber.length > 0 && (
              <p style={{ fontWeight: 600 }}>
                Mobile{" "}
                <span style={{ fontWeight: "normal" }}>
                  {invoice?.partyId?.mobileNumber}
                </span>
              </p>
            )}
            {invoice?.partyId?.GSTIN.length > 0 && (
              <p style={{ fontWeight: 600 }}>
                GSTIN{" "}
                <span style={{ fontWeight: "normal" }}>
                  {invoice?.partyId?.GSTIN}
                </span>
              </p>
            )}
          </section>
          {/* {type === "Delivery Challan" && (
            <section style={{ fontSize: "14px" }}>
              <h3 style={{ fontWeight: 500 }}>SHIP TO</h3>
              <p style={{ fontWeight: "bold" }}>
                {invoice?.partyId?.partyName}
              </p>
              <p style={{ fontSize: "14px", color: "#3f3f46" }}>
                {invoice?.partyId?.shippingAddress}
              </p>
              <p style={{ fontWeight: 600 }}>
                Mobile{" "}
                <span style={{ fontWeight: "normal" }}>
                  {invoice?.partyId?.mobileNumber}
                </span>
              </p>
            </section>
          )} */}
          <section style={{ fontSize: "14px", width: "50%" }}>
            {invoice?.partyId?.shippingAddress &&
              invoice?.partyId?.shippingAddress?.length > 0 && (
                <>
                  <h3 style={{ fontWeight: "bold" }}>SHIP TO</h3>
                  <p style={{ fontSize: "14px", color: "#3f3f46" }}>
                    {invoice?.partyId?.shippingAddress}
                  </p>
                </>
              )}
          </section>
        </div>

        {/* Items table */}
        <div style={{ overflowX: "auto", marginTop: "16px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: color, color: "#fff" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>No</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Items</th>

                <th style={{ padding: "8px", textAlign: "left" }}>HSN/SAC</th>

                <th style={{ padding: "8px", textAlign: "left" }}>Qty.</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Rate</th>
                <th style={{ padding: "8px", textAlign: "left" }}>
                  Taxable Amount
                </th>
                <th style={{ padding: "8px", textAlign: "left" }}>Tax</th>
                {hasDiscount && (
                  <th style={{ padding: "8px", textAlign: "left" }}>
                    Discount
                  </th>
                )}
                <th style={{ padding: "8px", textAlign: "right" }}>Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "6px" }}>{index + 1}</td>
                  <td style={{ padding: "6px" }}>{item?.itemName || "-"}</td>

                  <td style={{ padding: "6px" }}>
                    {item?.HSNCode || item?.SACCode || "-"}
                  </td>

                  <td style={{ padding: "6px" }}>{item?.quantity || 0}</td>

                  {/* Rate */}
                  <td style={{ padding: "6px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
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

                  {/* Taxable Value */}
                  <td style={{ padding: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <LiaRupeeSignSolid />
                      {Number(
                        item?.taxableValue ||
                          item?.salesPrice * item?.quantity ||
                          0
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </td>

                  {/* Tax */}
                  <td style={{ padding: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <LiaRupeeSignSolid />
                      {Number(
                        item?.gstAmount ||
                          (item?.salesPrice * (item?.gstTaxRate || 0)) / 100
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      {item?.gstTaxRate && (
                        <span style={{ marginLeft: "4px", color: "#52525c" }}>
                          ({getGSTPercentage(item?.gstTaxRate)}%)
                        </span>
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
                        <LiaRupeeSignSolid />
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
                  <td style={{ padding: "6px", textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <LiaRupeeSignSolid />
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

              {/* Subtotal Row */}
              <tr style={{ backgroundColor: "#e1e1e3", fontWeight: 600 }}>
                <td></td>
                <td style={{ padding: "6px" }}>Subtotal</td>
                <td></td>
                <td style={{ padding: "6px" }}>{subtotalQuantity}</td>
                <td></td>

                {/* Taxable */}
                <td style={{ padding: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <LiaRupeeSignSolid />
                    {subtotalTaxable.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </td>

                {/* Tax */}
                <td style={{ padding: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <LiaRupeeSignSolid />
                    {subtotalTax.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </td>

                {/* Discount */}
                {hasDiscount && (
                  <td style={{ padding: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <LiaRupeeSignSolid />
                      {subtotalDiscount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </td>
                )}

                {/* Total */}
                <td style={{ padding: "6px", textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
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
            </tbody>
          </table>

          {/* Footer */}
          <hr style={{ margin: "16px 0", borderColor: "#d4d4d8" }} />
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              fontSize: "12px",
              gap: "20px",
            }}
          >
            {bankAccounts &&
              bankAccounts?.map((bankAccount) => (
                <div style={{ marginTop: "12px" }}>
                  <div>
                    <h4 style={{ fontWeight: 600 }}>Bank Details</h4>

                    {/* ACCOUNT HOLDER'S NAME */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3
                        style={{
                          color: "#52525c",
                        }}
                      >
                        Account holder's name
                      </h3>
                      <p style={{ whiteSpace: "pre-line" }}>
                        {bankAccount?.accountHoldersName}
                      </p>
                    </div>

                    {/* BANK ACCOUNT NUMBER */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3
                        style={{
                          color: "#52525c",
                        }}
                      >
                        Bank account number
                      </h3>
                      <p style={{ whiteSpace: "pre-line" }}>
                        {bankAccount?.bankAccountNumber}
                      </p>
                    </div>

                    {/* IFSC Code */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3
                        style={{
                          color: "#52525c",
                        }}
                      >
                        IFSC Code
                      </h3>
                      <p style={{ whiteSpace: "pre-line" }}>
                        {bankAccount?.IFSCCode}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3
                        style={{
                          color: "#52525c",
                        }}
                      >
                        UPI Id
                      </h3>
                      <p style={{ whiteSpace: "pre-line" }}>
                        {bankAccount?.upiId}
                      </p>
                    </div>

                    {/* BANK AND BRANCH NAME */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                      }}
                    >
                      <h3
                        style={{
                          color: "#52525c",
                        }}
                      >
                        Bank and Branch
                      </h3>
                      <p style={{ whiteSpace: "pre-line", textAlign: "right" }}>
                        {bankAccount?.bankAndBranchName}
                      </p>
                    </div>

                    <p style={{ whiteSpace: "pre-line" }}>
                      {bankAccount?.ifscCode}
                    </p>
                    <p style={{ whiteSpace: "pre-line" }}>
                      {bankAccount?.bankName}
                    </p>
                  </div>
                </div>
              ))}

            {/* FOOTER RIGHT SECTION (TOTAL'S) */}
            <div style={{ marginTop: "12px" }}>
              {/* TAXABLE AMOUNT */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>Taxable Amount</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <LiaRupeeSignSolid />
                  {subtotalTaxable.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>

              {/* CGST */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>CGST </p>
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

              {/* ADDITIONAL CHARGE AMOUNT EG. TRANSPORT ETC.... */}
              {invoice?.additionalChargeAmount > 0 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>{invoice?.additionalChargeReason}</p>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <LiaRupeeSignSolid />
                    {invoice?.additionalChargeAmount}
                  </span>
                </div>
              )}

              {/* DISCOUNT PERCENTAGE */}
              {invoice?.additionalDiscountPercent > 0 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>Additional discount</p>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {/* <LiaRupeeSignSolid /> */}
                    {invoice?.additionalDiscountPercent}%
                  </span>
                </div>
              )}

              {/* ADDITIONAL DISCOUNT AMOUNT */}
              {invoice?.additionalDiscountAmount > 0 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>Discount Amount</p>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <LiaRupeeSignSolid />
                    {Number(invoice?.additionalDiscountAmount).toFixed(2)}
                  </span>
                </div>
              )}

              {/* DISCOUNT */}
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

              <div
                style={{
                  height: "1px",
                  margin: "12px 0",
                  backgroundColor: color,
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
                  {Number(invoice?.totalAmount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div
                style={{
                  height: "1px",
                  margin: "12px 0",
                  backgroundColor: color,
                }}
              />

              <div
                style={{
                  marginTop: "16px",
                  fontSize: "12px",
                  color: "#52525c",
                }}
              >
                <p style={{ fontWeight: 600 }}>Total Amount (in words)</p>
                <span>
                  {invoice?.totalAmount &&
                    toWords
                      ?.convert(invoice?.totalAmount)
                      ?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                      .toUpperCase()}{" "}
                </span>
              </div>
            </div>
          </section>

          {/* <hr style={{ margin: "16px 0", borderColor: "#d4d4d8" }} /> */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              fontSize: "12px",
              marginTop: "20px",
            }}
          >
            {/* TERMS AND CONDITION BLOCK */}
            <div style={{ marginTop: "12px" }}>
              {invoice?.termsAndCondition && (
                <div>
                  <h4 style={{ fontWeight: 600 }}>Terms & Conditions</h4>
                  <p style={{ whiteSpace: "pre-line" }}>
                    {invoice?.termsAndCondition}
                  </p>
                </div>
              )}
            </div>

            {/* SIGNATURE BLOCK */}
            <div style={{ marginTop: "50px", marginLeft: "200px" }}>
              {business?.signature !== "null" && (
                <img
                  src={business?.signature}
                  alt="signature"
                  width={"150px"}
                />
              )}

              <hr style={{ margin: "16px 0", borderColor: "#d4d4d8" }} />
              <h3
                style={{
                  fontWeight: 600,
                  fontSize: "12px",
                  textAlign: "right",
                }}
              >
                Signature
              </h3>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default InvoiceTemplate;
