import {
  businessTools,
  dashboardAccountingFields,
  dashboardFields,
  settingLinks,
} from "../lib/dashboardFields";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbLogout2 } from "react-icons/tb";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useAuthStore } from "../store/authStore";
import { useBusinessStore } from "../store/businessStore";
import { useInvoiceStore } from "../store/invoicesStore";
import { useItemStore } from "../store/itemStore";
import { usePartyStore } from "../store/partyStore";
import { usePaymentInStore } from "../store/paymentInStore";
import { usePaymentOutStore } from "../store/paymentOutStore";
import { useProformaInvoiceStore } from "../store/proformaStore";
import { usePurchaseInvoiceStore } from "../store/purchaseInvoiceStore";
import { useQuotationStore } from "../store/quotationStore";
import { useSalesReturnStore } from "../store/salesReturnStore";
import { useCategoryStore } from "../store/categoryStore";
import { useChallanStore } from "../store/challanStore";
import { BsExclamationCircle } from "react-icons/bs";
import { useMutation } from "@tanstack/react-query";
import { useDebitNoteStore } from "../store/debitNoteStore";
import { LogOut } from "lucide-react";
import { useBusinessBankAccountStore } from "../store/businessBankAccountStore";
import ByaparSetu from "../assets/ByaparSetu.png";

export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const dashboardLinksItems = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    filter: "blur(0)",
  },
};

