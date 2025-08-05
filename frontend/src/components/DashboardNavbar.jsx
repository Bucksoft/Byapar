import { IoSettingsOutline } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import { motion } from "framer-motion";

const DashboardNavbar = ({ title }) => {
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
      className="flex items-center justify-between"
    >
      <h2 className="font-semibold text-lg">{title}</h2>

      {/* Reports dropdown */}
      <div className="flex gap-5 items-center">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-sm m-1 btn-dash btn-wide btn-info"
          >
            <TbReportSearch size={14} /> Reports
          </div>
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
