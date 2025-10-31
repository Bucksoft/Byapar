import { RiAccountPinCircleFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { container, dashboardLinksItems } from "../components/Sidebar";
import { badges } from "../utils/constants";
import { useSearchParams } from "react-router-dom";
import DashboardStockValuePage from "./DashboardStockValuePage";
import DashboardLowStockPage from "./DashboardLowStockPage";
import DashboardItemsSalesAndPurchaseSummary from "./DashboardItemsSalesAndPurchaseSummary";
import DashboardRateListPage from "./DashboardRateListPage";
import { useState } from "react";
import InvoiceReport from "../components/Reports/InvoiceReport";
import PaymentCollectionReport from "../components/Reports/PaymentCollectionReport";

const DashboardReportPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState("party");

  const param = searchParams.get("type");
  return (
    <>
      {param === "Stock Value" ? (
        <DashboardStockValuePage />
      ) : param === "Low Stock" ? (
        <DashboardLowStockPage />
      ) : param === "Item Sales Summary" ? (
        <DashboardItemsSalesAndPurchaseSummary />
      ) : param === "Rate List" ? (
        <DashboardRateListPage />
      ) : (
        <main className="max-h-screen p-2">
          <div className="h-full w-full bg-white rounded-lg p-3">
            {/* header */}
            <motion.div
              initial={{
                opacity: 0,
                translateY: -100,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="flex items-center justify-between "
            >
              <h1 className="font-semibold text-lg mt-1">Reports</h1>
              {/* <button className="btn btn-sm bg-[var(--primary-btn)] flex items-center gap-2">
                {" "}
                <RiAccountPinCircleFill size={16} /> CA Report Sharing
              </button> */}
            </motion.div>

            <div className="mt-7 text-sm flex items-center gap-5">
              <h2>Filter By</h2>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex gap-3"
              >
                {badges?.map((badge, idx) => (
                  <motion.div
                    key={idx}
                    variants={dashboardLinksItems}
                    onClick={() => setTab(badge?.label.toLowerCase())}
                    className={`badge badge-soft badge-primary cursor-pointer ${
                      tab.toLowerCase() === badge?.label.toLowerCase() &&
                      " text-[var(--badge)] ring-1 shadow-lg "
                    } `}
                  >
                    {badge.label}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* INVOICE IS SELECTED */}
            {tab === "invoice" && <InvoiceReport />}

            {/* PAYMENT COLLECTION */}
            {tab === "payment collection" && <PaymentCollectionReport />}

            {/* 
            <motion.table
              initial={{
                opacity: 0,
                translateY: 100,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.2,
                delay: 0.4,
              }}
              className="table table-zebra mt-8"
            >
              <thead>
                <tr className="bg-zinc-100">
                  <th>Favourite</th>
                  <th>GST</th>
                  <th>Transaction</th>
                  <th>Item</th>
                  <th>Party</th>
                </tr>
              </thead>
            </motion.table> */}
          </div>
        </main>
      )}
    </>
  );
};

export default DashboardReportPage;
