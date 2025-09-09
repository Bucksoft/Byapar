import DashboardNavbar from "../components/DashboardNavbar";
import { Plus, Search } from "lucide-react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { LuPackageSearch } from "react-icons/lu";
import no_items from "../assets/no_items.jpg";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { dashboardItemsCardDetails } from "../lib/dashboardItemCards";
import { motion } from "framer-motion";
import { container, dashboardLinksItems } from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { queryClient } from "../main";
import CustomLoader from "../components/Loader";
import { useItemStore } from "../store/itemStore";
import { useEffect, useState } from "react";
import ItemsList from "../components/Items/ItemsList";
import { useBusinessStore } from "../store/businessStore";

const DashboardItemsPage = () => {
  const navigate = useNavigate();
  const { setItems } = useItemStore();
  const { business } = useBusinessStore();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: items,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/item/all/${business?._id}`);
      return res.data?.items;
    },
  });

  useEffect(() => {
    if (isSuccess && items) {
      setItems(items);
      queryClient.invalidateQueries({ queryKey: ["items"] });
    }
  }, [isSuccess, items]);

  const searchedItems = items?.filter((item) =>
    item?.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Items"} isReport={"true"} />

        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-2 "
        >
          {dashboardItemsCardDetails?.map((details) => (
            <motion.div
              onClick={() =>
                navigate(`/dashboard/reports?type=${details.label}`)
              }
              variants={dashboardLinksItems}
              key={details.id}
              className={`border rounded-md p-3 mt-5 shadow-md border-${details?.color} bg-${details.color}/10 hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
            >
              <p className={`flex items-center gap-3 text-${details.color}`}>
                {details.icon} {details.label}
              </p>
              <span className="font-medium text-2xl flex gap-2 items-center">
                {details?.label === "Stock Value" && (
                  <FaIndianRupeeSign size={14} />
                )}
                1
              </span>
            </motion.div>
          ))}
        </motion.section>

        <motion.div
          initial={{
            opacity: 0,
            scaleY: 0,
          }}
          animate={{
            opacity: 1,
            scaleY: 1,
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.2,
          }}
          className="flex items-center justify-between mt-8 "
        >
          <div className="flex items-center gap-2">
            <label className="input input-sm">
              <Search size={16} className="text-zinc-400" />
              <input
                type="search"
                required
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
            <button className="btn btn-ghost btn-sm ">
              <LuPackageSearch className="flex items-center" /> Show Low Stock
            </button>
          </div>

          <div>
            <Link
              to={"/dashboard/items/basic-details"}
              className="btn btn-sm bg-[var(--primary-btn)]"
            >
              <Plus size={14} /> Create Item
            </Link>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 ">
            <CustomLoader text={"Getting all items..."} />
          </div>
        ) : (
          <>
            {items ? (
              <>
                {/* Component to render List items */}
                <ItemsList items={searchedItems} />
              </>
            ) : (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.2,
                  delay: 0.2,
                }}
                className="flex items-center justify-center  flex-col"
              >
                <img src={no_items} alt="no_items" width={250} />
                <h3 className="font-semibold">Add all your Items at once!</h3>
                <p className="text-zinc-500 text-xs">
                  For quicker and easier experience of creating sales invoices
                </p>
                <button className="btn btn-soft btn-sm mt-4 bg-[var(--primary-btn)]">
                  {" "}
                  <PiMicrosoftExcelLogoFill size={15} /> Add Items with Excel
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default DashboardItemsPage;
