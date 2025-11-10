import { Menu, MessageCircle } from "lucide-react";
import { container, dashboardLinksItems } from "../components/Sidebar";
import { IoReceiptOutline } from "react-icons/io5";
import DashboardCard from "../components/DashboardCard";
import { dashboardCardDetails } from "../lib/dashboardCardDetails";
import { motion, recordStats } from "framer-motion";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useBusinessStore } from "../store/businessStore";
import CustomLoader from "../components/Loader";
import { useInvoiceStore } from "../store/invoicesStore";
import SalesChart from "../components/SalesChart";
import { useState } from "react";
import noPaymentInImage from "../assets/noPaymentIn.png";
import inv from "../assets/inv.png";
import { usePartyStore } from "../store/partyStore";

const DashboardPage = () => {
  const { business } = useBusinessStore();
  const { setInvoices } = useInvoiceStore();
  const { setParties } = usePartyStore();
  const [privacy, setPrivacy] = useState(true);

  // SET INVOICES
  const { isLoading, data: invoices } = useQuery({
    queryKey: ["invoices", business?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/sales-invoice/${business._id}`);
      setInvoices(res?.data?.invoices);
      return res?.data?.invoices;
    },
    enabled: !!business?._id,
  });

  // PAYMENT INS
  const { data: paymentIns } = useQuery({
    queryKey: ["paymentIns", business?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/payment-in/all/${business._id}`);
      return res?.data?.paymentIns;
    },
    enabled: !!business?._id,
  });

  // PARTIES
  const { data: parties } = useQuery({
    queryKey: ["parties", business?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/parties/all-parties/${business?._id}`
      );
      setParties(res.data?.data);
      return res.data;
    },
    enabled: !!business?._id,
    keepPreviousData: true,
  });

  return (
    <main className="h-screen">
      <div className="h-full w-full rounded-lg p-3">
        <div className="flex flex-col md:flex-row gap-3 ">
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
              <div className="flex items-center gap-3  justify-center rounded-full">
                <h1 className="text-xs text-zinc-800">Privacy</h1>
                <button>
                  <input
                    type="checkbox"
                    checked={privacy}
                    onChange={(e) => setPrivacy(!privacy)}
                    className="toggle toggle-xs toggle-info"
                  />
                </button>
              </div>
              <Menu className="md:hidden block" />
            </motion.nav>

            {/* Invoice creation */}
            <motion.div
              initial={{ translateY: -100, filter: "blur(10px)" }}
              animate={{ translateY: 0, filter: "blur(0)" }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              className="bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-between  rounded-lg px-5  text-white relative inset-shadow-[1px_1px_10px_rgba(0,0,0,0.2)] shadow-lg border border-white"
            >
              <div className="flex flex-col gap-3 py-5">
                <h1>
                  Create your{" "}
                  <span className="font-semibold">first invoice</span> in 30
                  seconds!
                </h1>
                <Link
                  to={"/dashboard/parties/sales-invoice"}
                  className="w-1/2 btn btn-sm btn-soft rounded-xl"
                >
                  Create Sales Invoice
                </Link>
              </div>
              <img
                src={inv}
                alt="inv"
                width={150}
                className="absolute right-5 -bottom-1"
                loading="lazy"
              />
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-3 mt-3">
              {/* latest transactions */}

              {isLoading ? (
                <div className="w-full lg:w-3/5 bg-white px-5 py-3 rounded-lg overflow-x-auto flex items-center justify-center">
                  <CustomLoader text={"Loading latest transactions..."} />
                </div>
              ) : (
                <div className="w-full flex flex-col px-5 py-3 gap-3">
                  {/* SALES CHART IS DISPLAYED HERE */}
                  <div className={`${privacy ? "blur-sm" : ""} `}>
                    <SalesChart />
                  </div>
                  <motion.div
                    initial={{
                      translateY: -100,
                      filter: "blur(3px)",
                      opacity: 0,
                    }}
                    animate={{ translateY: 0, filter: "blur(0)", opacity: 1 }}
                    transition={{
                      ease: "easeInOut",
                      duration: 0.3,
                      delay: 0.3,
                    }}
                    className="w-full border border-zinc-100 shadow-lg py-2 bg-gradient-to-b from-white to-zinc-200 rounded-xl overflow-x-auto"
                  >
                    <h1
                      className={`${
                        privacy ? "blur-xs" : ""
                      }   font-semibold text-lg rounded-lg p-2 `}
                    >
                      Latest Invoices
                    </h1>
                    {invoices?.length ? (
                      <div className={` ${privacy ? "blur-xs" : ""}`}>
                        <table className="table table-zebra text-sm mt-2 min-w-full table-sm border-t border-b border-zinc-300">
                          {/* head */}
                          <thead className="bg-zinc-300">
                            <tr>
                              <th className="font-medium">DATE</th>
                              <th className="font-medium">TYPE</th>
                              <th className="font-medium">INV NO</th>
                              <th className="font-medium">PARTY NAME</th>
                              <th className="font-medium">AMOUNT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoices &&
                              invoices?.slice(0, 5).map((invoice) => (
                                <tr key={invoice?._id} className="bg-white">
                                  <td>
                                    {(invoice?.salesInvoiceDate &&
                                      invoice?.salesInvoiceDate.split(
                                        "T"
                                      )[0]) ||
                                      "-"}
                                  </td>
                                  <td>{invoice?.type || "-"}</td>
                                  <td>{invoice?.salesInvoiceNumber || "-"}</td>
                                  <td>{invoice?.partyId?.partyName || "-"}</td>
                                  <td className="flex items-center">
                                    <LiaRupeeSignSolid />
                                    {Number(
                                      invoice?.totalAmount
                                    ).toLocaleString("en-IN") || "-"}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        <div className="w-full text-center mt-2">
                          <Link
                            to={"/dashboard/all-transactions"}
                            className="text-xs text-blue-800 hover:text-blue-600 "
                          >
                            View All Transactions
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-center text-zinc-500 my-10 flex items-center justify-center flex-col gap-3">
                        <IoReceiptOutline size={40} />
                        Create your first transaction
                      </div>
                    )}
                  </motion.div>
                </div>
              )}

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

                {/* Latest Payment Ins */}
                <motion.div
                  className="w-full border border-zinc-100 bg-gradient-to-b from-white to-zinc-200 shadow-md rounded-xl overflow-hidden  flex flex-col gap-3"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  <h1
                    className={`${
                      privacy ? "blur-xs" : ""
                    }   font-semibold text-lg rounded-lg p-2 `}
                  >
                    Latest Payments
                  </h1>

                  <div className={`${privacy ? "blur-xs" : ""}`}>
                    {paymentIns?.length > 0 ? (
                      <table className="table table-zebra text-sm">
                        <thead className="bg-zinc-300">
                          <tr>
                            <th className="font-medium">DATE</th>
                            <th className="font-medium">PARTY</th>
                            <th className="font-medium">AMOUNT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentIns &&
                            paymentIns?.slice(0, 5).map((paymentIn) => (
                              <tr key={paymentIn?._id} className="bg-white">
                                <td>
                                  {(paymentIn?.paymentDate &&
                                    paymentIn?.paymentDate.split("T")[0]) ||
                                    "-"}
                                </td>
                                <td>{paymentIn?.partyName || "-"}</td>
                                <td className="flex items-center">
                                  <LiaRupeeSignSolid />
                                  {Number(
                                    paymentIn?.paymentAmount
                                  ).toLocaleString("en-IN") || "-"}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="flex items-center flex-col py-3 justify-center">
                        <img
                          src={noPaymentInImage}
                          alt="noPayment"
                          loading="lazy"
                          width={180}
                        />
                        <h1 className="text-zinc-600">No Payment Ins yet</h1>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
