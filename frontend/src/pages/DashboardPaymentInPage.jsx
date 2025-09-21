import { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { FaFileInvoice } from "react-icons/fa6";
import SalesNavigationMenus from "../components/SalesNavigationMenus";
import PaymentInForm from "../components/PaymentIn/PaymentInForm";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { LiaRupeeSignSolid } from "react-icons/lia";
import CustomLoader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { usePaymentInStore } from "../store/paymentInStore";
import { useBusinessStore } from "../store/businessStore";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);

const DashboardPaymentInPage = () => {
  const [page, setPage] = useState("");
  const navigate = useNavigate();
  const [searchedQuery, setSearchedQuery] = useState("");
  const { setPaymentIns } = usePaymentInStore();
  const [filterDate, setFilterDate] = useState("");
  const { business } = useBusinessStore();

  const { isLoading, data: paymentIns } = useQuery({
    queryKey: ["paymentIns"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/payment-in/all/${business?._id}`);
      setPaymentIns(res.data.paymentIns);
      return res.data.paymentIns;
    },
  });

  const filteredPaymentIns = paymentIns?.filter((paymentIn) => {
    // 1. Search query filter
    if (searchedQuery.trim() !== "") {
      const matchesSearch =
        paymentIn?.paymentInNumber
          ?.toLowerCase()
          .includes(searchedQuery.toLowerCase()) ||
        paymentIn?.partyName
          ?.toLowerCase()
          .includes(searchedQuery.toLowerCase());
      if (!matchesSearch) return false;
    }

    // 2. Date filter
    if (filterDate) {
      const today = dayjs();
      const paymentDate = dayjs(paymentIn?.paymentDate || paymentIn?.createdAt);

      switch (filterDate) {
        case "today":
          if (!paymentDate.isSame(today, "day")) return false;
          break;

        case "yesterday":
          if (!paymentDate.isSame(today.subtract(1, "day"), "day"))
            return false;
          break;

        case "thisWeek":
          if (
            !paymentDate.isSameOrAfter(today.startOf("week")) ||
            !paymentDate.isSameOrBefore(today.endOf("week"))
          )
            return false;
          break;

        case "lastWeek":
          const lastWeekStart = today.subtract(1, "week").startOf("week");
          const lastWeekEnd = today.subtract(1, "week").endOf("week");
          if (
            !paymentDate.isSameOrAfter(lastWeekStart) ||
            !paymentDate.isSameOrBefore(lastWeekEnd)
          )
            return false;
          break;
        default:
          break;
      }
    }
    return true;
  });

  return (
    <main className="h-full p-2">
      {page === "Payment In" ? (
        <PaymentInForm />
      ) : (
        <div className="h-full w-full bg-white rounded-lg p-3">
          <DashboardNavbar title={"Payment In"} />
          <SalesNavigationMenus
            btnText={"Payment In"}
            title={"Payment In"}
            selectText={"btn"}
            setPage={setPage}
            setSearchedQuery={setSearchedQuery}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
          />

          <div className=" mt-5 h-80 rounded-md mx-4 ">
            {isLoading ? (
              <div className="w-full flex justify-center py-16">
                <CustomLoader text={"Loading..."} />
              </div>
            ) : filteredPaymentIns?.length > 0 ? (
              <table className="table table-zebra">
                <thead>
                  <tr className="text-xs bg-[var(--primary-background)]">
                    <th>Date</th>
                    <th>Payment Number</th>
                    <th className="text-center">Party Name</th>
                    <th className="text-right">Payment Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaymentIns?.map((paymentIn) => (
                    <tr
                      key={paymentIn?._id}
                      onClick={() =>
                        navigate(`/dashboard/payment-in/${paymentIn?._id}`)
                      }
                      className="cursor-pointer hover:bg-zinc-50"
                    >
                      <td>{paymentIn?.paymentDate.split("T")[0]}</td>
                      <td>{paymentIn?.paymentInNumber || "-"}</td>
                      <td className="text-center">
                        {paymentIn?.partyName || "-"}
                      </td>
                      <td>
                        <div className="flex items-center justify-end">
                          <LiaRupeeSignSolid />
                          {Number(paymentIn?.paymentAmount).toLocaleString(
                            "en-IN"
                          ) || "-"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
                <FaFileInvoice size={40} />
                <span className="text-sm">No Payment Ins found</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardPaymentInPage;
