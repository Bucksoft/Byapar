import { BsTelephone } from "react-icons/bs";
import { useBusinessStore } from "../../store/businessStore";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useEffect, useRef } from "react";
import converter from "number-to-words";

const InvoiceTemplate = ({ type, color, invoice, setInvoiceIdToDownload }) => {
  const { business } = useBusinessStore();
  const invoiceIdToDownload = useRef();

  useEffect(() => {
    setInvoiceIdToDownload(invoiceIdToDownload?.current?.id);
  }, [invoiceIdToDownload]);

  const parseAmount = (val) => {
    if (!val) return 0;
    return parseFloat(val.toString().replace(/,/g, ""));
  };

  const total =
    Number(invoice?.taxableAmount || 0) +
    parseAmount(invoice?.cgst) +
    parseAmount(invoice?.sgst);

  return (
    <main style={{ display: "flex", width: "100%", height: "100vh" }}>
      <div
        ref={invoiceIdToDownload}
        id="invoice"
        style={{
          maxWidth: "800px",
          height: "100%",
          backgroundColor: "#fff",
          margin: "auto",
          padding: "16px",
          // boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontWeight: 600, fontSize: "20px" }}>
            {business?.businessName}
          </h2>
          <h1 style={{ textTransform: "uppercase", fontSize: "18px" }}>
            {type === "Sales Return"
              ? "Sales Return"
              : type === "Sales Invoice"
              ? "Sales Invoice"
              : type === "Quotation"
              ? "Quotation"
              : type === "Delivery Challan"
              ? "Delivery Challan"
              : type === "Proforma Invoice"
              ? "Proforma Invoice"
              : type === "Purchase Invoice"
              ? "Purchase Invoice"
              : ""}
          </h1>
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

        {/* Invoice details */}
        <section
          style={{
            display: "flex",
            gap: "40px",
            fontSize: "12px",
            padding: "0 12px",
          }}
        >
          <div>
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
                : ""}
            </span>
          </div>

          <div>
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
                : ""}
            </span>
          </div>

          <div>
            <p style={{ color: color, fontWeight: "600" }}>
              {type === "Quotation" ? "Expiry Date" : "Due Date"}
            </p>
            <span>
              {type === "Sales Return"
                ? invoice?.salesReturnDate?.split("T")[0]
                : type === "Sales Invoice"
                ? invoice?.dueDate?.split("T")[0]
                : type === "Quotation"
                ? invoice?.validityDate?.split("T")[0]
                : type === "Delivery Challan"
                ? invoice?.deliveryChallanDate?.split("T")[0]
                : type === "Proforma Invoice"
                ? invoice?.proformaInvoiceDate?.split("T")[0]
                : type === "Purchase Invoice"
                ? invoice?.purchaseInvoiceDate?.split("T")[0]
                : ""}
            </span>
          </div>
        </section>

        <hr style={{ margin: "16px 0", borderColor: "#d4d4d8" }} />

        {/* Bill to */}
        <section style={{ fontSize: "14px" }}>
          <h3 style={{ fontWeight: 500 }}>BILL TO</h3>
          <p style={{ fontWeight: "bold" }}>{invoice?.partyId?.partyName}</p>
          <p style={{ fontSize: "14px", color: "#3f3f46" }}>
            {invoice?.partyId?.billingAddress}
          </p>
          <p style={{ fontWeight: 600 }}>
            Mobile{" "}
            <span style={{ fontWeight: "normal" }}>
              {invoice?.partyId?.mobileNumber}
            </span>
          </p>
        </section>

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
                <th style={{ padding: "8px", textAlign: "left" }}>Qty.</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Rate</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Tax</th>
                <th style={{ padding: "8px", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.items?.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "6px" }}>{index + 1}</td>
                  <td style={{ padding: "6px" }}>{item?.itemName}</td>
                  <td style={{ padding: "6px" }}>{item?.quantity}</td>
                  <td style={{ padding: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <LiaRupeeSignSolid />
                      {Number(item?.basePrice || 0).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td style={{ padding: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <LiaRupeeSignSolid />
                      {Number(item?.gstAmount || 0).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td style={{ padding: "6px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <LiaRupeeSignSolid />
                      {(
                        Number(item?.quantity || 0) *
                          Number(item?.basePrice || 0) +
                        Number(item?.gstAmount || 0)
                      ).toLocaleString("en-IN")}
                    </div>
                  </td>
                </tr>
              ))}

              {/* Subtotal row */}
              <tr style={{ backgroundColor: "#e1e1e3", fontWeight: 600 }}>
                <td></td>
                <td style={{ padding: "6px" }}>Subtotal</td>
                <td style={{ padding: "6px" }}>
                  {invoice?.items?.reduce(
                    (acc, item) => acc + (Number(item?.quantity) || 0),
                    0
                  )}
                </td>
                <td></td>
                <td style={{ padding: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <LiaRupeeSignSolid />
                    {invoice?.items
                      ?.reduce(
                        (acc, item) => acc + (Number(item?.gstAmount) || 0),
                        0
                      )
                      .toLocaleString("en-IN")}
                  </div>
                </td>
                <td style={{ padding: "6px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <LiaRupeeSignSolid />
                    {invoice?.items
                      ?.reduce(
                        (acc, item) =>
                          acc +
                          ((Number(item?.quantity) || 0) *
                            (Number(item?.basePrice) || 0) +
                            (Number(item?.gstAmount) || 0)),
                        0
                      )
                      .toLocaleString("en-IN")}
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
            }}
          >
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
            <div style={{ marginTop: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>Taxable Amount</p>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <LiaRupeeSignSolid />
                  {Number(invoice?.taxableAmount).toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>CGST </p>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <LiaRupeeSignSolid />
                  {invoice?.cgst}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>SGST</p>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <LiaRupeeSignSolid />
                  {invoice?.sgst}
                </span>
              </div>

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
                  {Math.round(invoice?.totalAmount).toLocaleString("en-IN")}
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
                <span>{converter.toWords(total).toUpperCase()}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default InvoiceTemplate;
