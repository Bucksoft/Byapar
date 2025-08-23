import { Plus } from "lucide-react";
import ByaparLogo from "../assets/Byapar.png";
import {
  businessTools,
  dashboardAccountingFields,
  dashboardFields,
  settingLinks,
} from "../lib/dashboardFields";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbLogout2 } from "react-icons/tb";
import { useAuthStore } from "../store/authStore";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import CustomLoader from "./Loader";
import toast from "react-hot-toast";
import { useState } from "react";

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
  const { user, setUser } = useAuthStore();
  const [currentLink, setCurrentLink] = useState("");
  const handleChange = (e) => {
    const selectedLink = e.target.value;
    if (selectedLink) navigate(selectedLink);
  };

  const mutation = {
    mutationFn: async () => {
      await axiosInstance.post("/user/logout");
      setUser(null);
      navigate("/login");
      toast.success("Logged out");
    },
  };

  console.log(currentLink);

  return (
    <>
      <section className="bg-[var(--sidebar-background)] text-white/70 shadow-md max-h-screen overflow-y-auto hide-scrollbar border border-zinc-200 relative">
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
          className="sticky top-0 z-10 text-md text-white font-semibold flex items-center gap-3 w-full px-5 py-3 bg-white/10 backdrop-blur-md"
        >
          <img
            src={ByaparLogo}
            alt="Byapar_logo"
            className="-ml-8"
            width={150}
          />
        </motion.h1>

        {/* business details */}
        <div className="flex flex-col gap-3 px-5 py-3 items-center border-b border-b-zinc-800">
          <div className="avatar avatar-sm">
            <div className="w-9 rounded-full">
              <img
                src="https://img.daisyui.com/images/profile/demo/superperson@192.webp"
                alt="Tailwind-CSS-Avatar-component"
              />
            </div>
          </div>
          <p className="font-medium text-xs">
            {user?.email || "Business name"}
          </p>
        </div>

        <div className="py-2 border-b border-zinc-800">
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
                  <div className="group flex flex-col items-start transition-all duration-200 ease-in-out">
                    {/* Parent link */}
                    <NavLink
                      to={`/dashboard/${field.label.toLowerCase()}`}
                      onClick={() => setCurrentLink(field?.label)}
                      className={({ isActive }) =>
                        `flex items-center gap-6 text-xs font-medium cursor-pointer py-2 pl-[13.5px] w-full transition-all duration-200 ease-in-out
                ${
                  isActive
                    ? "bg-[var(--primary-btn)]/10 text-[var(--primary-btn)] border-l-2 scale-105"
                    : "hover:text-[var(--primary-btn)] "
                }`
                      }
                    >
                      <span className="transition-all duration-200 group-hover:-translate-x-2">
                        {field.icon}
                      </span>
                      {field.label}
                    </NavLink>

                    {/* Sublinks */}
                    {currentLink === field.label && (
                      <div
                        name={field.label}
                        className="bg-white/10 rounded-lg overflow-hidden text-xs cursor-pointer outline-none w-[80%] mb-2 ml-7 z-10 transition-all duration-200 ease-in-out"
                      >
                        {field.subLinks?.map((sublink) => (
                          <NavLink
                            key={sublink.id}
                            to={sublink.link}
                            className={({ isActive }) =>
                              `block p-2 rounded-md transition-all duration-200 ease-in-out 
                      ${
                        isActive
                          ? "bg-[var(--primary-btn)]/20 text-[var(--primary-btn)] font-semibold"
                          : "text-white hover:bg-white/20"
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
                  ? "bg-[var(--primary-btn)]/10 text-[var(--primary-btn)] scale-105 border-l-2"
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

        <div className=" py-2 border-b border-zinc-800">
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

        <div className=" py-2 border-b border-zinc-800">
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

        <div className="py-2 pb-8 border-b border-zinc-800">
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

        <button
          onClick={() => mutation.mutate()}
          className="fixed bottom-0 w-1/6 flex items-center justify-center p-2 "
        >
          <div className="flex items-center gap-3 justify-center bg-info px-5 py-2 rounded-md backdrop-blur-md w-[99%]">
            {mutation.isPending ? (
              <>
                <CustomLoader text={"Logging out...."} />
              </>
            ) : (
              <>
                <TbLogout2 className="group-hover:rotate-90 transition-all ease-in-out duration-200 group-hover:scale-120" />
                Logout
              </>
            )}
          </div>
        </button>
      </section>
    </>
  );
};

export default Sidebar;
