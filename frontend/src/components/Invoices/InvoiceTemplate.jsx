import { BsTelephone } from "react-icons/bs";
import { useBusinessStore } from "../../store/businessStore";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { numberToWords } from "../../../helpers/numToWords";
import { useEffect, useRef } from "react";

const InvoiceTemplate = ({
  color,
  textColor,
  title,
  invoice,
  setInvoiceIdToDownload,
}) => {
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
        style={{
          backgroundColor: "#ffffff",
          borderColor: "#e4e4e7",
        }}
        className="max-w-3xl w-full mx-auto p-4 border "
      >
        {/* Party name */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">{business?.businessName}</h2>
          <h1 className="uppercase">Tax Invoice</h1>
        </div>

        <div
          style={{
            color: "#3f3f46",
          }}
          className="mt-5 flex gap-2 items-center  text-sm"
        >
          <BsTelephone className="text-info" />
          {business?.companyPhoneNo}
        </div>

        <span className="divider" />

        {/* Displaying invoice information like invoice date and invoice number */}
        <section className="flex items-center gap-10 text-xs">
          <div>
            <p
              style={{
                color: "#00bafe",
              }}
              className="font-semibold"
            >
              Invoice No.
            </p>
            <span>{invoice?.salesInvoiceNumber}</span>
          </div>
          <div>
            <p
              style={{
                color: "#00bafe",
              }}
              className="font-semibold "
            >
              Invoice Date
            </p>
            <span>{invoice?.salesInvoiceDate?.split("T")[0]}</span>
          </div>
        </section>

        <span className="divider" />

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
          <table
            style={{
              borderColor: "#e4e4e7",
            }}
            className="table table-xs mt-5 w-full border "
          >
            {/* head */}
            <thead>
              <tr
                style={{
                  backgroundColor: "#f4f4f5",
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
                <tr key={index} className="">
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
                  borderColor: "#d4d4d8",
                  backgroundColor: "#fafafa",
                }}
                className="font-semibold border-t"
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
          <div className="divider" />
          <section className="grid grid-cols-2 text-xs mt-24">
            <div className="mt-4">
              {invoice?.termsAndCondition && (
                <div>
                  <h4 className="font-medium">Terms & Conditions</h4>
                  <span>{invoice?.termsAndCondition}</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p>Taxable Amount</p>
                <span className="flex items-center">
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
              <div className="h-[0.5px] my-3 w-full bg-info" />
              <div
                style={{
                  color: "#52525c",
                }}
                className="flex items-center justify-between font-semibold text-lg "
              >
                <p>Total Amount</p>
                <span>{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="h-[0.5px] my-3 w-full bg-info" />
              <div
                style={{
                  color: "#52525c",
                }}
                className="flex items-center justify-between  text-xs "
              >
                <p>Received Amount</p>
                <span className="flex items-center">
                  {" "}
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
                  {numberToWords(total)}
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
