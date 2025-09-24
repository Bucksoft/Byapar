import { FaFileInvoice } from "react-icons/fa";
import DashboardNavbar from "../components/DashboardNavbar";
import CustomLoader from "../components/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useBusinessStore } from "../store/businessStore";
import { useQuotationStore } from "../store/quotationStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isBetween from "dayjs/plugin/isBetween";
import { ChevronDown, Search } from "lucide-react";

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

const DashboardQuotationPage = () => {
  const { business } = useBusinessStore();
  const { setQuotations, setTotalQuotations } = useQuotationStore();
  const [searchedQuery, setSearchedQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [quotationType, setQuotationType] = useState("");

  const navigate = useNavigate();

  // QUERY TO GET ALL THE INVOICES
  const { isLoading, data: quotations = [] } = useQuery({
    queryKey: ["quotations", business?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/quotation/all/${business?._id}`);
      setTotalQuotations(res.data?.totalQuotations);
      setQuotations(res.data.quotations);
      return Array.isArray(res.data.quotations) ? res.data.quotations : [];
    },
    enabled: !!business?._id,
  });

  const filteredQuotations = quotations.filter((quotation) => {
    const quotationDate = dayjs(
      quotation?.quotationDate || quotation?.createdAt
    );

    // --- Date filter ---
    switch (filterDate) {
      case "today":
        if (!quotationDate.isSame(dayjs(), "day")) return false;
        break;
      case "yesterday":
        if (!quotationDate.isSame(dayjs().subtract(1, "day"), "day"))
          return false;
        break;
      case "thisWeek":
        if (
          !quotationDate.isBetween(
            dayjs().startOf("isoWeek"),
            dayjs().endOf("isoWeek"),
            null,
            "[]"
          )
        )
          return false;
        break;
      case "lastWeek":
        const startLastWeek = dayjs().subtract(1, "week").startOf("isoWeek");
        const endLastWeek = dayjs().subtract(1, "week").endOf("isoWeek");
        if (!quotationDate.isBetween(startLastWeek, endLastWeek, null, "[]"))
          return false;
        break;
      default:
        break;
    }

    // --- Search filter ---
    if (searchedQuery.trim()) {
      const query = searchedQuery.toLowerCase();
      const matchesText =
        quotation?.quotationNumber?.toString().toLowerCase().includes(query) ||
        quotation?.partyId?.partyName?.toLowerCase().includes(query);
      return matchesText;
    }

    // FILTERING BASED ON QUOTATION TYPE
    if (quotationType === "open" || quotationType === "closed") {
      const matchesText = quotation?.status
        ?.toLowerCase()
        .includes(quotationType.toLowerCase());
      return matchesText;
    } else {
      return quotation;
    }

    return true;
  });

  return (
    <main className="h-screen w-full flex">
      <section className="h-full w-full  p-2">
        <div className=" h-full rounded-md bg-gradient-to-b from-white to-transparent p-3">
          <DashboardNavbar title={"Quotation / Estimate"} />

          {/* Top controls */}
          <div className="flex gap-3 px-4 py-5 items-center justify-between">
            <div className="flex gap-5 w-full">
              {/* search box */}
              <label className="input input-sm flex items-center gap-2">
                <Search size={16} />
                <input
                  type="search"
                  placeholder="Search"
                  value={searchedQuery}
                  onChange={(e) => setSearchedQuery(e.target.value)}
                  className="w-full"
                />
              </label>

              {/* date filter */}
              <select
                className="select select-sm"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="" disabled>
                  --Select-Day--
                </option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisWeek">This week</option>
                <option value="lastWeek">Last week</option>
              </select>

              {/* dropdown (optional) */}
              <select
                className="select select-sm"
                value={quotationType}
                onChange={(e) => setQuotationType(e.target.value)}
              >
                <option value="" disabled>
                  --Select-type--
                </option>
                <option value="open">Show Open Quotations</option>
                <option value="closed">Show Closed Quotations</option>
                <option value="all">Show All Quotations</option>
              </select>
            </div>

            <button
              onClick={() => navigate(`/dashboard/parties/create-quotation`)}
              className="btn bg-[var(--primary-btn)] btn-sm text-zinc-700"
            >
              Create Quotation
            </button>
          </div>

          {/* Table */}
          <div className="mt-5 h-80  mx-4 overflow-auto">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <CustomLoader text={"Loading..."} />
              </div>
            ) : filteredQuotations.length > 0 ? (
              <table className="table table-zebra border border-zinc-100">
                <thead>
                  <tr className="text-xs bg-[var(--primary-background)]">
                    <th className="w-60">Date</th>
                    <th className="w-60">Quotation Number</th>
                    <th className="w-60">Party Name</th>
                    <th className="w-60">Due In</th>
                    <th className="w-60">Amount</th>
                    <th className="w-60">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotations.map((quotation) => (
                    <tr
                      key={quotation._id}
                      onClick={() =>
                        navigate(`/dashboard/quotations/${quotation?._id}`)
                      }
                      className="cursor-pointer hover:bg-zinc-50"
                    >
                      <td>{quotation?.quotationDate?.split("T")[0]}</td>
                      <td>{quotation?.quotationNumber}</td>
                      <td>{quotation?.partyId?.partyName}</td>
                      <td>-</td>
                      <td>
                        <div className="flex items-center">
                          <LiaRupeeSignSolid />
                          {Number(quotation?.totalAmount || 0).toLocaleString(
                            "en-IN"
                          )}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`badge ${
                            quotation?.status === "expired"
                              ? "badge-error"
                              : "badge-accent"
                          } badge-soft`}
                        >
                          {quotation?.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
                <FaFileInvoice size={40} />
                <span className="text-sm">
                  No transactions matching the current filter
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardQuotationPage;
