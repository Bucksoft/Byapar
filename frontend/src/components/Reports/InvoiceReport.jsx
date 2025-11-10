import {
  ArrowUpDown,
  Download,
  EllipsisVertical,
  Funnel,
  Printer,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { LuIndianRupee } from "react-icons/lu";
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
import InvoiceTemplate from "../Invoices/InvoiceTemplate";
import { useEffect } from "react";

const InvoiceReport = () => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [invoiceToDownload, setInvoiceToDownload] = useState(null);
  const [invoiceIdToDownload, setInvoiceIdToDownload] = useState(null);
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
    if (!invoices?.invoices) return [];

    let filtered = invoices.invoices;

    if (dateRange?.from && dateRange?.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice?.salesInvoiceDate);
        return invoiceDate >= fromDate && invoiceDate <= toDate;
      });
    }

    if (searchQuery) {
      filtered = filtered.filter((invoice) =>
        invoice?.salesInvoiceNumber
          ?.toString()
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [invoices, dateRange, searchQuery]);

  //  use effect to calculate the total Sales based on searched invoices
  useEffect(() => {
    let totalSales = 0;
    searchedInvoices?.forEach((invoice) => {
      if (invoice.status !== "cancelled") totalSales += invoice?.totalAmount;
    });
    setTotalSales(totalSales);
  }, [searchedInvoices]);

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

  // SORT INVOICES
  useMemo(() => {
    if (searchedInvoices?.length === 0) return [];
    if (sortType === "date") {
      return searchedInvoices?.sort((a, b) => {
        return new Date(a?.salesInvoiceDate) - new Date(b?.salesInvoiceDate);
      });
    } else if (sortType === "invoiceNo") {
      return searchedInvoices?.sort((a, b) => {
        return a?.salesInvoiceNumber - b?.salesInvoiceNumber;
      });
    } else if (sortType === "partyName") {
      return searchedInvoices?.sort((a, b) => {
        return a?.partyName?.localeCompare(b?.partyName);
      });
    } else if (sortType === "transaction") {
      return searchedInvoices?.sort((a, b) => {
        return a?.type?.localeCompare(b?.type);
      });
    } else if (sortType === "paymentType") {
      return searchedInvoices?.sort((a, b) => {
        return a?.paymentType?.localeCompare(b?.paymentType);
      });
    } else if (sortType === "amount") {
      return searchedInvoices?.sort((a, b) => {
        return a?.totalAmount - b?.totalAmount;
      });
    } else if (sortType === "balance") {
      return searchedInvoices?.sort((a, b) => {
        return a?.balanceAmount - b?.balanceAmount;
      });
    } else if (sortType === "status") {
      return searchedInvoices?.sort((a, b) => {
        return a?.balanceAmount - b?.balanceAmount;
      });
    }
  }, [sortType]);

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
      </header>

      {/* CARD TO DISPLAY TOTAL SALES */}
      <div className="w-full my-5">
        <div className="border w-1/4 p-2 border-zinc-300 shadow-md rounded-md bg-zinc-500/10">
          <span className="text-sm text-zinc-500">Total Sales</span>
          <p className="flex items-center gap-1">
            <LuIndianRupee size={12} />
            {Number(totalSales).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="divider divider-sm" />

      {/* TABLE TO DISPLAY TOTAL SALES */}
      <section className="w-full">
        {/* SEARCH AND PRINT BUTTON */}
        <div className="w-full flex items-center justify-between">
          <h2 className="font-medium">Transactions</h2>
          <div className="flex items-center gap-2">
            <input
              className="input input-sm"
              type="text"
              placeholder="Search by invoice number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() =>
                document.getElementById("report_popup").showModal()
              }
              className="btn btn-sm rounded-xl"
            >
              <Printer size={19} />
            </button>
          </div>
        </div>

        {/* TABLE WRAPPER */}
        <div className="my-5 border border-zinc-200 rounded-md overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto">
            <table ref={printRef} className="table table-zebra w-full ">
              <thead
                style={{
                  backgroundColor: "#e4e4e7",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                <tr>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 20,
                      }}
                    >
                      <span>Date</span>
                      <ArrowUpDown
                        onClick={() => setSortType("date")}
                        size={12}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Invoice no</span>
                      <ArrowUpDown
                        onClick={() => setSortType("invoiceNo")}
                        size={12}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Party Name</span>
                      <ArrowUpDown
                        onClick={() => setSortType("partyName")}
                        size={12}
                        style={{
                          cursor: "pointer",
                          marginLeft: "20px",
                        }}
                      />
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Transaction</span>
                      <ArrowUpDown
                        onClick={() => setSortType("transaction")}
                        size={12}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Payment Type</span>
                      <ArrowUpDown
                        onClick={() => setSortType("paymentType")}
                        size={12}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Amount</span>
                      <ArrowUpDown
                        onClick={() => setSortType("amount")}
                        size={12}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Balance</span>
                      <ArrowUpDown
                        onClick={() => setSortType("balance")}
                        size={12}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </th>
                  <th>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Status</span>
                      <ArrowUpDown
                        onClick={() => setSortType("status")}
                        size={12}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="flex items-center justify-center py-8">
                        <CustomLoader text={"Loading..."} />
                      </div>
                    </td>
                  </tr>
                ) : searchedInvoices?.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
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
                  searchedInvoices?.map((invoice) => (
                    <tr
                      key={invoice?._id}
                      onClick={() =>
                        navigate(`/dashboard/sales-invoice/${invoice?._id}`)
                      }
                      className="cursor-pointer"
                    >
                      <td>{invoice?.salesInvoiceDate?.split("T")[0] || "-"}</td>
                      <td>{invoice?.salesInvoiceNumber || "-"}</td>
                      <td>{invoice?.partyName || "-"}</td>
                      <td>{invoice?.type || "-"}</td>
                      <td>{invoice?.paymentType || "-"}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <LuIndianRupee size={10} />
                          {Number(invoice?.totalAmount).toLocaleString(
                            "en-IN"
                          ) || 0}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <LuIndianRupee size={10} />
                          {invoice?.balance
                            ? Number(invoice?.balanceAmount).toLocaleString(
                                "en-IN"
                              )
                            : 0}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`badge badge-sm badge-soft ${
                            invoice?.status === "paid"
                              ? "badge-success"
                              : invoice?.status === "cancelled"
                              ? "badge-error"
                              : "badge-warning"
                          }`}
                        >
                          {invoice?.status}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {/* <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrint("invoice");
                            }}
                            className="btn btn-xs bg-white rounded-xl"
                          >
                            <Printer size={12} />
                          </button> */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="dropdown dropdown-bottom dropdown-end "
                          >
                            <div
                              tabIndex={0}
                              role="button"
                              className="btn btn-xs m-1 bg-white"
                            >
                              <EllipsisVertical size={12} />
                            </div>
                            <ul
                              tabIndex="-1"
                              className="border border-zinc-300 dropdown-content menu bg-base-100 rounded-box z-100 w-52 p-1 text-xs shadow-sm"
                            >
                              <li
                                onClick={() =>
                                  navigate(
                                    `/dashboard/update/${invoice?._id}?type=sales invoice`
                                  )
                                }
                              >
                                <a>View/Edit</a>
                              </li>
                              <li
                                onClick={() =>
                                  navigate(
                                    `/dashboard/parties/create-payment-in`,
                                    {
                                      state: {
                                        invoiceId: invoice?._id,
                                        partyName: invoice?.partyName,
                                      },
                                    }
                                  )
                                }
                              >
                                <a>Receive Payment</a>
                              </li>
                              <li
                                onClick={(e) => {
                                  setInvoiceToDownload(invoice);
                                  document
                                    .getElementById("invoice_pdf_modal")
                                    .showModal();
                                }}
                              >
                                <a>Open PDF</a>
                              </li>

                              <li
                                onClick={() =>
                                  cancelMutation.mutate(invoice?._id)
                                }
                                className="text-[var(--error-text-color)]"
                              >
                                <a>Cancel Invoice</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* REPORT POPUP MODAL */}
      <dialog id="report_popup" className="modal">
        <div className="modal-box w-11/12 max-w-7xl">
          <div className="modal-action sticky top-0 z-10 mb-10 w-full">
            <form method="dialog">
              <button className="btn btn-sm shadow">Close</button>
            </form>
            <button
              onClick={() =>
                downloadPDF("sales_report", "sales_report", setIsDownloading)
              }
              className="btn rounded-xl rounded-xl btn-sm bg-[var(--primary-btn)] shadow"
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
          {/* INVOICE TO DOWNLOAD */}
          <div
            id="sales_report"
            ref={printRef}
            style={{
              width: "100%",
            }}
          >
            {/* HEADER PART */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <img src={business?.logo} width={70} alt="Business" />
              <div>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                >
                  {business?.businessName?.toUpperCase()}
                </h2>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#71717b",
                  }}
                >
                  {business?.billingAddress}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                  }}
                >
                  <small>{business?.companyPhoneNo}</small>
                  <small>
                    {business?.companyEmail?.length
                      ? `| ${business?.companyEmail}`
                      : ""}
                  </small>
                </div>
                <small>
                  {business?.gstNumber?.length
                    ? `GSTIN: ${business?.gstNumber}`
                    : ""}
                </small>
              </div>
            </div>

            <div
              style={{
                height: "2px",
                width: "100%",
                backgroundColor: "#e4e4e7",
                margin: "20px 0px",
              }}
            />

            {/* MAIN PART */}
            <div
              style={{
                width: "100%",
              }}
            >
              <h4
                style={{
                  textDecoration: "underline",
                  fontWeight: 700,
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                Sale Report
              </h4>
              <h5>
                Duration : {dateRange?.from.toLocaleDateString("en-GB")} to{" "}
                {dateRange?.to.toLocaleDateString("en-GB")}{" "}
              </h5>
            </div>

            <div
              style={{
                marginTop: "20px",
                // overflowY: "scroll",
                // maxHeight: "400px",
              }}
            >
              <table className=" table table-zebra w-full relative">
                <thead
                  style={{
                    backgroundColor: "#e4e4e7",
                    fontSize: "12px",
                  }}
                >
                  <tr>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 20,
                          padding: "5px",
                        }}
                      >
                        <span>Date</span>
                      </div>
                    </th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "5px",
                        }}
                      >
                        <span>Invoice no</span>
                      </div>
                    </th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Party Name</span>
                      </div>
                    </th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Transaction</span>
                      </div>
                    </th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Payment Type</span>
                      </div>
                    </th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Amount</span>
                      </div>
                    </th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Balance</span>
                      </div>
                    </th>
                    <th>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Status</span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody
                  style={{
                    fontSize: "12px",
                  }}
                >
                  {isLoading ? (
                    <tr>
                      <td colSpan={8}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "32px 0px",
                          }}
                        >
                          <CustomLoader text={"Loading..."} />
                        </div>
                      </td>
                    </tr>
                  ) : searchedInvoices?.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <img
                            src={not_found}
                            alt="not_found"
                            width={250}
                            loading="lazy"
                          />
                          <h3
                            style={{
                              fontWeight: "600",
                            }}
                          >
                            No matching items found
                          </h3>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    searchedInvoices?.map((invoice) => (
                      <tr
                        key={invoice?._id}
                        onClick={() =>
                          navigate(`/dashboard/sales-invoice/${invoice?._id}`)
                        }
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <td>
                          {invoice?.salesInvoiceDate?.split("T")[0] || "-"}
                        </td>
                        <td>{invoice?.salesInvoiceNumber || "-"}</td>
                        <td>{invoice?.partyName || "-"}</td>
                        <td>{invoice?.type || "-"}</td>
                        <td>{invoice?.paymentType || "-"}</td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <LuIndianRupee size={10} />
                            {Number(invoice?.totalAmount).toLocaleString(
                              "en-IN"
                            ) || 0}
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <LuIndianRupee size={10} />
                            {invoice?.balance
                              ? Number(invoice?.balanceAmount).toLocaleString(
                                  "en-IN"
                                )
                              : 0}
                          </div>
                        </td>
                        <td>
                          <div
                            className={`badge badge-sm badge-soft ${
                              invoice?.status === "paid"
                                ? "badge-success"
                                : invoice?.status === "cancelled"
                                ? "badge-error"
                                : "badge-warning"
                            }`}
                          >
                            {invoice?.status}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* TOTAL SALES IN THE REPORT */}
            <h4
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                margin: "20px 0px",
                width: "100%",
              }}
            >
              Total Sale : <LuIndianRupee size={15} /> {invoices?.totalSales}
            </h4>
          </div>
        </div>
      </dialog>

      {/* INVOICE MODAL */}
      <dialog id="invoice_pdf_modal" className="modal">
        <div className="modal-box max-w-4xl w-11/12 max-h-[95%] ">
          <div className="flex items-center justify-between sticky bg-white -top-10 py-4 ">
            <h3 className="font-bold text-lg">
              {invoiceToDownload?.partyName}
            </h3>
            {/* MODAL ACTIONS */}
            <div className="modal-action ">
              <form method="dialog">
                <button className="btn btn-sm rounded-xl">Close</button>
              </form>
              <button
                onClick={() =>
                  downloadPDF(
                    invoiceIdToDownload,
                    `${invoiceToDownload?.partyName
                      ?.split(" ")
                      .join("_")
                      .concat("_invoice")}`,
                    setIsDownloading
                  )
                }
                className="btn btn-sm bg-[var(--primary-btn)]"
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
            </div>
          </div>

          <InvoiceTemplate
            type={"Sales Invoice"}
            color={"#E56E2A"}
            // ref={printRef}
            invoice={invoiceToDownload}
            setInvoiceIdToDownload={setInvoiceIdToDownload}
          />
        </div>
      </dialog>
    </main>
  );
};

export default InvoiceReport;