const Sidebar = () => {
  const { user } = useAuthStore();

  const navigate = useNavigate();
  // const [sidebarShrink, setSidebarShrink] = useState(false);
  const { business, setBusinesses, setBusiness } = useBusinessStore();
  const { setInvoices, setTotalInvoices } = useInvoiceStore();
  const { setUser } = useAuthStore();
  const { setItems, setItem } = useItemStore();
  const { setDeliveryChallans } = useChallanStore();
  const { setParties, setParty } = usePartyStore();
  const { setPaymentIns, setPaymentIn } = usePaymentInStore();
  const { setPaymentOuts } = usePaymentOutStore();
  const { setProformaInvoices } = useProformaInvoiceStore();
  const { setPurchaseInvoices } = usePurchaseInvoiceStore();
  const { setCategories } = useCategoryStore();
  const { setQuotations } = useQuotationStore();
  const { setDebitNotes } = useDebitNoteStore();
  const { setActiveAccount, setBankAccounts, setBankAccount } =
    useBusinessBankAccountStore();

  const { setSaleReturns } = useSalesReturnStore();
  const [currentLink, setCurrentLink] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/user/logout");
      setUser(null);
      setBusinesses(null);
      setBusiness(null);
      setInvoices(null);
      setTotalInvoices(0);
      setItems(null);
      setParties(null);
      setPaymentIns(null);
      setItem(null);
      setParty(null);
      setPaymentIn(null);
      setPaymentOuts(null);
      setDebitNotes(null);
      setProformaInvoices(null);
      setPurchaseInvoices(null);
      setDeliveryChallans(null);
      setQuotations(null);
      setSaleReturns(null);
      setActiveAccount(null);
      setBankAccounts(null);
      setBankAccount(null);
      setCategories(null);
      navigate("/login");
      toast.success("Logged out");
    },
  });

  return (
    <>
      <section className="h-screen flex flex-col bg-gradient-to-tr from-cyan-950 to-slate-950 text-white shadow-md border-r border-r-zinc-200 overflow-hidden">
        {/* nav */}
        <motion.h1
          initial={{
            translateX: -100,
            filter: "blur(10px)",
          }}
          animate={{
            translateX: 0,
            filter: "blur(0)",
          }}
          className="sticky top-0 z-10 text-md text-white font-semibold flex items-center gap-3 w-full px-5 py-3 backdrop-blur-md border-b border-b-cyan-950"
        >
          {/* <div className="avatar">
            <div className="w-8 rounded-full bg-white"></div>
          </div> */}
          
          <img src={ByaparSetu} width={"32px"} />
        </motion.h1>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {/* business details */}
          <div className="flex gap-3 px-5 py-3 items-center border-b border-b-cyan-950 ">
            <div className="border-3 bg-white border-cyan-600 rounded-2xl p-1">
              <div className="w-12 h-12 rounded-xl hover:scale-120 transition-all ease-in-out duration-300 flex items-center justify-center bg-red-200 overflow-hidden">
                {business?.logo && business?.logo !== "null" ? (
                  <img
                    src={business.logo}
                    alt="Logo"
                    className="w-full h-full object-cover " 
                  />
                ) : (
                  <span className="text-sm font-semibold text-white tracking-tight">
                    {business?.businessName?.[0]?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 tracking-tight">
              <p className="font-bold text-sm break-words whitespace-normal">
                {business?.businessName ||
                  business?.companyEmail ||
                  "Business name"}
              </p>
              <small className="text-xs text-neutral-300">
                {business?.companyPhoneNo}
              </small>
            </div>
          </div>

          <div className="py-2 border-b border-cyan-950 inset-shadow-[1px_1px_10px_rgba(0,0,0,0.5)] shadow-lg">
            <label className="font-semibold pl-4 text-xs text-[var(--primary-btn)]">
              GENERAL
            </label>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="mt-3"
            >
              {dashboardFields?.map((field, index) => (
                <motion.div key={index} variants={dashboardLinksItems}>
                  {/* Fields that have sublinks */}
                  {field.label === "Items" ||
                  field.label === "Sales" ||
                  field.label === "Purchases" ? (
                    <div className="group  flex flex-col items-start transition-all duration-200 ease-in-out">
                      {/* Parent link */}
                      <NavLink
                        to={`/dashboard/${field.label.toLowerCase()}`}
                        onClick={() => setCurrentLink(field?.label)}
                        className={({ isActive }) =>
                          `flex items-center justify-between text-xs font-medium cursor-pointer py-2 pl-[13.5px] w-full transition-all duration-200 ease-in-out text-white
                ${
                  isActive
                    ? "bg-[var(--primary-btn)]/10 text-[var(--primary-btn)] scale-105 border-l-4"
                    : "hover:text-[var(--primary-btn)]"
                }`
                        }
                      >
                        <div className="flex items-center gap-6 ">
                          <span className="transition-all duration-200 group-hover:-translate-x-2">
                            {field.icon}
                          </span>
                          <span>{field.label}</span>
                        </div>
                        <IoMdArrowDropdown className="mr-4" />
                      </NavLink>

                      {/* Sublinks */}
                      {currentLink === field.label && (
                        <div
                          name={field.label}
                          className="bg-gradient-to-r from-transparent to-zinc-500/10 text-white overflow-hidden text-xs cursor-pointer outline-none w-[80%] my-2 ml-7 z-10 transition-all duration-200  ease-in-out border-l border-l-cyan-950 "
                        >
                          {field.subLinks?.map((sublink) => (
                            <NavLink
                              key={sublink.id}
                              to={sublink.link}
                              className={({ isActive }) =>
                                `block p-2  transition-all duration-200 ease-in-out 
                              ${
                                isActive
                                  ? " text-[var(--primary-btn)] font-semibold border-l-2 "
                                  : "hover:bg-white/20"
                              }`
                              }
                            >
                              {sublink.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Normal fields without sublinks
                    <NavLink
                      onClick={() => setCurrentLink("")}
                      end
                      to={
                        field.label.toLowerCase() === "dashboard"
                          ? "/dashboard"
                          : `/dashboard/${field.label
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`
                      }
                      className={({ isActive }) =>
                        `group px-4 flex items-center gap-5 text-xs py-2 cursor-pointer transition-all ease-in-out duration-150 
                    ${
                      isActive
                        ? "bg-[var(--primary-btn)]/10 text-[var(--primary-btn)] border-l-4 font-semibold"
                        : "hover:text-[var(--primary-btn)] hover:scale-105 "
                    }`
                      }
                    >
                      {field?.icon}
                      <span className="group-hover:translate-x-2 transition-all ease-in-out duration-200">
                        {field.label}
                      </span>
                    </NavLink>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="hidden py-2 border-b border-cyan-950">
            <label className="pl-4 font-semibold text-xs text-[var(--primary-btn)]">
              ACCOUNTING SOLUTIONS
            </label>
            <motion.div
              className="mt-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {dashboardAccountingFields?.map((field) => (
                <div key={field.id} variants={dashboardLinksItems}>
                  <NavLink
                    end
                    to={field.link}
                    className={({ isActive }) =>
                      `group px-4 my-1 flex items-center gap-5 text-xs py-2 cursor-pointer transition-all ease-in-out duration-150 
                  ${
                    isActive
                      ? "bg-[var(--primary-btn)]/10 text-[var(--primary-btn)] scale-105 border-l-2"
                      : "hover:bg-[var(--primary-btn)]/0 hover:text-[var(--primary-btn)] hover:scale-105"
                  }`
                    }
                  >
                    {field?.icon}
                    <span className="group-hover:translate-x-2 transition-all ease-in-out duration-200">
                      {field.label}
                    </span>
                  </NavLink>
                </div>
              ))}
            </motion.div>
          </div>

          <div className=" py-2 border-b border-cyan-950">
            <label className=" pl-4 font-semibold text-xs text-[var(--primary-btn)]">
              SETTINGS
            </label>
            <motion.div
              className="mt-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {settingLinks?.map((field) => (
                <div key={field.id} variants={dashboardLinksItems}>
                  <NavLink
                    end
                    to={field.link}
                    className={({ isActive }) =>
                      `group px-4 my-1 flex items-center gap-5 text-xs py-2 cursor-pointer transition-all ease-in-out duration-150 
                  ${
                    isActive
                      ? "bg-[var(--primary-btn)]/10 text-[var(--primary-btn)] scale-105 border-l-2"
                      : "hover:bg-[var(--primary-btn)]/0 hover:text-[var(--primary-btn)] hover:scale-105"
                  }`
                    }
                  >
                    {field?.icon}
                    <span className="group-hover:translate-x-2 text-nowrap transition-all ease-in-out duration-200">
                      {field.label}
                    </span>
                  </NavLink>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="hidden  py-2 pb-8 border-b border-zinc-800">
            <label className=" pl-4 font-semibold text-xs text-[var(--primary-btn)]">
              BUSINESS TOOLS
            </label>
            <motion.div
              className="mt-3 mb-12"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {businessTools?.map((field) => (
                <div key={field.id} variants={dashboardLinksItems}>
                  <NavLink
                    end
                    to={field.link}
                    className={({ isActive }) =>
                      `group px-4 my-1 flex items-center gap-5 text-xs text-nowrap py-2 cursor-pointer transition-all ease-in-out duration-150 
                  ${
                    isActive
                      ? "bg-[var(--primary-btn)]/10 text-[var(--primary-btn)] scale-105 border-l-2"
                      : "hover:bg-[var(--primary-btn)]/0 hover:text-[var(--primary-btn)] hover:scale-105"
                  }`
                    }
                  >
                    {field?.icon}
                    <span className="group-hover:translate-x-2 transition-all ease-in-out duration-200">
                      {field.label}
                    </span>
                  </NavLink>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* BOTTOM PART - USER EMAIL AND LOGOUT BUTTON */}
        <div className="bg-cyan-700 w-full rounded-t-2xl flex items-center justify-between p-2 gap-2 border-t border-cyan-800">
          <small className="truncate text-white/90 text-xs">{user.email}</small>

          <button
            onClick={() => document.getElementById("my_modal_5").showModal()}
            className="group relative py-1.5 px-3 rounded-xl flex items-center justify-center gap-2 
               bg-white/10 border border-white/20 backdrop-blur-md text-white/90 
               hover:bg-white/20 hover:scale-105 hover:shadow-lg hover:text-white
               transition-all duration-300 ease-in-out"
          >
            <LogOut
              size={16}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
            <span className="text-xs font-semibold tracking-wide hidden sm:inline">
              Logout
            </span>
          </button>
        </div>

        <dialog
          id="my_modal_5"
          className="modal modal-bottom sm:modal-middle text-black"
        >
          <div className="modal-box">
            <div className="flex items-center justify-center flex-col">
              <BsExclamationCircle size={40} className="text-red-500" />
              <h1 className="mt-4 font-bold">Logout Confirmation</h1>
              <p className="text-zinc-500">
                Are you sure you want to log out from this account?
              </p>
            </div>

            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm rounded-xl">Cancel</button>
              </form>
              <button
                onClick={() => mutation.mutate()}
                className="btn btn-sm bg-red-500 rounded-xl text-white hover:bg-red-500/90"
              >
                Logout
              </button>
            </div>
          </div>
        </dialog>
      </section>
    </>
  );
};

export default Sidebar;
