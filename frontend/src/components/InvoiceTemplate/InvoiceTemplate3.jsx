import { BsTelephone } from "react-icons/bs";
import { useBusinessStore } from "../../store/businessStore";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useEffect, useRef, useState } from "react";
import { toWords } from "../../../helpers/wordsToCurrency";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import { LuIndianRupee } from "react-icons/lu";

const InvoiceTemplate3 = ({
  color,
  textColor,
  checkBoxSetting,
  invoice,
  type,
  printRef,
  setInvoiceIdToDownload,
}) => {
  const borderClr = color || "#E7000B";
  const txtClr = textColor || "#fff";

  const { business } = useBusinessStore();
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
        `/bank-account/party/${invoice?.partyId?._id}/?businessId=${business?._id}`
      );
      return res.data[0];
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
      setInvoiceIdToDownload(invoiceIdToDownload?.current?.id);
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
    <div
      style={{
        maxWidth: "900px",
        minHeight: "100vh",
        margin: "20px auto",
        backgroundColor: "#fff",
        paddingBottom: "8px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "#000",
        padding: "24px",
        // boxShadow: "0 0 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: borderClr,
          color: txtClr,
          padding: "15px 20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {type === "Sales Invoice" && business?.logo !== "null" ? (
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
            ) : (
              <div>{/* DISPLAYING THE PARTY LOGO */}</div>
            )}
            {/* BUSINESS NAME */}
            <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0 }}>
              {type === "Sales Invoice"
                ? business?.businessName
                : invoice?.partyName || "Business name"}
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontWeight: "700",
                marginRight: "30px",
                textTransform: "uppercase",
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
                : "Tax Invoice"}
            </p>
            {checkBoxSetting?.showTime && (
              <p style={{ marginRight: "30px" }}>10.45 AM</p>
            )}
          </div>
        </div>

        <div style={{ display: "flex", marginTop: "5px" }}>
          <div style={{ width: "60%" }}>
            <p>
              {type === "Sales Invoice"
                ? business?.billingAddress
                : invoice?.partyId?.billingAddress || "Billing Address"}
            </p>
            <div>
              {" "}
              {type === "Party Invoice"
                ? invoice?.partyId?.GSTIN?.length > 0 && (
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
                      {invoice?.partyId?.GSTIN}
                    </p>
                  )
                : business?.gstNumber?.length > 0 && (
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
            </div>
            <div>
              {type === "Purchase Invoice"
                ? invoice?.partyId?.email?.length > 0 && (
                    <p
                      style={{
                        display: "flex",
                        fontSize: "0.875rem",
                      }}
                    >
                      {invoice?.partyId?.email}
                    </p>
                  )
                : business?.companyEmail?.length > 0 && (
                    <p
                      style={{
                        display: "flex",
                        fontSize: "0.875rem",
                      }}
                    >
                      {business?.companyEmail}
                    </p>
                  )}
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ margin: 0 }}>
                {type === "Purchase Invoice"
                  ? invoice?.partyId?.mobileNumber?.length > 0 && (
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                          color: "#52525b",
                        }}
                      >
                        <span>
                          <BsTelephone />
                        </span>
                        {invoice?.partyId?.mobileNumber}
                      </p>
                    )
                  : business?.companyPhoneNo?.length > 0 && (
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.875rem",
                        }}
                      >
                        <span>
                          <BsTelephone />
                        </span>
                        {business?.companyPhoneNo}
                      </p>
                    )}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "35px",
              paddingLeft: "50px",
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              <div
                style={{
                  fontSize: "12px",
                  marginTop: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textTransform: "uppercase",
                }}
              >
                <p>
                  {type === "Sales Return"
                    ? "Sales Return No."
                    : type === "Sales Invoice"
                    ? "Invoice No."
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
                    : type === "Purchase Return"
                    ? "Purchase Return No."
                    : "Invoice No."}
                </p>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "32px",
                  textTransform: "uppercase",
                }}
              >
                <p>
                  {type === "Sales Return"
                    ? "Sales Return Date"
                    : type === "Sales Invoice"
                    ? "Invoice Date"
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
                    : type === "Purchase Return"
                    ? "Purchase Return Date"
                    : "Invoice Date"}
                </p>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "32px",
                  textTransform: "uppercase",
                }}
              >
                <p>
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
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
                alignItems: "flex-end",
              }}
            >
              <p>
                {" "}
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
                  : type === "Purchase Return"
                  ? invoice?.purchaseReturnNumber
                  : ""}
              </p>
              <p>
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
                  : type === "Purchase Return"
                  ? invoice?.purchaseReturnDate?.split("T")[0]
                  : ""}
              </p>
              <p>
                {" "}
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
                  : type === "Purchase Return"
                  ? invoice?.purchaseReturnDate?.split("T")[0]
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bill / Ship / PO Info */}
      <div
        style={{
          display: "grid",
          // 🔹 Dynamically change grid columns
          gridTemplateColumns:
            checkBoxSetting?.poNumber ||
            checkBoxSetting?.eWayBillNo ||
            checkBoxSetting?.vechileNumber
              ? "1fr 1fr 1fr" // 3 columns when any extra info is enabled
              : "1fr 1fr", // Default 2 columns for Bill To & Ship To
          marginTop: "20px",
          gap: "10px",
          padding: "0 16px",
        }}
      >
        {/* --- Bill To --- */}

        <div style={{ padding: "8px", borderLeft: `3px solid ${borderClr}` }}>
          <h3
            style={{
              fontWeight: "600",
              marginBottom: "4px",
              color: borderClr,
            }}
          >
            {type === "Credit Note"
              ? "PARTY NAME"
              : type === "Purchase Order"
              ? "BILL FROM"
              : "BILL TO"}
          </h3>
          <div>
            {invoice?.partyId?.partyName ? (
              <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                {" "}
                {invoice?.partyId?.partyName}{" "}
              </span>
            ) : (
              <div style={{}}>
                <p style={{ fontWeight: "600", margin: "0" }}>Sample Party</p>
                <p style={{ margin: "0" }}>
                  No F2, Outer Circle, Connaught Circus, New Delhi, DELHI 110001
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
          <p>
            {type === "Purchase Invoice"
              ? business?.shippingAddress
              : invoice?.partyId?.billingAddress}
          </p>
          <div>
            {type === "Purchase Invoice"
              ? business?.companyPhoneNo?.length > 0 && (
                  <p style={{ fontWeight: 600 }}>
                    Mobile{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {business?.companyPhoneNo}
                    </span>
                  </p>
                )
              : invoice?.partyId?.mobileNumber?.length > 0 && (
                  <p style={{ fontWeight: 600 }}>
                    Mobile{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {invoice?.partyId?.mobileNumber}
                    </span>
                  </p>
                )}
          </div>
          <div>
            {type === "Purchase Invoice"
              ? business?.gstNumber?.length > 0 && (
                  <p style={{ fontWeight: 600 }}>
                    GSTIN{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {business?.gstNumber}
                    </span>
                  </p>
                )
              : invoice?.partyId?.GSTIN?.length > 0 && (
                  <p style={{ fontWeight: 600 }}>
                    GSTIN{" "}
                    <span style={{ fontWeight: "normal" }}>
                      {invoice?.partyId?.GSTIN}
                    </span>
                  </p>
                )}
          </div>
        </div>

        {/* --- Ship To --- */}

        <div style={{ padding: "8px", borderLeft: `3px solid ${borderClr}` }}>
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
        </div>

        {/* --- PO / EWay / Vehicle Section --- */}
        {(checkBoxSetting?.poNumber ||
          checkBoxSetting?.eWayBillNo ||
          checkBoxSetting?.vechileNumber) && (
          <div
            style={{
              padding: "8px 12px",
              borderLeft: `3px solid ${borderClr}`,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {checkBoxSetting?.poNumber && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ fontWeight: "600", margin: 0 }}>PO Number:</p>
                <p style={{ margin: 0 }}>PO12345</p>
              </div>
            )}

            {checkBoxSetting?.eWayBillNo && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ fontWeight: "600", margin: 0 }}>E-Way Bill No.:</p>
                <p style={{ margin: 0 }}>12345</p>
              </div>
            )}

            {checkBoxSetting?.vechileNumber && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p style={{ fontWeight: "600", margin: 0 }}>Vehicle No.:</p>
                <p style={{ margin: 0 }}>JH02AM 0472</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Items Table */}
      <table
        style={{
          width: "100%",
          marginTop: "24px",
          borderCollapse: "collapse",
          textAlign: "center",
          fontSize: "14px",
          border: `1px solid ${borderClr} `,
        }}
      >
        <thead
          style={{
            backgroundColor: borderClr,
            color: txtClr,
          }}
        >
          <tr>
            {/* NO */}
            <th
              style={{
                border: `1px solid ${borderClr}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              No
            </th>

            {/* ITEMS */}
            <th
              style={{
                border: `1px solid ${borderClr}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              Items
            </th>

            {/* HSC/SAC */}
            <th
              style={{
                border: `1px solid ${borderClr}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              HSN/SAC
            </th>

            {/* QTY */}
            <th
              style={{
                border: `1px solid ${borderClr}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              Qty.
            </th>

            {/* RATE */}
            <th
              style={{
                border: `1px solid ${borderClr}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              Rate
            </th>

            {/* TAX */}
            <th
              style={{
                border: `1px solid ${borderClr}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              Tax
            </th>

            {/* DISCOUNT */}
            {hasDiscount && (
              <th style={{ padding: "8px", textAlign: "left" }}>Discount</th>
            )}

            {/* TOTAL */}
            <th
              style={{
                border: `1px solid ${borderClr}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              Total
            </th>
          </tr>
        </thead>

        <tbody style={{ color: "#000" }}>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={item?._id}>
                <td
                  style={{ border: `1px solid ${borderClr}`, padding: "8px" }}
                >
                  {index + 1}
                </td>

                {/* ITEM NAME & DESC */}
                <td
                  style={{
                    border: `1px solid ${borderClr}`,
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  <span>{item?.itemName ?? "-"}</span>
                  <p className="text-xs text-zinc-500">
                    {item?.description || ""}
                  </p>
                </td>

                {/* ITEM HSN */}
                <td
                  style={{ border: `1px solid ${borderClr}`, padding: "8px" }}
                >
                  {item?.HSNCode || item?.SACCode || "-"}
                </td>

                {/* ITEM QTY */}
                <td
                  style={{ border: `1px solid ${borderClr}`, padding: "8px" }}
                >
                  {item?.quantity || 0}
                </td>

                {/* ITEM RATE */}
                <td
                  style={{ border: `1px solid ${borderClr}`, padding: "8px" }}
                >
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

                {/* ITEM TAX */}
                <td
                  style={{ border: `1px solid ${borderClr}`, padding: "8px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      justifyContent: "start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <LiaRupeeSignSolid />
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

                {/* TOTAL */}
                <td
                  style={{ border: `1px solid ${borderClr}`, padding: "8px" }}
                >
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
            ))
          ) : (
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

          {/* SUBTOTAL ROW */}
          <tr
            style={{
              backgroundColor: `${borderClr}`,
              fontWeight: "",
              border: `1px solid ${borderClr}`,
              color: txtClr,
            }}
          >
            <td style={{ padding: "8px" }}>Subtotal</td>
            <td style={{ padding: "8px" }}></td>
            <td style={{ padding: "8px" }}></td>

            <td style={{ padding: "8px" }}>{subtotalQuantity}</td>

            <td style={{ padding: "8px" }}>
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

            <td style={{ padding: "8px" }}>
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
                  {subtotalDiscount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </td>
            )}
            <td style={{ padding: "8px", textAlign: "center" }}>
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

      {/* Notes & Taxes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginTop: "24px",
          fontSize: "14px",
        }}
      >
        {bankAccount && (
          <div style={{ marginTop: "30px" }}>
            <p
              style={{
                fontWeight: "550",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              Account Holder Name:{" "}
              <span style={{ fontWeight: "50" }}>
                {" "}
                {bankAccount?.accountHoldersName}
              </span>
            </p>
            <p
              style={{
                fontWeight: "550",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              Bank & Branch Name:{" "}
              <span style={{ fontWeight: "50" }}>
                {" "}
                {bankAccount?.bankAndBranchName}
              </span>
            </p>
            <p
              style={{
                fontWeight: "550",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              Account Number:{" "}
              <span style={{ fontWeight: "50" }}>
                {bankAccount?.bankAccountNumber}
              </span>
            </p>
            <p
              style={{
                fontWeight: "550",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              Account Name:{" "}
              <span style={{ fontWeight: "50" }}>
                {bankAccount?.accountName}
              </span>
            </p>

            <p
              style={{
                fontWeight: "550",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              IFSC Code:{" "}
              <span style={{ fontWeight: "50" }}> {bankAccount?.IFSCCode}</span>
            </p>
            <p
              style={{
                fontWeight: "550",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              UPI Id:{" "}
              <span style={{ fontWeight: "50" }}>
                {" "}
                {bankAccount?.upiId || "-"}
              </span>
            </p>
          </div>
        )}

        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            border: `1px solid ${borderClr}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p>Taxable Amount:</p>
              <p>CGST</p>
              <p>SGST</p>
              <p>
                {invoice?.additionalChargeAmount > 0 &&
                  invoice?.additionalChargeReason}
              </p>
              <p>
                {invoice?.additionalDiscountPercent > 0 &&
                  "Additional discount"}
              </p>
              <p>
                {invoice?.additionalDiscountAmount > 0 && "Discount Amount"}
              </p>
              <p>{hasDiscount && "Discount"}</p>
            </div>

            <div style={{ textAlign: "right" }}>
              <div>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <LiaRupeeSignSolid />
                  {subtotalTaxable.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              {/* CGST */}
              <p>
                {" "}
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
              </p>

              {/* SGST */}
              <p>
                {" "}
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
              </p>

              {/* ADDITIONAL CHARGE */}
              {invoice?.additionalChargeAmount > 0 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>
                    {invoice?.additionalChargeReason || "Transport Charges"}
                  </p>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <LiaRupeeSignSolid />
                    {invoice?.additionalChargeAmount ?? 200}
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

              {/* DISCOUNT */}
              {invoice?.additionalDiscountAmount > 0 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <LiaRupeeSignSolid />
                    {subtotalDiscount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <hr style={{ margin: "8px 0", border: `1px solid ${borderClr}` }} />
          <p
            style={{
              fontWeight: "600",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {" "}
            <span>Total Amount:</span>{" "}
            <span style={{ display: "flex", alignItems: "center" }}>
              {" "}
              <LiaRupeeSignSolid />
              {(invoice?.totalAmount ?? 40200).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </p>
          <hr style={{ margin: "8px 0", border: `1px solid ${borderClr}` }} />
          {/* <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Received Amount: </span>
            <span>₹ 4,453.5</span>
          </p> */}
          {/* <p
            style={{
              fontWeight: "700",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {" "}
            <span>Balance:</span> <span>₹ 9,596.5</span>
          </p> */}

          {/* {checkBoxSetting?.showPartyBalance && (
            <>
              <hr
                style={{ margin: "8px 0", border: `1px solid ${borderClr}` }}
              />
              <p style={{ display: "flex", justifyContent: "space-between" }}>
                <span> Previous Balance:</span>
                <span>₹ -554,453.5</span>
              </p>
              <p style={{ display: "flex", justifyContent: "space-between" }}>
                <span> Current Balance:</span>
                <span>₹ -444,453.5</span>
              </p>
            </>
          )} */}

          <div
            style={{
              textAlign: "right",
              marginTop: "16px",
              paddingRight: "8px",
            }}
          >
            <p style={{ fontWeight: "bold", margin: 0, color: borderClr }}>
              Total Amount (in words)
            </p>
            <p style={{ margin: 0 }}>
              {toWords?.convert(invoice?.totalAmount ?? 40200).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
        }}
      >
        <div style={{ marginTop: "12px" }}>
          {invoice?.termsAndCondition ||
            (business?.termsAndCondition && (
              <div>
                <h4 style={{ fontWeight: 600 }}>Terms & Condition</h4>
                <p
                  style={{
                    whiteSpace: "pre-line",
                    color: "#52525c",
                    fontStyle: "italic",
                  }}
                >
                  {invoice?.termsAndCondition || business?.termsAndCondition}
                </p>
              </div>
            ))}

          {business?.notes && (
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontWeight: 600 }}>Notes</h4>
              <p
                style={{
                  whiteSpace: "pre-line",
                  color: "#52525c",
                  fontStyle: "italic",
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
    </div>
  );
};

export default InvoiceTemplate3;
