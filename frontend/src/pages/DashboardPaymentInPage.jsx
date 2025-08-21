import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { FaFileInvoice } from "react-icons/fa6";
import { Calendar, ChevronDown, Search } from "lucide-react";
import SalesNavigationMenus from "../components/SalesNavigationMenus";
import PaymentInForm from "../components/PaymentIn/PaymentInForm";

const DashboardPaymentInPage = () => {
  const [page, setPage] = useState("");
  return (
    <main className="h-full p-2">
      {page === "Payment In" ? (
        <PaymentInForm />
      ) : (
        <div className="h-full w-full bg-white rounded-lg p-3">
          <DashboardNavbar title={"Payment In"} />
          <SalesNavigationMenus
            btnText={"Payment In"}
            selectText={"btn"}
            setPage={setPage}
          />

          <div className="border border-zinc-200 mt-5 h-80 rounded-md mx-4 ">
            <table className="table ">
              {/* head */}
              <thead>
                <tr className="text-xs bg-gray-100 border-b border-b-gray-200">
                  <th className="border-r border-r-zinc-200 w-60">Date</th>
                  <th className="border-r border-r-zinc-200 w-60">
                    Payment Number
                  </th>
                  <th className="border-r border-r-zinc-200 w-60">
                    Party Name
                  </th>
                  <th className="border-r border-r-zinc-200 w-60">Amount</th>
                </tr>
              </thead>
            </table>
            <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
              <FaFileInvoice size={40} />
              <span className="text-sm">
                No transactions matching the current filter
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardPaymentInPage;
