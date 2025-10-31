import { Italic } from "lucide-react";
import { BsTelephone } from "react-icons/bs";
import { LiaRupeeSignSolid } from "react-icons/lia";

const DefaultTemplate = ({ color, textColor, checkBoxSetting }) => {
  const themeColor = color || "#1C398E";
  const fontColor = "#000";
  const headerTextColor = textColor || "#fff";

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "800px",
        margin: "0 auto",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
        color: fontColor,
        backgroundColor: "#fff",
        fontSize: "14px",
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
            fontWeight: "600",
            border: "1px solid #000", // Border color & thickness
            borderRadius: "8px", // Small rounded corners
            padding: "16px 16px", // Space around text
            display: "inline-block", // Shrinks border to fit text
          }}
        >
          Logo
        </div>
        <div>
          <p style={{ fontWeight: "700" }}>TAX INVOICE</p>
          <p>Original Copy</p>
          {checkBoxSetting.showTime && <p>10.45 AM</p>}
        </div>
      </div>

      {/* Company Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div style={{ width: "60%" }}>
          <p>
            <b>Buck Softech Private Limited</b>
          </p>
          <p>Old H B Road, Chunn Bhatta Kokar Ranchi, Jharkhand</p>
          <p>GSTIN: 20AAICB3058Q1ZI</p>
          <p>Email: bucksoftech@gmail.com</p>

          {checkBoxSetting.showPhone && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <BsTelephone />
              <p>9304645285</p>
            </div>
          )}
        </div>

        {/* Invoice Info */}
        <div
          style={{
            textAlign: "right",
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div style={{ fontWeight: "bold", textAlign: "left" }}>
            <p>Invoice No:</p>
            <p>Invoice Date:</p>
            <p>Due Date:</p>
          </div>
          <div>
            <p> AABBCCDD/202</p>
            <p> 17/01/2023</p>
            <p> 16/02/2023</p>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: `2px solid ${themeColor}`,
          marginTop: "6px",
        }}
      ></div>

      {/* Bill To & Ship To */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            checkBoxSetting.poNumber ||
            checkBoxSetting.eWayBillNo ||
            checkBoxSetting.vechileNumber
              ? "1fr 1fr 1fr" // 3 columns if any of these are checked
              : "1fr 1fr", // default 2 columns
          marginTop: "20px",
          gap: "10px",
        }}
      >
        {/* ===== Bill To ===== */}
        {checkBoxSetting.billTo && (
          <div style={{ padding: "8px" }}>
            <h3 style={{ fontWeight: "600", marginBottom: "4px" }}>Bill To</h3>
            <p>
              <b>Sample Party</b>
            </p>
            <p>
              No F2, Outer Circle, Connaught Circus, New Delhi, DELHI 110001
            </p>
            <p>
              <b>Mobile:</b> 7400417400
            </p>
            <p>
              <b>GSTIN:</b> 07ABCCH2702H4ZZ
            </p>
          </div>
        )}

        {/* ===== Ship To ===== */}
        {checkBoxSetting.shipTo && (
          <div style={{ padding: "8px" }}>
            <h3 style={{ fontWeight: "600", marginBottom: "4px" }}>Ship To</h3>
            <p>1234123 324324234, Bengaluru</p>
          </div>
        )}

        {/* ===== Third Section (PO, E-way, Vehicle) ===== */}
        {(checkBoxSetting.poNumber ||
          checkBoxSetting.eWayBillNo ||
          checkBoxSetting.vechileNumber) && (
          <div style={{ padding: "8px" }}>
            {checkBoxSetting.poNumber && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: "600" }}>
                  <p>PO Number:</p>
                </div>
                <div>
                  <p>PO12345</p>
                </div>
              </div>
            )}

            {checkBoxSetting.eWayBillNo && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: "600" }}>
                  <p>E-Way Bill No.:</p>
                </div>
                <div>
                  <p>12345</p>
                </div>
              </div>
            )}

            {checkBoxSetting.vechileNumber && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: "600" }}>
                  <p>Vehicle No.:</p>
                </div>
                <div>
                  <p>JH02AM 0472</p>
                </div>
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
        }}
      >
        <thead
          style={{
            backgroundColor: themeColor,
            color: headerTextColor,
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
            {checkBoxSetting.showQty && (
              <th style={{ padding: "8px", fontWeight: "600" }}>Qty.</th>
            )}
            {checkBoxSetting.showRate && (
              <th style={{ padding: "8px", fontWeight: "600" }}>Rate</th>
            )}
            <th style={{ padding: "8px", fontWeight: "600" }}>Taxable Value</th>
            <th style={{ padding: "8px", fontWeight: "600" }}>CGST</th>
            <th style={{ padding: "8px", fontWeight: "600" }}>SGST</th>
            <th style={{ padding: "8px", fontWeight: "600" }}>Amount</th>
          </tr>
        </thead>

        <tbody>
          {/* Example Row */}
          <tr>
            <td style={{ padding: "8px" }}>1</td>
            <td style={{ padding: "8px" }}>
              Samsung A30
              {checkBoxSetting.showItemDesc && (
                <p style={{ fontSize: "12px", color: "#555" }}>
                  {" "}
                  samsung phone
                </p>
              )}
            </td>
            <td style={{ padding: "8px" }}>1234</td>
            {checkBoxSetting.showQty && (
              <td style={{ padding: "8px" }}>1 PCS</td>
            )}
            {checkBoxSetting.showRate && (
              <td style={{ padding: "8px" }}>10,000</td>
            )}
            <td style={{ padding: "8px" }}>10000</td>
            <td style={{ padding: "8px" }}>
              900
              {checkBoxSetting.showItemDesc && (
                <p style={{ fontSize: "12px", color: "#555" }}> 9%</p>
              )}
            </td>
            <td style={{ padding: "8px" }}>
              900
              {checkBoxSetting.showItemDesc && (
                <p style={{ fontSize: "12px", color: "#555" }}> 9%</p>
              )}
            </td>
            <td style={{ padding: "8px" }}>11,800</td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>2</td>
            <td style={{ padding: "8px" }}>
              Samsung A30
              {checkBoxSetting.showItemDesc && (
                <p style={{ fontSize: "12px", color: "#555" }}>
                  {" "}
                  samsung phone
                </p>
              )}
            </td>
            <td style={{ padding: "8px" }}>1234</td>
            {checkBoxSetting.showQty && (
              <td style={{ padding: "8px" }}>1 PCS</td>
            )}
            {checkBoxSetting.showRate && (
              <td style={{ padding: "8px" }}>10,000</td>
            )}
            <td style={{ padding: "8px" }}>10000</td>
            <td style={{ padding: "8px" }}>
              900
              {checkBoxSetting.showItemDesc && (
                <p style={{ fontSize: "12px", color: "#555" }}> 9%</p>
              )}
            </td>
            <td style={{ padding: "8px" }}>
              900
              {checkBoxSetting.showItemDesc && (
                <p style={{ fontSize: "12px", color: "#555" }}> 9%</p>
              )}
            </td>
            <td style={{ padding: "8px" }}>11,800</td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>3</td>
            <td style={{ padding: "8px" }}>
              Samsung A30
              {checkBoxSetting.showItemDesc && (
                <p style={{ fontSize: "12px", color: "#555" }}>
                  {" "}
                  samsung phone
                </p>
              )}
            </td>
            <td style={{ padding: "8px" }}>1234</td>
            {checkBoxSetting.showQty && (
              <td style={{ padding: "8px" }}>1 PCS</td>
            )}
            {checkBoxSetting.showRate && (
              <td style={{ padding: "8px" }}>10,000</td>
            )}
            <td style={{ padding: "8px" }}>10000</td>
            <td style={{ padding: "8px" }}>
              900
              {checkBoxSetting.showItemDesc && (
                <p style={{ fontSize: "12px", color: "#555" }}> 9%</p>
              )}
            </td>
            <td style={{ padding: "8px" }}>
              900
              {checkBoxSetting.showItemDesc && (
                <p style={{ fontSize: "12px", color: "#555" }}> 9%</p>
              )}
            </td>
            <td style={{ padding: "8px" }}>11,800</td>
          </tr>

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

            {checkBoxSetting.showQty && (
              <td style={{ padding: "8px" }}>3 PCS</td>
            )}
            {checkBoxSetting.showRate && <td style={{ padding: "8px" }}></td>}
            <td style={{ padding: "8px" }}></td>
            <td style={{ padding: "8px" }}></td>
            <td style={{ padding: "8px" }}></td>
            <td style={{ padding: "8px" }}>35,400</td>
          </tr>
        </tbody>
      </table>

      {/* Account and Taxes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <div style={{ marginTop: "30px" }}>
          <p style={{ fontWeight: "550" }}>
            Account Holder Name:{" "}
            <span style={{ fontWeight: "50" }}>SHIVSHAKTI ENTERPRISES</span>
          </p>
          <p style={{ fontWeight: "550" }}>
            Bank Name: <span style={{ fontWeight: "50" }}>SBI</span>
          </p>
          <p style={{ fontWeight: "550" }}>
            Account Number:{" "}
            <span style={{ fontWeight: "50" }}>41452481808</span>
          </p>
          <p style={{ fontWeight: "550" }}>
            Branch Name: <span style={{ fontWeight: "50" }}>MOHRABADI</span>
          </p>
          <p style={{ fontWeight: "550" }}>
            IFSC Code: <span style={{ fontWeight: "50" }}>SBIN0016002</span>
          </p>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p>Taxable Amount:</p>
              <p>Discount On Total:</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p>₹ 35400</p>
              <p>₹ 100</p>
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
            <span>Total Amount:</span> <span>₹ 35300</span>
          </p>
          <hr style={{ margin: "8px 0", border: `1px solid ${themeColor}` }} />
          <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Received Amount: </span>
            <span>₹ 10000</span>
          </p>
          <p
            style={{
              fontWeight: "700",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {" "}
            <span>Balance:</span> <span>₹ 25400</span>
          </p>

          {checkBoxSetting.showPartyBalance && (
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
          )}

          <div style={{ textAlign: "right", marginTop: "24px" }}>
            <p style={{ fontWeight: "700" }}>Total Amount (in words)</p>
            <p>Thirty Five Thousand Three Hundred Rupees</p>
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
          <h3 style={{ fontWeight: "600", marginBottom: "10px" }}>
            Terms & Conditions
          </h3>
          <ol style={{}}>
            {/* <li>Goods once sold will not be taken back or exchanged</li> */}
            <li
              style={{
                fontStyle: "italic",
                fontSize: "12px",
                marginBottom: "5px",
              }}
            >
              # ALL LEGAL ISSUES UNDER THE JURIDICTION OF JHARKHAND GOVERNMENT.
            </li>
            <li
              style={{
                fontStyle: "italic",
                fontSize: "12px",
                marginBottom: "5px",
              }}
            >
              # WE DECLARE THAT THIS INVOICE SHOWS THE ACTUAL PRICE OF THE GOODS{" "}
            </li>
            <li
              style={{
                fontStyle: "italic",
                fontSize: "12px",
                marginBottom: "5px",
                marginLeft: "10px",
              }}
            >
              DESCRIBED AND THAT ALL PARTICULARS ARE TRUE AND CORRECT.
            </li>
          </ol>
        </div>

        <div>
          <div
            style={{
              fontWeight: "600",
              borderBottom: "1px solid #000",
              padding: "16px 10px",
              width: "100%",
              display: "inline-block",
              marginTop: "10px",
            }}
          ></div>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "100px",
            }}
          >
            SHIVSHAKTI ENTERPRISES
          </p>
        </div>
      </div>
    </div>
  );
};

export default DefaultTemplate;
