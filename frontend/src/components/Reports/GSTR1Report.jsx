import { Download, Printer } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useBusinessStore } from "../../store/businessStore";
import { axiosInstance } from "../../config/axios";
import CustomLoader from "../Loader";
import not_found from "../../assets/not-found.png";
import { handlePaymentPrint, handlePrint } from "../../../helpers/print";
import { queryClient } from "../../main";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { downloadPDF } from "../../../helpers/downloadPdf";
import { getTotalTaxRate } from "../../../helpers/getGSTTaxRate";

const GSTR1Report = () => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const printRef = useRef();
  const { business } = useBusinessStore();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
  });
  const [sortType, setSortType] = useState("");
  const { isLoading, data: invoices } = useQuery({
    queryKey: ["invoices", dateRange],
    queryFn: async () => {
      const res = await axiosInstance.get(`/sales-invoice/${business?._id}`);
      return res.data;
    },
  });

  // INVOICES
  const searchedInvoices = useMemo(() => {
    if (!invoices?.invoices || !Array.isArray(invoices.invoices)) {
      return [];
    }

    const fromDate = dateRange?.from ? new Date(dateRange.from) : null;
    const toDate = dateRange?.to ? new Date(dateRange.to) : null;

    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    const byDate =
      fromDate && toDate
        ? invoices.invoices.filter((invoice) => {
            const invoiceDate = new Date(invoice?.salesInvoiceDate);
            return invoiceDate >= fromDate && invoiceDate <= toDate;
          })
        : [];

    const filteredInvoices = invoices.invoices.filter(
      (invoice) => invoice?.status !== "cancelled"
    );

    return byDate.length > 0 ? byDate : filteredInvoices;
  }, [invoices, dateRange]);

  // CANCEL INVOICE
  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/sales-invoice/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice cancelled successfully");
    },
  });

  return (
    <main className="w-full py-3 my-3  overflow-hidden">
      {/* TOP HEADER SECTION WITH CUSTOM DATE RANGE */}
      <header className="w-full flex items-center relative">
        <span className="text-sm font-semibold">Filter by : </span>
        <button
          className="btn btn-xs ml-2 relative btn-neutral rounded-xl"
          onClick={() => setOpenDatePicker(!openDatePicker)}
          id="datePickerButton"
        >
          Select Custom Date
        </button>

        {openDatePicker && (
          <div
            className="absolute z-[9999] bg-white shadow-lg rounded-md"
            style={{
              top: "100%",
              left: 0,
              marginTop: "6px",
            }}
          >
            <DayPicker
              selected={dateRange}
              onSelect={setDateRange}
              className="react-day-picker"
              mode="range"
            />
          </div>
        )}
        <div className="mx-5 ring-1 flex items-center gap-3 justify-center px-5 py-1 rounded-full text-zinc-800 bg-zinc-800/10 shadow-md shadow-zinc-300">
          <span className="text-xs">
            {dateRange?.from.toLocaleDateString()}
          </span>
          <span className="text-xs">-</span>
          <span className="text-xs">{dateRange?.to.toLocaleDateString()}</span>
        </div>
        <div>
          <button
            onClick={() => document.getElementById("report_popup").showModal()}
            className="btn btn-sm rounded-xl"
          >
            <Printer size={19} />
          </button>
        </div>
      </header>

      <div className="divider divider-sm" />

      {/* Page Sales Invoice Detail */}
      <section className="w-full">
        {/* TABLE WRAPPER */}
        <div className="border border-gray-300 rounded-md overflow-hidden w-full text-center">
          <div className="w-full overflow-y-auto">
            <table className="table table-zebra w-full text-center border border-gray-300 border-collapse">
              <thead
                style={{
                  backgroundColor: "#e4e4e7",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                <tr>
                  <th
                    colSpan="5"
                    className="text-center border border-gray-300"
                  >
                    Invoice Details
                  </th>
                  <th
                    rowSpan="2"
                    className="text-center border border-gray-300"
                  >
                    Tax Rate
                  </th>
                  <th
                    rowSpan="2"
                    className="text-center border border-gray-300"
                  >
                    Cess Rate
                  </th>
                  <th
                    rowSpan="2"
                    className="text-center border border-gray-300"
                  >
                    Taxable Value
                  </th>
                  <th
                    colSpan="4"
                    className="text-center border border-gray-300"
                  >
                    Amount
                  </th>
                  <th
                    rowSpan="2"
                    className="text-center border border-gray-300"
                  >
                    Place Of Supply (Name Of State)
                  </th>
                </tr>
                <tr>
                  <th className="border border-gray-300 text-center">
                    GSTIN/UIN
                  </th>
                  <th className="border border-gray-300 text-center">
                    Party Name
                  </th>
                  <th className="border border-gray-300 text-center">
                    Invoice No.
                  </th>
                  <th className="border border-gray-300 text-center">Date</th>
                  <th className="border border-gray-300 text-center">Value</th>

                  <th className="border border-gray-300 text-center">
                    Integrated Tax
                  </th>
                  <th className="border border-gray-300 text-center">
                    Central Tax
                  </th>
                  <th className="border border-gray-300 text-center">
                    State/UT Tax
                  </th>
                  <th className="border border-gray-300 text-center">Cess</th>
                </tr>
              </thead>

              <tbody className="text-xs text-center">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="border border-gray-300 p-4 text-center"
                    >
                      <div className="flex items-center justify-center py-8">
                        <CustomLoader text={"Loading..."} />
                      </div>
                    </td>
                  </tr>
                ) : searchedInvoices?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="border border-gray-300 p-4 text-center"
                    >
                      <div className="flex items-center justify-center flex-col">
                        <img
                          src={not_found}
                          alt="not_found"
                          width={250}
                          loading="lazy"
                        />
                        <h3 className="font-semibold">
                          No matching items found
                        </h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {searchedInvoices?.map((invoice) => (
                      <tr
                        key={invoice?._id}
                        className="cursor-pointer hover:bg-gray-50 border border-gray-300"
                      >
                        <td className="border border-gray-300 p-2">
                          {invoice?.partyId?.GSTIN || "-"}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {invoice?.partyName || "-"}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {invoice?.salesInvoiceNumber || "-"}
                        </td>
                        <td className="border border-gray-300 p-2 text-nowrap">
                          {invoice?.salesInvoiceDate?.split("T")[0] || "-"}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {Number(invoice?.totalAmount || 0).toLocaleString(
                            "en-IN"
                          )}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {invoice?.items
                            ?.map((item) =>
                              getTotalTaxRate(item?.gstTaxRate || "")
                            )
                            .toLocaleString("en-IN")}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {Number(invoice?.CessRate || 0).toLocaleString(
                            "en-IN"
                          )}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {Number(invoice?.taxableAmount || 0).toLocaleString(
                            "en-IN"
                          )}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {Number(invoice?.integratedTax || 0).toLocaleString(
                            "en-IN"
                          )}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {Number(invoice?.cgst || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {Number(invoice?.sgst || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {Number(invoice?.Cess || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {invoice?.partyId?.state || "-"}
                        </td>
                      </tr>
                    ))}

                    {/* Total Row */}
                    <tr className="font-semibold bg-gray-200 text-zinc-600">
                      <td
                        colSpan={4}
                        className="border border-gray-300 text-center p-2 font-bold "
                      >
                        Total
                      </td>
                      <td className="border border-gray-300 p-2">
                        {Number(
                          searchedInvoices?.reduce(
                            (sum, i) => sum + Number(i?.totalAmount || 0),
                            0
                          )
                        ).toLocaleString("en-IN")}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {Number(
                          searchedInvoices?.reduce(
                            (sum, i) => sum + Number(i?.gstTaxRate || 0),
                            0
                          )
                        ).toLocaleString("en-IN")}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {Number(
                          searchedInvoices?.reduce(
                            (sum, i) => sum + Number(i?.CessRate || 0),
                            0
                          )
                        ).toLocaleString("en-IN")}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {Number(
                          searchedInvoices?.reduce(
                            (sum, i) => sum + Number(i?.taxableAmount || 0),
                            0
                          )
                        ).toLocaleString("en-IN")}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {Number(
                          searchedInvoices?.reduce(
                            (sum, i) => sum + Number(i?.integratedTax || 0),
                            0
                          )
                        ).toLocaleString("en-IN")}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {Number(
                          searchedInvoices?.reduce(
                            (sum, i) => sum + Number(i?.cgst || 0),
                            0
                          )
                        ).toLocaleString("en-IN")}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {Number(
                          searchedInvoices?.reduce(
                            (sum, i) => sum + Number(i?.sgst || 0),
                            0
                          )
                        ).toLocaleString("en-IN")}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {Number(
                          searchedInvoices?.reduce(
                            (sum, i) => sum + Number(i?.Cess || 0),
                            0
                          )
                        ).toLocaleString("en-IN")}
                      </td>
                      <td className="border border-gray-300 p-2"></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* GSTR1-REPORT POPUP MODAL */}
      <dialog id="report_popup" className="modal">
        <div className="modal-box w-11/12 max-w-7xl">
          <div className="modal-action sticky top-0 z-10 mb-10 w-full">
            <form method="dialog">
              <button className="btn btn-sm shadow rounded-xl">Close</button>
            </form>
            <button
              onClick={() =>
                downloadPDF("gstr1_report", "gstr1_report", setIsDownloading)
              }
              className="btn rounded-xl btn-sm bg-[var(--primary-btn)] shadow"
            >
              {isDownloading ? (
                <div className="">
                  <CustomLoader text={""} />
                </div>
              ) : (
                <>
                  <Download size={14} />
                </>
              )}
            </button>
            <button
              onClick={() => handlePaymentPrint(printRef)}
              className="btn rounded-xl btn-sm bg-[var(--primary-btn)] shadow"
            >
              Print
            </button>
          </div>
          {/* INVOICE TO DOWNLOAD */}

          {/* <GSTR1ReportTemplate id="gstr1_report" ref={printRef} date={dateRange}/> */}

          <div
            id="gstr1_report"
            ref={printRef}
            style={{
              fontFamily: "Arial, sans-serif",
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                textDecoration: "underline",
                fontWeight: "bold",
                fontSize: "18px",
                marginTop: "20px",
              }}
            >
              GSTR1 Report
            </h1>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "8px 12px",
                  marginTop: "10px",
                  fontWeight: 500,
                }}
              >
                Period: {dateRange?.from?.toLocaleDateString("en-GB")} to{" "}
                {dateRange?.to?.toLocaleDateString("en-GB")}
              </div>
            </div>

            {/* Business Info Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
                marginTop: "15px",
                border: "1px solid #ccc",
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      fontWeight: 600,
                      width: "50%",
                    }}
                  >
                    1. GSTIN
                  </td>
                  <td style={{ padding: "8px" }}>
                    {business?.gstNumber || "-"}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      fontWeight: 600,
                    }}
                  >
                    2.a Legal name of the registered person
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {business?.businessName || "-"}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      fontWeight: 600,
                    }}
                  >
                    2.b Trade name, if any
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}></td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      fontWeight: 600,
                    }}
                  >
                    3.a Aggregate Turnover in preceding FY
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}></td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      fontWeight: 600,
                    }}
                  >
                    3.b Aggregate Turnover, April to June 2017
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}></td>
                </tr>
              </tbody>
            </table>
            {/* Sale Table */}
            <h1
              style={{
                textAlign: "center",
                textDecoration: "underline",
                fontWeight: "bold",
                fontSize: "16px",
                marginTop: "25px",
                marginBottom: "10px",
              }}
            >
              Sale
            </h1>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "center",
                  fontSize: "12px",
                  border: "1px solid #ccc",
                }}
              >
                <thead>
                  <tr style={{ background: "#f3f4f6", fontWeight: 600 }}>
                    <th
                      rowSpan="2"
                      style={{ border: "1px solid #ccc", padding: "6px" }}
                    >
                      GSTIN/UIN
                    </th>
                    <th
                      colSpan="3"
                      style={{ border: "1px solid #ccc", padding: "6px" }}
                    >
                      Invoice details
                    </th>
                    <th
                      rowSpan="2"
                      style={{ border: "1px solid #ccc", padding: "6px" }}
                    >
                      Rate
                    </th>
                    <th
                      rowSpan="2"
                      style={{ border: "1px solid #ccc", padding: "6px" }}
                    >
                      Cess Rate
                    </th>
                    <th
                      rowSpan="2"
                      style={{ border: "1px solid #ccc", padding: "6px" }}
                    >
                      Taxable Value
                    </th>
                    <th
                      colSpan="4"
                      style={{ border: "1px solid #ccc", padding: "6px" }}
                    >
                      Amount
                    </th>
                    <th
                      rowSpan="2"
                      style={{ border: "1px solid #ccc", padding: "6px" }}
                    >
                      Place of Supply (Name Of State)
                    </th>
                  </tr>
                  <tr style={{ background: "#f3f4f6", fontWeight: 600 }}>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      No.
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Date
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Value
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Integrated Tax
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Central Tax
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      State/UT Tax
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Cess
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="12"
                        style={{ border: "1px solid #ccc", padding: "6px" }}
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : (searchedInvoices?.length || 0) === 0 ? (
                    <tr>
                      <td
                        colSpan="12"
                        style={{ border: "1px solid #ccc", padding: "6px" }}
                      >
                        No matching items found
                      </td>
                    </tr>
                  ) : (
                    <>
                      {(searchedInvoices || []).map((invoice) => (
                        <tr key={invoice?._id}>
                          <td
                            style={{ border: "1px solid #ccc", padding: "6px" }}
                          >
                            {invoice?.partyId?.GSTIN || "-"}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "6px" }}
                          >
                            {invoice?.salesInvoiceNumber || "-"}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "6px" }}
                          >
                            {invoice?.salesInvoiceDate?.split("T")[0] || "-"}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "6px" }}
                          >
                            {Number(invoice?.totalAmount || 0).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "6px" }}
                          >
                            {Number(invoice?.balanceAmount || 0).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "6px" }}
                          >
                            {Number(invoice?.CessRate || 0).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "6px" }}
                          >
                            {Number(invoice?.taxableAmount || 0).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "6px" }}
                          >
                            {Number(invoice?.integratedTax || 0).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "6px" }}
                          >
                            {Number(invoice?.cgst || 0).toLocaleString("en-IN")}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "6px" }}
                          >
                            {Number(invoice?.sgst || 0).toLocaleString("en-IN")}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "6px" }}
                          >
                            {Number(invoice?.CessRate || 0).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td
                            style={{ border: "1px solid #ccc", padding: "6px" }}
                          >
                            {invoice?.partyId?.state || "-"}
                          </td>
                        </tr>
                      ))}

                      {/*  Total Row */}
                      <tr style={{ background: "#f3f4f6", fontWeight: "bold" }}>
                        <td
                          colSpan="3"
                          style={{
                            border: "1px solid #ccc",
                            padding: "6px",
                            textAlign: "right",
                          }}
                        >
                          Total:
                        </td>
                        <td
                          style={{ border: "1px solid #ccc", padding: "6px" }}
                        >
                          {Number(
                            (searchedInvoices || []).reduce(
                              (sum, i) => sum + (Number(i?.totalAmount) || 0),
                              0
                            )
                          ).toLocaleString("en-IN")}
                        </td>
                        <td
                          style={{ border: "1px solid #ccc", padding: "6px" }}
                        ></td>
                        <td
                          style={{ border: "1px solid #ccc", padding: "6px" }}
                        ></td>
                        <td
                          style={{ border: "1px solid #ccc", padding: "6px" }}
                        >
                          {Number(
                            (searchedInvoices || []).reduce(
                              (sum, i) => sum + (Number(i?.taxableAmount) || 0),
                              0
                            )
                          ).toLocaleString("en-IN")}
                        </td>
                        <td
                          style={{ border: "1px solid #ccc", padding: "6px" }}
                        >
                          {Number(
                            (searchedInvoices || []).reduce(
                              (sum, i) => sum + (Number(i?.integratedTax) || 0),
                              0
                            )
                          ).toLocaleString("en-IN")}
                        </td>
                        <td
                          style={{ border: "1px solid #ccc", padding: "6px" }}
                        >
                          {Number(
                            (searchedInvoices || []).reduce(
                              (sum, i) => sum + (Number(i?.cgst) || 0),
                              0
                            )
                          ).toLocaleString("en-IN")}
                        </td>
                        <td
                          style={{ border: "1px solid #ccc", padding: "6px" }}
                        >
                          {Number(
                            (searchedInvoices || []).reduce(
                              (sum, i) => sum + (Number(i?.sgst) || 0),
                              0
                            )
                          ).toLocaleString("en-IN")}
                        </td>
                        <td
                          style={{ border: "1px solid #ccc", padding: "6px" }}
                        >
                          {Number(
                            (searchedInvoices || []).reduce(
                              (sum, i) => sum + (Number(i?.CessRate) || 0),
                              0
                            )
                          ).toLocaleString("en-IN")}
                        </td>
                        <td
                          style={{ border: "1px solid #ccc", padding: "6px" }}
                        ></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            {/* Sales Return Section */}
            <h2
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textDecoration: "underline",
                fontWeight: "bold",
                fontSize: "18px",
                marginTop: "20px",
                marginBottom: "8px",
              }}
            >
              Sale Return
            </h2>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      GSTIN/UIN
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Cr. Note details
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Value
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Rate
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Cess Rate
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Taxable Value
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Integrated Tax
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Central Tax
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      State/UT Tax
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Cess
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                      Place of Supply (Name of State)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Example dynamic rows can go here if available */}
                  {/* Example:
                                        {salesReturnData?.map((item, i) => (
                                          <tr key={i}>
                                            <td style={{ border: "1px solid #ccc", padding: "4px" }}>{item.gstin}</td>
                                                ...
                                            </tr>
                                          ))}
                                     */}

                  {/* Total Row */}
                  <tr style={{ backgroundColor: "#fafafa" }}>
                    <td
                      colSpan="10"
                      style={{
                        border: "1px solid #ccc",
                        padding: "6px",
                        textAlign: "right",
                        fontWeight: "600",
                      }}
                    >
                      Total
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "6px",
                        fontWeight: "600",
                      }}
                    >
                      0
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </dialog>
    </main>
  );
};

export default GSTR1Report;
