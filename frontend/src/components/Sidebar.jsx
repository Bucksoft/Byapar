import { Plus } from "lucide-react";
import ByaparLogo from "../assets/Byapar.png";
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
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import CustomLoader from "./Loader";
import toast from "react-hot-toast";

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
  const handleChange = (e) => {
    const selectedLink = e.target.value;
    if (selectedLink) navigate(selectedLink);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/user/logout");
      setUser(null);
      navigate("/login");
      toast.success("Logged out");
    },
  });

  return (
    <>
      <section className="bg-[var(--sidebar-background)] text-white/70 shadow-md max-h-screen overflow-y-auto hide-scrollbar border border-zinc-200 relative ">
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
          onScroll={() => console.log("Sad")}
          className="sticky top-0 z-10 text-md text-white font-semibold flex items-center gap-3 w-full px-5 py-3 bg-info/10 backdrop-blur-md"
        >
          <img
            src={ByaparLogo}
            alt="Byapar_logo"
            className="-ml-8"
            width={150}
          />
        </motion.h1>

        {/* business details */}
        <div className="flex gap-3 px-5 py-3 items-center">
          <div className="avatar">
            <div className="w-10 rounded">
              <img
                src="https://img.daisyui.com/images/profile/demo/superperson@192.webp"
                alt="Tailwind-CSS-Avatar-component"
              />
            </div>
          </div>
          <span className="font-medium text-xs">{user?.email}</span>
        </div>

        {/* dropdown */}
        <div className="dropdown dropdown-start w-full flex justify-center  border-b pb-3 border-zinc-800">
          <motion.div
            initial={{
              filter: "blur(10px)",
              scale: 0,
            }}
            animate={{
              filter: "blur(0)",
              scale: 1,
            }}
            tabIndex={0}
            role="button"
            className="btn btn-sm m-1 w-3/4 bg-[var(--primary-btn)] text-white border-none rounded-full shadow-sm  
            transition-all ease-in-out duration-200 hover:h-10 shadow-info/60
            "
          >
            <Plus size={16} /> Create
          </motion.div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-200 text-black rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>

        <div className="px-5 py-2 border-b border-zinc-800">
          <label className="font-semibold text-xs text-[var(--primary-btn)]">
            GENERAL
          </label>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-3"
          >
            {dashboardFields?.map((field, index) => (
              <motion.div variants={dashboardLinksItems}>
                {field.label === "Items" ||
                field.label === "Sales" ||
                field.label === "Purchases" ? (
                  <div className="group flex items-center px-4 hover:text-[var(--primary-btn)] transition-all duration-200 ease-in-out">
                    <span className="group-hover:-translate-x-2 transition-all duration-200 ease-in-out">
                      {field.icon}
                    </span>
                    <select
                      name={field.label}
                      onChange={handleChange}
                      defaultValue="" // ensures first option is shown initially
                      className="group-hover:translate-x-2 px-4 text-xs py-2 cursor-pointer outline-none w-full transition-all duration-200 ease-in-out"
                    >
                      {/* Disabled visible placeholder */}
                      <option disabled>{field.label}</option>

                      {field.subLinks.map((sublink) => (
                        <option
                          value={sublink.link}
                          key={sublink.id}
                          className="text-black"
                        >
                          {sublink.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <NavLink
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
                      : "hover:bg-[var(--primary-btn)]/0 hover:text-[var(--primary-btn)] hover:scale-105"
                  }`
                      }
                    >
                      {field?.icon}
                      <span className="group-hover:translate-x-2 transition-all ease-in-out duration-200">
                        {field.label}
                      </span>
                    </NavLink>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="px-5 py-2 border-b border-zinc-800">
          <label className="font-semibold text-xs text-[var(--primary-btn)]">
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
        <div className="px-5 py-2 border-b border-zinc-800">
          <label className="font-semibold text-xs text-[var(--primary-btn)]">
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

        <div className="px-5 py-2 pb-8 border-b border-zinc-800">
          <label className="font-semibold text-xs text-[var(--primary-btn)]">
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
          className="hover:bg-slate-800 fixed bottom-0 transition-all ease-in-out duration-700 hover:text-white group px-5 py-3 flex items-center gap-3 bg-[var(--primary-btn)] text-white w-1/5  cursor-pointer"
        >
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
        </button>
      </section>
    </>
  );
};

export default Sidebar;
