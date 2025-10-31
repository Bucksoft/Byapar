import React, { useEffect, useRef, useState } from "react";
import { BsTelephone } from "react-icons/bs";
import { useBusinessStore } from "../../store/businessStore";
import { useAuthStore } from "../../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { toWords } from "../../../helpers/wordsToCurrency";
import { axiosInstance } from "../../config/axios";
import { LuIndianRupee } from "react-icons/lu";

const InvoiceTemplate2 = ({
  color,
  textColor,
  checkBoxSetting,
  type,
  invoice,
  setInvoiceIdToDownload,
  printRef,
}) => {
  const themeColor = color || "#1C398E";
  const headerTextColor = textColor || "#fff";
  const fontColor = "#000";
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
        // border: `1px solid ${themeColor}`,
        padding: "24px",
        Width: "70%",
        color: fontColor,
        backgroundColor: "#fff",
        fontSize: "14px",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
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
        <div style={{ textAlign: "right" }}>
          <p style={{ fontWeight: "700", margin: 0 }}>TAX INVOICE</p>
          {/* {checkBoxSetting?.showTime && <p style={{ margin: 0 }}>10.45 AM</p>} */}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Company Info */}
        <div style={{ width: "60%", marginTop: "10px", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700" }}>
            {business?.businessName}
          </h1>
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
          {checkBoxSetting?.showPhone && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <BsTelephone />
              <p style={{ fontWeight: "700" }}>
                {theme?.options.find((t) => t.name === "showPhone")
                  ?.checked && (
                  <span>
                    Mobile :{" "}
                    {business?.companyPhoneNo
                      ? business?.companyPhoneNo
                      : "478569321"}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
        {/* PO, E-Way Bill, Vehicle */}
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
                justifyContent: "space-between",
                gap: "50px",
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
      <hr style={{ border: `1px solid ${themeColor}`, margin: "8px 0" }} />

      {/* Invoice Info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "5px",
          marginTop: "16px",
          fontSize: "14px",
        }}
      >
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
        <p style={{ margin: 0 }}>
          <b>Invoice Date:</b>{" "}
          {invoice?.salesInvoiceDate.split("T")[0] || "2025-05-01"}
        </p>
        <p style={{ margin: 0 }}>
          <b>Due Date:</b> {invoice?.dueDate.split("T")[0] || "2025-05-01"}
        </p>
      </div>
      {/* Bill To & Ship To */}
      {
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            border: `1px solid ${themeColor}`,
            marginTop: "16px",
            fontSize: "14px",
          }}
        >
          {checkBoxSetting && checkBoxSetting?.billTo && (
            <div style={{ padding: "12px" }}>
              <h2 style={{ fontWeight: "600", margin: "0 0 4px 0" }}>
                Bill To
              </h2>
              <p style={{ fontWeight: "600", margin: "0" }}>
                {invoice?.partyId?.partyName || "Party Name"}
              </p>
              <p style={{ margin: "0" }}>
                {invoice?.partyId?.billingAddress || "billing address"}
              </p>

              {invoice?.partyId?.mobileNumber && (
                <p style={{ margin: "0" }}>
                  <b>Mobile:</b>{" "}
                  {invoice?.partyId?.mobileNumber || "98098235098"}
                </p>
              )}

              {invoice?.partyId?.GSTIN && (
                <p style={{ margin: "0" }}>
                  <b>GSTIN:</b> {invoice?.partyId?.GSTIN || "09AAACH7409R1ZZ"}
                </p>
              )}
            </div>
          )}
          {checkBoxSetting?.shipTo && (
            <div style={{ padding: "8px" }}>
              <h3 style={{ fontWeight: "600", marginBottom: "4px" }}>
                Ship To
              </h3>
              <p>{invoice?.partyId?.shippingAddress || "shipping address"}</p>
            </div>
          )}
        </div>
      }

      <table
        style={{
          width: "100%",
          marginTop: "24px",
          borderCollapse: "collapse",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        <thead
          style={{
            backgroundColor: themeColor,
            color: headerTextColor,
          }}
        >
          <tr>
            <th
              style={{
                border: `1px solid ${themeColor}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              No
            </th>
            <th
              style={{
                border: `1px solid ${themeColor}`,
                padding: "8px",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Items
            </th>
            <th
              style={{
                border: `1px solid ${themeColor}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              HSN/SAC
            </th>

            <th
              style={{
                border: `1px solid ${themeColor}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              Qty.
            </th>

            <th
              style={{
                border: `1px solid ${themeColor}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              Rate
            </th>

            <th
              style={{
                border: `1px solid ${themeColor}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              Tax
            </th>
            {hasDiscount ? (
              <th
                style={{
                  border: `1px solid ${themeColor}`,
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Discount
              </th>
            ) : (
              <th></th>
            )}
            <th
              style={{
                border: `1px solid ${themeColor}`,
                padding: "8px",
                fontWeight: "600",
              }}
            >
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Row 1 */}
          {items?.map((item, index) => (
            <tr key={item?._id}>
              <td style={{ border: `1px solid ${themeColor}`, padding: "8px" }}>
                {index + 1}
              </td>

              {/* ITEM NAME */}
              <td
                style={{
                  border: `1px solid ${themeColor}`,
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                {item?.itemName}
                {checkBoxSetting?.showItemDesc && (
                  <span style={{ fontSize: "12px", color: "#555" }}>
                    {" "}
                    {item?.description || ""}
                  </span>
                )}
              </td>

              {/* ITEM HSN CODE */}
              <td style={{ border: `1px solid ${themeColor}`, padding: "8px" }}>
                {item?.HSNCode || item?.SACCode || "-"}
              </td>

              {/* ITEM QUANTITY */}
              <td style={{ border: `1px solid ${themeColor}`, padding: "8px" }}>
                {item?.quantity || 0}
              </td>

              {/* RATE */}
              <td style={{ border: `1px solid ${themeColor}`, padding: "8px" }}>
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

              {/* TAX */}
              <td style={{ border: `1px solid ${themeColor}`, padding: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
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
                    {Number(item?.discountAmount || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </td>
              )}

              {/* TOTAL */}
              <td style={{ border: `1px solid ${themeColor}`, padding: "8px" }}>
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
          <tr
            style={{
              borderTop: `2px solid ${themeColor}`,
              backgroundColor: "#f9f9f9",
              fontWeight: "bold",
            }}
          >
            <td style={{ padding: "8px" }}>Subtotal</td>
            <td style={{ padding: "8px" }}></td>
            <td style={{ padding: "8px" }}></td>

            <td style={{ padding: "8px" }}>{subtotalQuantity}</td>

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
            <td></td>
            <td style={{ padding: "8px" }}>
              {" "}
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

      {/* Bank Accounts , Notes and Taxes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginTop: "24px",
          fontSize: "14px",
        }}
      >
        <div
          style={{
            width: "100%",
          }}
        >
          {" "}
          {bankAccount && (
            <div
              key={bankAccount?._id}
              style={{
                marginTop: "12px",
              }}
            >
              <div>
                <h4 style={{ fontWeight: 600 }}>Bank Details</h4>

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
                  <p style={{ whiteSpace: "pre-line" }}>{bankAccount?.upiId}</p>
                </div>

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
                  <p
                    style={{
                      whiteSpace: "pre-line",
                      textAlign: "right",
                    }}
                  >
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
          )}
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            border: `1px solid ${themeColor}`,
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
              <p>{hasDiscount && "Discount"}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div>
                {" "}
                <p style={{ display: "flex", alignItems: "center" }}>
                  <LiaRupeeSignSolid />
                  {subtotalTaxable.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
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

              {/* ADDITIONAL CHARGE AMOUNT EG. TRANSPORT ETC.... */}
              <p>
                {invoice?.additionalChargeAmount > 0 && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <LiaRupeeSignSolid />
                      {invoice?.additionalChargeAmount}
                    </span>
                  </div>
                )}
              </p>
              {/* DISCOUNT PERCENTAGE */}
              <p>
                {invoice?.additionalDiscountPercent > 0 && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {/* <LiaRupeeSignSolid /> */}
                      {invoice?.additionalDiscountPercent}%
                    </span>
                  </div>
                )}
              </p>

              {/* DISCOUNT */}
              <div>
                {hasDiscount && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <LiaRupeeSignSolid />
                      {subtotalDiscount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <hr style={{ margin: "8px 0", border: `1px solid ${themeColor}` }} />
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
              <LiaRupeeSignSolid />
              {Number(invoice?.totalAmount || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </p>
          <hr style={{ margin: "8px 0", border: `1px solid ${themeColor}` }} />

          {/* {checkBoxSetting?.showPartyBalance && (
            <>
              <hr
                style={{ margin: "8px 0", border: `1px solid ${themeColor}` }}
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
          <div style={{ textAlign: "right", marginTop: "24px" }}>
            <p style={{ fontWeight: "700", margin: "0 0 4px 0" }}>
              Total Amount (in words)
            </p>
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
      </div>

      {/* Footer */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
        }}
      >
        <div>
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

        <div style={{ marginTop: "50px", marginLeft: "100px" }}>
          {type === "Sales Invoice" && business?.signature !== "null" ? (
            <img src={business?.signature} alt="signature" width={"150px"} />
          ) : (
            <div>{/* DISPLAY THE PARTY's SIGNATURE */}</div>
          )}

          <div
            style={{
              fontWeight: "600",
              borderBottom: "1px solid #000",
              width: "100%",
              display: "inline-block",
            }}
          ></div>
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

export default InvoiceTemplate2;
