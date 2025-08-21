import { IoSettingsOutline } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DashboardNavbar = ({ title, isReport }) => {
  const navigate = useNavigate();
  const [selectedLink, setSelectedLink] = useState("");
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
            <select
              value={selectedLink}
              onChange={handleChange}
              className="select select-sm"
            >
              <option disabled={true} className="hidden">
                Reports
              </option>
              {title === "Items" && (
                <>
                  <option>Rate List</option>
                  <option>Stock Summary</option>
                  <option>Low Stock Summary</option>
                  <option>Item Sales Summary</option>
                </>
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
