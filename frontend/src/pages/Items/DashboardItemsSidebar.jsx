import { useState } from "react";
import { newItemsSidebarDetails } from "../../utils/constants";
import DashboardItemsBasicDetailPage from "./DashboardItemsBasicDetailPage";
import DashboardItemsStockDetailsPage from "./DashboardItemsStockDetailsPage";
import DashboardItemsPricingDetailsPage from "./DashboardItemsPricingDetailsPage";
import DashboardItemsPartyWisePricesPage from "./DashboardItemsPartyWisePricesPage";
import DashboardItemsCustomFieldsPage from "./DashboardItemsCustomFieldsPage";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DashboardItemsSidebar = () => {
  const navigate = useNavigate();
  const [currentField, setCurrentField] = useState("Basic Details");
  const [data, setData] = useState({
    itemType: "product",
    itemName: "",
    salesPrice: 0,
    measuringUnit: "",
    category: "",
    gstTaxRate: "",
    openingStock: 0,
    salesPriceType: "",
  });

  const handleSidebar = (title) => {
    setCurrentField(title);
  };

  const handleSubmit = () => {
    console.log(data);
  };

  return (
    <>
      <main className="w-full min-h-screen flex flex-col">
        <div className="w-full flex flex-col text-sm flex-1">
          <p className="font-medium text-lg py-5 flex items-center bg-white">
            <span className="mx-6">Create New Item</span>
          </p>

          <div className="flex flex-1 ">
            {/* Sidebar */}
            <motion.div
              initial={{
                translateX: -70,
                opacity: 0,
              }}
              animate={{
                translateX: 0,
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="w-3/15 p-2 m-3 rounded-md"
            >
              <div className="flex items-center shadow-lg rounded-md flex-col p-3 h-full bg-white">
                {newItemsSidebarDetails?.map((item) => (
                  <div
                    onClick={() => handleSidebar(item?.title)}
                    key={item.id}
                    className={`my-2 cursor-pointer rounded-md w-full transition-all ease-in duration-150 h-10 flex items-center font-normal text-gray-600 hover:bg-info/10 ${
                      item.title === currentField && "text-info bg-info/10"
                    }`}
                  >
                    <button
                      className={` ${
                        item.title === currentField && "text-info"
                      } flex gap-2 ml-5`}
                    >
                      {item?.icon}
                      {item.title}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Main Component */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.3,
              }}
              className="shadow-lg rounded-md w-full bg-white p-10 m-6 flex-1 h-[calc(100vh-150px)] flex flex-col"
            >
              {/* Scrollable fixed-height content */}
              <div className="flex-1 overflow-auto">
                <div className="h-full">
                  {currentField === "Basic Details" ? (
                    <DashboardItemsBasicDetailPage
                      data={data}
                      setData={setData}
                    />
                  ) : currentField === "Stock Details" ? (
                    <DashboardItemsStockDetailsPage
                      data={data}
                      setData={setData}
                    />
                  ) : currentField === "Pricing Details" ? (
                    <DashboardItemsPricingDetailsPage
                      data={data}
                      setData={setData}
                    />
                  ) : currentField === "Party Wise Prices" ? (
                    <DashboardItemsPartyWisePricesPage />
                  ) : (
                    <DashboardItemsCustomFieldsPage />
                  )}
                </div>
              </div>

              {/* Fixed button at bottom */}
              {/* <div className="divider"></div> */}
              <div className="w-full flex justify-end gap-3 mt-4 ">
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-sm w-1/7"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-sm bg-[var(--primary-btn)] w-1/7"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardItemsSidebar;
