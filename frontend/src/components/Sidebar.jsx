import {
  businessTools,
  dashboardAccountingFields,
  dashboardFields,
  settingLinks,
} from "../lib/dashboardFields";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbLogout2 } from "react-icons/tb";
import { useAuthStore } from "../store/authStore";
import { axiosInstance } from "../config/axios";
import CustomLoader from "./Loader";
import toast from "react-hot-toast";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
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
import ByaparLogo from "../assets/Byapar_Logo.svg";
import { useDebitNoteStore } from "../store/debitNoteStore";

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

      setCategories(null);
      navigate("/login");
      toast.success("Logged out");
    },
  });

  return (
    <>
      <section className="h-screen bg-[var(--sidebar-background)] text-black/70 max-h-screen overflow-y-auto hide-scrollbar relative shadow-md rounded-tr-2xl rounded-br-2xl border-r-2 border-r-zinc-200 ">
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
          className="sticky top-0 z-10 text-md text-black font-semibold flex items-center  gap-3 w-full px-5 py-3 backdrop-blur-md border-b border-b-zinc-200"
        >
          <img
            src={"https://byapar.bucksoftech.top/upload/Byapar_Logo.svg"}
            alt="Byapar_logo"
            className=" w-8 h-8 "
            loading="lazy"
          />
          {/* <button
            className="cursor-pointer"
            onClick={() => setSidebarShrink((prev) => !prev)}
          >
            <RiMenu3Fill />
          </button> */}
          <span className="-ml-[13.5px]">yapar</span>
        </motion.h1>

        {/* business details */}
        <div className="flex gap-3 px-5 py-3 items-center border-b border-b-zinc-200 ">
          <div className="border-3 bg-white border-zinc-300 rounded-2xl p-1">
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
            <p className="font-semibold text-sm break-words whitespace-normal">
              {business?.businessName ||
                business?.companyEmail ||
                "Business name"}
            </p>
            <small className="text-xs text-neutral-500">
              {business?.companyPhoneNo}
            </small>
          </div>
        </div>

        <div className="py-2 border-b border-zinc-300">
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
                        `flex items-center justify-between text-xs font-medium cursor-pointer py-2 pl-[13.5px] w-full transition-all duration-200 ease-in-out text-black/70
                ${
                  isActive
                    ? "bg-[var(--primary-btn)]/10 text-[var(--primary-btn)]  scale-105"
                    : "hover:text-[var(--primary-btn)] "
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
                        className="bg-gradient-to-r from-transparent to-zinc-500/10 text-black overflow-hidden text-xs cursor-pointer outline-none w-[80%] my-2 ml-7 z-10 transition-all duration-200  ease-in-out border-l border-l-zinc-200  rounded-tr-xl rounded-br-xl "
                      >
                        {field.subLinks?.map((sublink) => (
                          <NavLink
                            key={sublink.id}
                            to={sublink.link}
                            className={({ isActive }) =>
                              `block p-2 rounded-md transition-all duration-200 ease-in-out 
                              ${
                                isActive
                                  ? " text-[var(--primary-btn)] font-semibold  "
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
                        ? "bg-[var(--primary-btn)]/10 text-[var(--primary-btn)] font-semibold"
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

        <div className="hidden py-2 border-b border-zinc-300">
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

        <div className="hidden py-2 border-b border-zinc-800">
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

        {/* LOGOUT BUTTON */}
        <button
          onClick={() => document.getElementById("my_modal_5").showModal()}
          className="fixed bottom-0 w-1/6 flex items-center justify-center p-2"
        >
          <div className="flex items-center gap-3 justify-center bg-info px-5 py-2 rounded-md backdrop-blur-md w-[99%]">
            <TbLogout2 className="group-hover:rotate-90 transition-all ease-in-out duration-200 group-hover:scale-120" />
            Logout
          </div>
        </button>

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
                <button className="btn btn-sm">Cancel</button>
              </form>
              <button
                onClick={() => mutation.mutate()}
                className="btn btn-sm bg-red-500 text-white hover:bg-red-500/90"
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
