import { Plus } from "lucide-react";
import { FaMoneyBillAlt } from "react-icons/fa";
import {
  businessTools,
  dashboardAccountingFields,
  dashboardFields,
  settingLinks,
} from "../lib/dashboardFields";
import { IoSettings } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TbLogout2 } from "react-icons/tb";
import { BiChevronDown } from "react-icons/bi";

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
  const handleChange = (e) => {
    const selectedLink = e.target.value;
    if (selectedLink) navigate(selectedLink);
  };

  return (
    <>
      <section className=" bg-gradient-to-b from-sky-50 to-white  text-black shadow-md max-h-screen overflow-y-auto hide-scrollbar border border-zinc-200 ">
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
          className="sticky top-0 bg-sky-950 z-10 text-md text-white font-semibold flex items-center gap-3 w-full px-5 py-3 border-b border-zinc-200"
        >
          <FaMoneyBillAlt size={20} />
          ByaPar
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
          <span className="font-medium">BuckSoftechPvtLtd</span>
        </div>

        {/* dropdown */}
        <div className="dropdown dropdown-start w-full flex justify-center  border-b pb-3 border-zinc-200">
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
            className="btn btn-sm m-1 w-3/4 bg-info text-white rounded-full shadow-md  
            transition-all ease-in-out duration-200 hover:h-10
            "
          >
            <Plus size={16} /> Create
          </motion.div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>

        <div className="px-5 py-2 border-b border-zinc-200">
          <label className="font-semibold text-xs">GENERAL</label>
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
                  <div className="group flex items-center px-4 hover:text-info transition-all duration-200 ease-in-out">
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
                      <option value="" disabled>
                        {field.label}
                      </option>

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
                      ? "bg-info/10 text-[var(--primary-btn-color)] scale-105 border-l-2"
                      : "hover:bg-info/0 hover:text-[var(--primary-btn-color)] hover:scale-105"
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

        <div className="px-5 py-2 border-b border-zinc-200">
          <label className="font-semibold text-xs">ACCOUNTING SOLUTIONS</label>
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
                      ? "bg-info/10 text-[var(--primary-btn-color)] scale-105 border-l-2"
                      : "hover:bg-info/0 hover:text-[var(--primary-btn-color)] hover:scale-105"
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

        <div className="px-5 py-2 border-b border-zinc-200">
          <label className="font-semibold text-xs">SETTINGS</label>
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
                      ? "bg-info/10 text-[var(--primary-btn-color)] scale-105 border-l-2"
                      : "hover:bg-info/0 hover:text-[var(--primary-btn-color)] hover:scale-105"
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

        <div className="px-5 pt-2 pb-8 border-b border-zinc-200">
          <label className="font-semibold text-xs">BUSINESS TOOLS</label>
          <motion.div
            className="mt-3"
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
                      ? "bg-info/10 text-[var(--primary-btn-color)] scale-105 border-l-2"
                      : "hover:bg-info/0 hover:text-[var(--primary-btn-color)] hover:scale-105"
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

        <button className="hover:bg-slate-800  transition-all ease-in-out duration-700 hover:text-white group px-5 py-3 flex items-center gap-3 bg-info text-white w-full cursor-pointer">
          <TbLogout2 className="group-hover:rotate-90 transition-all ease-in-out duration-200 group-hover:scale-120" />{" "}
          Logout
        </button>
      </section>
    </>
  );
};

export default Sidebar;
