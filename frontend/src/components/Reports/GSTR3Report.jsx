import { Download, Printer } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useBusinessStore } from "../../store/businessStore";
import { axiosInstance } from "../../config/axios";
import CustomLoader from "../Loader";
import not_found from "../../assets/not-found.png";
import { handlePrint } from "../../../helpers/print";
import { queryClient } from "../../main";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { downloadPDF } from "../../../helpers/downloadPdf";
import { getTotalTaxRate } from "../../../helpers/getGSTTaxRate";

const GSTR3Report = () => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const printRef = useRef();
  const { business } = useBusinessStore();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [sortType, setSortType] = useState("");
  const { isLoading, data: invoices } = useQuery({
    queryKey: ["invoices", dateRange],
    queryFn: async () => {
      const res = await axiosInstance.get(`/sales-invoice/${business?._id}`);
      return res.data;
    },
  });
  // SEARCH INVOICES
  const searchedInvoices = useMemo(() => {
    const byDate = invoices?.invoices.filter((invoice) => {
      return (
        new Date(invoice?.salesInvoiceDate) >= dateRange.from &&
        new Date(invoice?.salesInvoiceDate) <= dateRange.to
      );
    });
    const filteredInvoices =
      invoices?.invoices.length &&
      invoices?.invoices?.filter((invoice) => {
        return invoice?.status !== "cancelled";
      });

    if (byDate && byDate?.length > 0) {
      return byDate;
    }

    return filteredInvoices;
  });

  const totalAmount = searchedInvoices
    ?.filter((invoice) => invoice.status !== "cancelled")
    ?.reduce((acc, invoice) => {
      return (acc += invoice?.totalAmount);
    }, 0);


  const totalCGST = searchedInvoices
    ?.filter((invoice) => invoice.status !== "cancelled")
    ?.reduce((acc, invoice) => {
      return (acc += Number(invoice?.cgst));
    }, 0);


  const totalSGST = searchedInvoices
    ?.filter((invoice) => invoice.status !== "cancelled")
    ?.reduce((acc, invoice) => {
      return (acc += Number(invoice?.sgst));
    }, 0);

  // CANCEL INVOICE
  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/sales-invoice/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice cancelled successfully");
      5;
    },
  });

  let totalIgst = 0;

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

      <p>
        1. Details of outward supplies and inward supplies liable to reverse
        charge
      </p>
      <div className="my-5 border border-zinc-200 rounded-md overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-center border border-gray-300 border-collapse table ">
            <thead className="">
              <tr className="bg-gray-200">
                <th className="text-start">Nature Of Supplies</th>
                <th>Total Taxable Value</th>
                <th>Integrated Tax</th>
                <th>Central tax</th>
                <th>State/UT tax</th>
                <th>Cess</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex items-center justify-center py-8">
                      <CustomLoader text={"Loading..."} />
                    </div>
                  </td>
                </tr>
              ) : searchedInvoices?.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="border border-gray-300 p-4 text-center"
                  >
                    <div className="flex items-center justify-center flex-col">
                      <img
                        src={not_found}
                        alt="not_found"
                        width={250}
                        loading="lazy"
                      />

                      <h3 className="font-semibold">No matching items found</h3>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  <tr>
                    <td>
                      Outward taxable supplies (other than zero rated, nil rated
                      and exempted)
                    </td>
                    <td>{Number(totalAmount)?.toFixed(2)}</td>
                    <td>
                      {Number(totalIgst) > 0
                        ? Number(totalIgst)?.toFixed(2)
                        : 0}
                    </td>
                    <td>{Number(totalCGST)?.toFixed(2)}</td>
                    <td>{Number(totalSGST)?.toFixed(2)}</td>
                    <td>0</td>
                  </tr>

                  <tr>
                    <td>Outward taxable supplies (zero rated)</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>Other outward supplies (nil rated, exempted)</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>Inward supplies (liable to reverse charge)</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>Non-GST outward supplies</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p>
        2. Details of inter-State supplies made to unregistered persons,
        composition dealer and UIN holders
      </p>
      <div className="my-5 border border-zinc-200 rounded-md overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-center border border-gray-300 border-collapse table">
            <thead className="">
              <tr className="bg-gray-200">
                <th rowSpan="2">Place Of Supply (State/UT)</th>
                <th colSpan="2">Supplies Made To Unregistered Persons</th>
                <th colSpan="2">
                  Supplies Made To Composition Taxable Persons
                </th>
                <th colSpan="2">Supplies Made To UIN Holders</th>
              </tr>
              <tr className="bg-gray-200">
                <th>Total Taxable Value</th>
                <th>Amount Of Integrated Tax</th>
                <th>Total Taxable Value</th>
                <th>Amount Of Integrated Tax</th>
                <th>Total Taxable Value</th>
                <th>Amount Of Integrated Tax</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>

      <p>3. Details of eligible Input Tax Credit</p>
      <div className="my-5 border border-zinc-200 rounded-md overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-center border border-gray-300 border-collapse table">
            <thead className="">
              <tr className="bg-gray-200">
                <th>Details</th>
                <th>Integrated Tax</th>
                <th>Central Tax</th>
                <th>State/UT Tax</th>
                <th>Cess</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pl-2 font-bold">
                  (A) ITC Available (whether in full or part)
                </td>
              </tr>
              <tr>
                <td>(1) Import of goods</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td>(2) Import of services</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td>
                  (3) Inward supplies liable to reverse charge (other than 1 & 2
                  above)
                </td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td>(4) Inward supplies from ISD</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td>(5) All other ITC</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="pl-2 font-bold">(D) Ineligible ITC</td>
              </tr>
              <tr>
                <td>(1) As per section 17(5)</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td>(2) Others</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p>4. Details of exempt, nil-rated and non-GST inward supplies</p>
      <div className="my-5 border border-zinc-200 rounded-md overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-center border border-gray-300 border-collapse table">
            <thead className="">
              <tr className="bg-gray-200">
                <th>Nature of supplies</th>
                <th>Inter-State supplies</th>
                <th>Intra-State supplies</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  From a supplier under composition schema, Exempt and Nil rated
                  supply
                </td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Non GST supply</td>
                <td>0</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* GSTR3-REPORT POPUP MODAL */}
      <dialog id="report_popup" className="modal">
        <div className="modal-box w-11/12 max-w-7xl">
          <div className="modal-action sticky top-0 z-10 mb-10 w-full">
            <form method="dialog">
              <button className="btn btn-sm shadow rounded-xl">Close</button>
            </form>
            <button
              onClick={() =>
                downloadPDF("gstr3_report", "gstr3_report", setIsDownloading)
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
              onClick={() => handlePrint(printRef)}
              className="btn rounded-xl btn-sm bg-[var(--primary-btn)] shadow"
            >
              Print
            </button>
          </div>
          {/* REPORT TO DOWNLOAD */}
          <div id="gstr3_report" ref={printRef}>
            {/* Header */}
            <div
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              GSTR 3B Report ({dateRange?.from?.toLocaleDateString("en-GB")} to{" "}
              {dateRange?.to?.toLocaleDateString("en-GB")})
            </div>

            {/* 1. Outward Supplies */}
            <p style={{ margin: "8px 0" }}>
              1. Details of outward supplies and inward supplies liable to
              reverse charge
            </p>

            <div
              style={{
                margin: "20px 0",
                border: "1px solid #e4e4e7",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    borderCollapse: "collapse",
                    fontSize: "12px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#e5e7eb" }}>
                      <th
                        style={{
                          textAlign: "center",
                          border: "1px solid #d1d5db",
                          padding: "6px",
                        }}
                      >
                        Nature Of Supplies
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        Total Taxable Value
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        Integrated Tax
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        Central Tax
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        State/UT Tax
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        Cess
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{ padding: "16px", textAlign: "center" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <CustomLoader text={"Loading..."} />
                          </div>
                        </td>
                      </tr>
                    ) : searchedInvoices?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            border: "1px solid #d1d5db",
                            padding: "16px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={not_found}
                              alt="not_found"
                              width={250}
                              loading="lazy"
                            />
                            <h3 style={{ fontWeight: "600" }}>
                              No matching items found
                            </h3>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "6px",
                              textAlign: "left",
                            }}
                          >
                            Outward taxable supplies (other than zero rated, nil
                            rated and exempted)
                          </td>
                          <td style={{ border: "1px solid #d1d5db" }}>
                            {Number(totalAmount)?.toFixed(2)}
                          </td>
                          <td style={{ border: "1px solid #d1d5db" }}>
                            {Number(totalIgst) > 0
                              ? Number(totalIgst)?.toFixed(2)
                              : 0}
                          </td>
                          <td style={{ border: "1px solid #d1d5db" }}>
                            {Number(totalCGST)?.toFixed(2)}
                          </td>
                          <td style={{ border: "1px solid #d1d5db" }}>
                            {Number(totalSGST)?.toFixed(2)}
                          </td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "6px",
                              textAlign: "left",
                            }}
                          >
                            Outward taxable supplies (zero rated)
                          </td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "6px",
                              textAlign: "left",
                            }}
                          >
                            Other outward supplies (nil rated, exempted)
                          </td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "6px",
                              textAlign: "left",
                            }}
                          >
                            Inward supplies (liable to reverse charge)
                          </td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #d1d5db",
                              padding: "6px",
                              textAlign: "left",
                            }}
                          >
                            Non-GST outward supplies
                          </td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                          <td style={{ border: "1px solid #d1d5db" }}>0</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Inter-State Supplies */}
            <p style={{ marginBottom: "10px" }}>
              2. Details of inter-State supplies made to unregistered persons,
              composition dealer and UIN holders
            </p>

            <div
              style={{
                marginTop: "20px",
                marginBottom: "20px",
                border: "1px solid #e4e4e7",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    borderCollapse: "collapse",
                    fontSize: "12px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#e5e7eb" }}>
                      <th
                        rowSpan="2"
                        style={{
                          border: "1px solid #d1d5db",
                          padding: "8px",
                        }}
                      >
                        Place Of Supply (State/UT)
                      </th>
                      <th
                        colSpan="2"
                        style={{
                          border: "1px solid #d1d5db",
                          padding: "8px",
                        }}
                      >
                        Supplies Made To Unregistered Persons
                      </th>
                      <th
                        colSpan="2"
                        style={{
                          border: "1px solid #d1d5db",
                          padding: "8px",
                        }}
                      >
                        Supplies Made To Composition Taxable Persons
                      </th>
                      <th
                        colSpan="2"
                        style={{
                          border: "1px solid #d1d5db",
                          padding: "8px",
                        }}
                      >
                        Supplies Made To UIN Holders
                      </th>
                    </tr>

                    <tr style={{ backgroundColor: "#e5e7eb" }}>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "8px" }}
                      >
                        Total Taxable Value
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "8px" }}
                      >
                        Amount Of Integrated Tax
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "8px" }}
                      >
                        Total Taxable Value
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "8px" }}
                      >
                        Amount Of Integrated Tax
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "8px" }}
                      >
                        Total Taxable Value
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "8px" }}
                      >
                        Amount Of Integrated Tax
                      </th>
                    </tr>
                  </thead>

                  <tbody></tbody>
                </table>
              </div>
            </div>

            {/* 3. Input Tax Credit */}
            <p style={{ margin: "8px 0" }}>
              3. Details of eligible Input Tax Credit
            </p>
            <div
              style={{
                margin: "20px 0",
                border: "1px solid #e4e4e7",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    borderCollapse: "collapse",
                    fontSize: "12px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#e5e7eb" }}>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        Details
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        Integrated Tax
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        Central Tax
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        State/UT Tax
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        Cess
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          paddingLeft: "8px",
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        (A) ITC Available (whether in full or part)
                      </td>
                    </tr>
                    {[
                      "Import of goods",
                      "Import of services",
                      "Inward supplies liable to reverse charge (other than 1 & 2 above)",
                      "Inward supplies from ISD",
                      "All other ITC",
                    ].map((label, i) => (
                      <tr key={i}>
                        <td
                          style={{
                            border: "1px solid #d1d5db",
                            padding: "6px",
                            textAlign: "left",
                          }}
                        >{`(${i + 1}) ${label}`}</td>
                        <td style={{ border: "1px solid #d1d5db" }}>0</td>
                        <td style={{ border: "1px solid #d1d5db" }}>0</td>
                        <td style={{ border: "1px solid #d1d5db" }}>0</td>
                        <td style={{ border: "1px solid #d1d5db" }}>0</td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        style={{
                          paddingLeft: "8px",
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        (D) Ineligible ITC
                      </td>
                    </tr>
                    {["As per section 17(5)", "Others"].map((label, i) => (
                      <tr key={i}>
                        <td
                          style={{
                            border: "1px solid #d1d5db",
                            padding: "6px",
                            textAlign: "left",
                          }}
                        >{`(${i + 1}) ${label}`}</td>
                        <td style={{ border: "1px solid #d1d5db" }}>0</td>
                        <td style={{ border: "1px solid #d1d5db" }}>0</td>
                        <td style={{ border: "1px solid #d1d5db" }}>0</td>
                        <td style={{ border: "1px solid #d1d5db" }}>0</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Exempt Supplies */}
            <p style={{ margin: "8px 0" }}>
              4. Details of exempt, nil-rated and non-GST inward supplies
            </p>
            <div
              style={{
                margin: "20px 0",
                border: "1px solid #e4e4e7",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    textAlign: "center",
                    border: "1px solid #d1d5db",
                    borderCollapse: "collapse",
                    fontSize: "12px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#e5e7eb" }}>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        Nature of supplies
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        Inter-State supplies
                      </th>
                      <th
                        style={{ border: "1px solid #d1d5db", padding: "6px" }}
                      >
                        Intra-State supplies
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #d1d5db",
                          textAlign: "left",
                          padding: "6px",
                        }}
                      >
                        From a supplier under composition schema, Exempt and Nil
                        rated supply
                      </td>
                      <td style={{ border: "1px solid #d1d5db" }}>0</td>
                      <td style={{ border: "1px solid #d1d5db" }}>0</td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: "1px solid #d1d5db",
                          textAlign: "left",
                          padding: "6px",
                        }}
                      >
                        Non GST supply
                      </td>
                      <td style={{ border: "1px solid #d1d5db" }}>0</td>
                      <td style={{ border: "1px solid #d1d5db" }}>0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </main>
  );
};

export default GSTR3Report;
