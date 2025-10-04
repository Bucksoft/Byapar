import { Menu, MessageCircle } from "lucide-react";
import { container, dashboardLinksItems } from "../components/Sidebar";
import { IoReceiptOutline } from "react-icons/io5";
import DashboardCard from "../components/DashboardCard";
import { dashboardCardDetails } from "../lib/dashboardCardDetails";
import { motion } from "framer-motion";
import { useInvoiceStore } from "../store/invoicesStore";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { invoices } = useInvoiceStore();

  return (
    <main className="h-full">
      <div className="h-full w-full rounded-lg p-3">
        <div className="flex flex-col md:flex-row gap-3 bg-zinc-100">
          {/* sidebar */}
          {/* <Sidebar /> */}

          <section className="w-full">
            {/* Dashboard nav */}
            <motion.nav
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              className="w-full bg-white rounded-lg px-5 py-3 flex items-center justify-between"
            >
              <span className="font-semibold text-lg">Dashboard</span>
              <div className="flex items-center gap-3">
                {/* <button className="btn btn-sm btn-soft bg-[var(--primary-btn)]">
              <MessageCircle size={15} /> Chat
            </button> */}
                <Menu className="md:hidden block" />
              </div>
            </motion.nav>

            {/* Invoice creation */}
            <motion.div
              initial={{ translateY: -100, filter: "blur(10px)" }}
              animate={{ translateY: 0, filter: "blur(0)" }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              className="bg-accent mt-3 rounded-lg px-5 py-3 text-white"
            >
              <div className="flex flex-col gap-3">
                <h1>
                  Create your{" "}
                  <span className="font-semibold">first invoice</span> in 30
                  seconds!
                </h1>
                <Link
                  to={"/dashboard/parties/sales-invoice"}
                  className="w-full sm:w-1/3 btn btn-sm btn-soft"
                >
                  Create Sales Invoice
                </Link>
              </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-3 mt-3">
              {/* latest transactions */}
              <motion.div
                initial={{ translateY: -100, filter: "blur(3px)", opacity: 0 }}
                animate={{ translateY: 0, filter: "blur(0)", opacity: 1 }}
                transition={{ ease: "easeInOut", duration: 0.3, delay: 0.3 }}
                className="w-full lg:w-3/5 bg-white px-5 py-3 rounded-lg overflow-x-auto"
              >
                <h1 className="font-semibold text-sm rounded-lg p-2">
                  Latest Transactions
                </h1>
                {invoices ? (
                  <>
                    <table className="table table-zebra text-sm mt-2 min-w-full">
                      {/* head */}
                      <thead className="bg-zinc-200">
                        <tr>
                          <th className="font-medium">DATE</th>
                          <th className="font-medium">TYPE</th>
                          <th className="font-medium">TXN NO</th>
                          <th className="font-medium">PARTY NAME</th>
                          <th className="font-medium">AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices &&
                          invoices?.invoices.slice(0, 3).map((invoice) => (
                            <tr key={invoice?._id}>
                              <td>
                                {(invoice?.salesInvoiceDate &&
                                  invoice?.salesInvoiceDate.split("T")[0]) ||
                                  "-"}
                              </td>
                              <td>{invoice?.type || "-"}</td>
                              <td>{invoice?.salesInvoiceNumber || "-"}</td>
                              <td>{invoice?.partyId?.partyName || "-"}</td>
                              <td className="flex items-center">
                                <LiaRupeeSignSolid />
                                {Number(invoice?.totalAmount).toLocaleString(
                                  "en-IN"
                                ) || "-"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <div className="w-full text-center mt-2">
                      <Link
                        to={"/dashboard/all-transactions"}
                        className="text-xs text-blue-500 hover:text-blue-600"
                      >
                        View All Transactions
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-center text-zinc-500 my-10 flex items-center justify-center flex-col gap-3">
                    <IoReceiptOutline size={40} />
                    Create your first transaction
                  </div>
                )}
              </motion.div>

              {/* Dashboard cards */}
              <motion.div
                className="w-full lg:w-2/5 flex flex-col gap-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {dashboardCardDetails?.map((details) => (
                  <motion.div key={details.id} variants={dashboardLinksItems}>
                    <DashboardCard details={details} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
