import { IoSettingsOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DashboardNavbar = ({ title, isReport }) => {
  const navigate = useNavigate();
  const handleChange = (e) => {
    const link = e.target.value;
    navigate(
      `/dashboard/reports?type=${
        link === "Stock Summary"
          ? "Stock Value"
          : link === "Low Stock Summary"
          ? "Low Stock"
          : link
      }`
    );
  };

  return (
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
      className="flex items-start justify-between px-4"
    >
      <h2 className="font-semibold text-lg">{title}</h2>

      {/* Reports dropdown */}
      <div className="flex gap-5 items-center ">
        <div className="">
          {isReport && (
            <select onChange={handleChange} className="select select-sm">
              {title === "Items" ? (
                <>
                  <option value={"Rate List"} className="hidden">
                    Rate List
                  </option>
                  <option value={"Rate List"}>Rate List</option>
                  <option value={"Stock Summary"}>Stock Summary</option>
                  <option value={"Low Stock Summary"}>Low Stock Summary</option>
                  <option value={"Item Sales Summary"}>
                    Item Sales Summary
                  </option>
                </>
              ) : (
                title === "Sales Invoice" && (
                  <>
                    <option value={"Sales Summary"} className="hidden">
                      Sales Summary
                    </option>
                    <option value={"Sales Summary"}>Sales Summary</option>
                    <option value={"GSTR-1 (Sales)"}>GSTR-1 (Sales)</option>
                    <option value={"DayBook"}>DayBook</option>
                    <option value={"Bill Wise Profit"}>Bill Wise Profit</option>
                  </>
                )
              )}
            </select>
          )}
        </div>

        <button className="btn btn-square btn-sm bg-transparent group">
          <IoSettingsOutline
            size={15}
            className="group-hover:rotate-360 transition ease-in-out duration-300 group-hover:scale-105  "
          />
        </button>
      </div>
    </motion.div>
  );
};

export default DashboardNavbar;
