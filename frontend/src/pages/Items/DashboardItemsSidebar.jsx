import { useState } from "react";
import { newItemsSidebarDetails } from "../../utils/constants";
import DashboardItemsBasicDetailPage from "./DashboardItemsBasicDetailPage";
import DashboardItemsStockDetailsPage from "./DashboardItemsStockDetailsPage";
import DashboardItemsPricingDetailsPage from "./DashboardItemsPricingDetailsPage";
import DashboardItemsPartyWisePricesPage from "./DashboardItemsPartyWisePricesPage";
import DashboardItemsCustomFieldsPage from "./DashboardItemsCustomFieldsPage";

const DashboardItemsSidebar = () => {
  const [currentField, setCurrentField] = useState("Basic Details");

  const handleSidebar = (title) => {
    setCurrentField(title);
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
            <div className="w-3/15 p-2 m-3 rounded-md">
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
            </div>

            {/* Main Component */}
            <div className="shadow-lg rounded-md w-full p-10 m-6 bg-white flex-1 overflow-auto">
              {currentField === "Basic Details" ? (
                <DashboardItemsBasicDetailPage />
              ) : currentField === "Stock Details" ? (
                <DashboardItemsStockDetailsPage />
              ) : currentField === "Pricing Details" ? (
                <DashboardItemsPricingDetailsPage />
              ) : currentField === "Party Wise Prices" ? (
                <DashboardItemsPartyWisePricesPage />
              ) : (
                <DashboardItemsCustomFieldsPage />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardItemsSidebar;
