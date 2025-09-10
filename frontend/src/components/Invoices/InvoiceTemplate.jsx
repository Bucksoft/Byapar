import { BsTelephone } from "react-icons/bs";
import { useBusinessStore } from "../../store/businessStore";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useEffect, useRef } from "react";
import converter from "number-to-words";

const InvoiceTemplate = ({ type, color, invoice, setInvoiceIdToDownload }) => {
  const { business } = useBusinessStore();
  const invoiceIdToDownload = useRef();

  useEffect(() => {
    setInvoiceIdToDownload(invoiceIdToDownload.current.id);
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
    <main className="flex w-full h-screen">
      <div
        ref={invoiceIdToDownload}
        id="invoice"
        className="max-w-3xl h-screen bg-white mx-auto p-4 shadow-lg shadow-zinc-500"
      >
        {/* Party name */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">{business?.businessName}</h2>
          <h1 className="uppercase">
            {type === "Sales Return"
              ? "Sales Return"
              : type === "Sales Invoice"
              ? "Sales Invoice"
              : type === "Quotation"
              ? "Quotation"
              : ""}
          </h1>
        </div>
        <div
          style={{
            color: "#3f3f46",
          }}
          className="mt-5 flex gap-2 items-center  text-sm"
        >
          <span
            style={{
              color: color,
            }}
          >
            <BsTelephone />
          </span>
          {business?.companyPhoneNo}
        </div>
        <span className="divider divider-neutral" />
        {/* Displaying invoice information like invoice date and invoice number */}
        <section className="flex items-center gap-10 text-xs  px-3">
          <div>
            <p
              style={{
                color: color,
              }}
              className="font-semibold"
            >
              {type === "Sales Return"
                ? "Sales Return No."
                : type === "Sales Invoice"
                ? "Invoice No."
                : type === "Quotation"
                ? "Quotation No."
                : ""}
            </p>
            <span>
              {type === "Sales Return"
                ? invoice?.salesReturnNumber
                : type === "Sales Invoice"
                ? invoice?.salesInvoiceNumber
                : type === "Quotation"
                ? invoice?.quotationNumber
                : ""}
            </span>
          </div>
          <div>
            <p
              style={{
                color: color,
              }}
              className="font-semibold "
            >
              {type === "Sales Return"
                ? "Sales Return Date"
                : type === "Sales Invoice"
                ? "Sales Invoice Date"
                : type === "Quotation"
                ? "Quotation Date"
                : ""}
            </p>
            <span>
              {type === "Sales Return"
                ? invoice?.salesReturnDate?.split("T")[0]
                : type === "Sales Invoice"
                ? invoice?.salesInvoiceDate?.split("T")[0]
                : type === "Quotation"
                ? invoice?.quotationDate?.split("T")[0]
                : ""}
            </span>
          </div>
        </section>

        <span
          className={`divider divider-neutral`}
          style={{
            color: color,
          }}
        />

        {/* Party Details */}
        <section className="text-sm">
          <h3 className="font-semibold">Bill To</h3>
          <p>{invoice?.partyId?.partyName}</p>
          <p className="font-semibold">
            Mobile{" "}
            <span className="font-normal">
              {invoice?.partyId?.mobileNumber}
            </span>
          </p>
        </section>
        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="table table-xs mt-5 w-full  ">
            {/* head */}
            <thead>
              <tr
                style={{
                  backgroundColor: color,
                }}
              >
                <th>No</th>
                <th>Items</th>
                <th>Qty.</th>
                <th>Rate</th>
                <th>Tax</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.items?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.itemName}</td>
                  <td>{item?.quantity}</td>
                  <td>
                    <div className="flex items-center">
                      <LiaRupeeSignSolid />
                      {Number(item?.basePrice || 0).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <LiaRupeeSignSolid />
                      {Number(item?.gstAmount || 0).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-end">
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
              <tr
                style={{
                  borderColor: color,
                  backgroundColor: "#e1e1e3",
                }}
                className="font-semibold "
              >
                <td></td>
                <td>Subtotal</td>
                <td>
                  {invoice?.items?.reduce(
                    (acc, item) => acc + (Number(item?.quantity) || 0),
                    0
                  )}
                </td>
                <td></td>
                <td>
                  <div className="flex items-center">
                    <LiaRupeeSignSolid />
                    {invoice?.items
                      ?.reduce(
                        (acc, item) => acc + (Number(item?.gstAmount) || 0),
                        0
                      )
                      .toLocaleString("en-IN")}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-end">
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

          {/* Footer section */}
          <div className="divider divider-neutral" />
          <section className="grid grid-cols-2 text-xs mt-3">
            <div className="mt-4">
              {invoice?.termsAndCondition && (
                <div>
                  <h4 className="font-semibold">Terms & Conditions</h4>
                  <p className="whitespace-pre-line">
                    {invoice?.termsAndCondition}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 ">
              <div className="flex items-center justify-between">
                <p>Taxable Amount</p>
                <span className="flex items-center ">
                  <LiaRupeeSignSolid />
                  {Number(invoice?.taxableAmount).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p>CGST </p>
                <span className="flex items-center">
                  <LiaRupeeSignSolid />
                  {invoice?.cgst}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p>SGST</p>
                <span className="flex items-center">
                  <LiaRupeeSignSolid />
                  {invoice?.sgst}
                </span>
              </div>
              <div
                className="h-[0.5px] my-3 w-full "
                style={{
                  backgroundColor: color,
                }}
              />
              <div
                style={{
                  color: "#52525c",
                }}
                className="flex items-center justify-between font-semibold text-lg "
              >
                <p>Total Amount</p>
                <span className="flex items-center">
                  <LiaRupeeSignSolid />
                  {Math.round(total).toLocaleString("en-IN")}
                </span>
              </div>
              <div
                className="h-[0.5px] my-3 w-full "
                style={{
                  backgroundColor: color,
                }}
              />
              <div
                style={{
                  color: "#52525c",
                }}
                className="flex items-center justify-between text-xs "
              >
                <p>Received Amount</p>
                <span className="flex items-center">
                  <LiaRupeeSignSolid /> {total.toLocaleString("en-IN")}
                </span>
              </div>
              <div
                style={{
                  color: "#52525c",
                }}
                className="flex font-semibold items-center justify-between  text-xs "
              >
                <p>Balance</p>
                <span className="flex items-center">
                  {" "}
                  <LiaRupeeSignSolid /> {0}
                </span>
              </div>
              <div
                style={{
                  color: "#52525c",
                }}
                className="flex flex-col mt-5  items-start justify-between text-xs "
              >
                <p className="font-semibold">Total Amount(in words)</p>
                <span className="flex items-center">
                  {" "}
                  {converter.toWords(total)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default InvoiceTemplate;
