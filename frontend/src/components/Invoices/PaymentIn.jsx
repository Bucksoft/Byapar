import { FaIndianRupeeSign } from "react-icons/fa6";
import converter from "number-to-words";

const PaymentInTemplate = ({ data, id, printRef }) => {
  const total =
    data?.invoices &&
    data?.invoices.reduce((acc, invoice) => acc + invoice?.settledAmount, 0);
  return (
    <main
      id={id}
      style={{ width: "100%", fontFamily: "Arial, sans-serif" }}
      ref={printRef}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontWeight: 500 }}>Business Name</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "80px",
            gap: "8px",
          }}
        >
          <span style={{ fontWeight: 500, padding: "8px 0" }}>
            Receipt Voucher
          </span>
          <p
            style={{
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            Payment Number <span>{data?.paymentIn?.paymentInNumber}</span>
          </p>
          <p
            style={{
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
              gap: "64px",
            }}
          >
            Payment Date:{" "}
            <span>{data?.paymentIn?.paymentDate.split("T")[0]}</span>
          </p>
          <p
            style={{
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            Payment Mode: <span>{data?.paymentIn?.paymentMode}</span>
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          fontSize: "14px",
          marginTop: "12px",
        }}
      >
        <span
          style={{
            border: "1px solid #e4e4e7",
            padding: "4px",
            width: "120px",
            fontSize: "12px",
            textAlign: "center",
            borderRadius: "4px",
            backgroundColor: "#e4e4e7",
          }}
        >
          PAYMENT FROM
        </span>
        <span>{data?.paymentIn?.partyId?.partyName}</span>
        <span
          style={{
            border: "1px solid #e4e4e7",
            padding: "4px",
            width: "120px",
            fontSize: "12px",
            textAlign: "center",
            borderRadius: "4px",
            backgroundColor: "#e4e4e7",
          }}
        >
          RECEIPT FOR
        </span>
      </div>

      {/* TABLE */}
      <div style={{ overflowX: "auto", paddingTop: "20px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#d4d4d8", fontSize: "12px" }}>
              <th style={{ padding: "6px" }}>#</th>
              <th style={{ padding: "6px" }}>INVOICE NUMBER</th>
              <th style={{ padding: "6px" }}>INVOICE DATE</th>
              <th style={{ padding: "6px" }}>INVOICE AMOUNT</th>
              <th style={{ padding: "6px" }}>PAYMENT AMOUNT</th>
              <th style={{ padding: "6px" }}>TDS</th>
              <th style={{ padding: "6px" }}>BALANCE DUE</th>
            </tr>
          </thead>
          <tbody>
            {data?.invoices &&
              data?.invoices?.map((invoice, index) => (
                <tr key={index}>
                  <td style={{ padding: "6px", textAlign: "center" }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "6px", textAlign: "center" }}>
                    {invoice?.salesInvoiceNumber}
                  </td>
                  <td style={{ padding: "6px", textAlign: "center" }}>
                    {invoice?.salesInvoiceDate.split("T")[0]}
                  </td>
                  <td style={{ padding: "6px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaIndianRupeeSign style={{ color: "#71717a" }} />
                      {invoice?.totalAmount}
                    </div>
                  </td>
                  <td style={{ padding: "6px", textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaIndianRupeeSign style={{ color: "#71717a" }} />
                      {invoice?.settledAmount}
                    </div>
                  </td>
                  <td style={{ padding: "6px", textAlign: "center" }}>
                    {invoice?.TDS || "0"}
                  </td>
                  <td style={{ padding: "6px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaIndianRupeeSign style={{ color: "#71717a" }} />
                      {invoice?.pendingAmount}
                    </div>
                  </td>
                </tr>
              ))}

            <tr style={{ backgroundColor: "#d4d4d8" }}>
              <th></th>
              <td></td>
              <td></td>
              <td
                style={{
                  fontWeight: 600,
                  textAlign: "center",
                  padding: "5px 0px",
                }}
              >
                TOTAL
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaIndianRupeeSign style={{ color: "#71717a" }} /> {total}
                </div>
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "32px",
          }}
        >
          <div>
            <p
              style={{
                display: "flex",
                fontSize: "14px",
                paddingBottom: "8px",
              }}
            >
              <span style={{ paddingRight: "20px", display: "flex" }}>
                Total
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                }}
              >
                <FaIndianRupeeSign size={14} />
                {data?.invoices &&
                  data?.invoices.reduce(
                    (acc, invoice) => acc + invoice?.settledAmount,
                    0
                  )}
              </span>
            </p>
            <span style={{ fontSize: "14px" }}>Amount Paid In Word</span>
            <p style={{ fontWeight: 600, fontSize: "14px" }}>
              {converter.toWords(Number(total || 0)).toUpperCase()}{" "}
              <span style={{ textTransform: "uppercase" }}>Rupees</span>
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "14px",
            }}
          >
            <span>Authorized signature for </span>
            <span>Business Name</span>
            <div
              style={{
                border: "1px solid #000",
                width: "320px",
                height: "100px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentInTemplate;
