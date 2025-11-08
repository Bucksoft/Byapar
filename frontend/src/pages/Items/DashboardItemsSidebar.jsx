import { useEffect, useState } from "react";
import {
  newItemsSidebarDetails,
  newServiceSidebarDetails,
} from "../../utils/constants";
import DashboardItemsBasicDetailPage from "./DashboardItemsBasicDetailPage";
import DashboardItemsStockDetailsPage from "./DashboardItemsStockDetailsPage";
import DashboardItemsPricingDetailsPage from "./DashboardItemsPricingDetailsPage";
import DashboardItemsPartyWisePricesPage from "./DashboardItemsPartyWisePricesPage";
import DashboardItemsCustomFieldsPage from "./DashboardItemsCustomFieldsPage";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import toast from "react-hot-toast";
import { queryClient } from "../../main";
import { useItemStore } from "../../store/itemStore";
import CustomLoader from "../../components/Loader";
import { useBusinessStore } from "../../store/businessStore";
import DashboardItemsSACCodePage from "./DashboardItemsSACCodePage";
import { useRef } from "react";

const DashboardItemsSidebar = ({ modalId, itemIdToEdit, isOpen }) => {
  const navigate = useNavigate();
  const [itemToBeEdited, setItemToBeEdited] = useState();
  const { state } = useLocation();
  const [itemNameError, setItemNameError] = useState("");
  const { business } = useBusinessStore();
  const { setItem, items } = useItemStore();
  const [currentField, setCurrentField] = useState("Basic Details");

  useEffect(() => {
    if (!itemIdToEdit || !items?.length) return;
    const matchingItems = items.filter((item) => item?._id === itemIdToEdit);
    setItemToBeEdited(matchingItems[0]);
  }, [itemIdToEdit, items]);

  const initialFormState = {
    itemType: "product",
    itemName: "",
    salesPrice: 0,
    salesPriceForDealer: 0,
    purchasePrice: 0,
    measuringUnit: "",
    category: "",
    gstTaxRate: "",
    openingStock: 0,
    serviceCode: "",
    SACCode: "",
    lowStockQuantity: 10,
    salesPriceType: "with tax",
    purchasePriceType: "with tax",
    itemCode: "",
    HSNCode: "",
    asOfDate: new Date(Date.now()),
    description: "",
    godown: "",
    businessId: business?._id,
    fileURLs: [""],
  };
  const [data, setData] = useState(initialFormState);

  useEffect(() => {
    if (itemToBeEdited) {
      setData({
        ...initialFormState,
        ...itemToBeEdited,
      });
    }
  }, [itemToBeEdited]);

  const handleSidebar = (title) => {
    setCurrentField(title);
  };

  const itemMutation = useMutation({
    mutationFn: async (data) => {
      if (!business) {
        throw new Error(
          "You don't have any active business yet, create one first"
        );
      }

      // check for valid name of the item
      const isValidName = /^[a-zA-Z0-9\s\-_.&/()]+$/.test(data?.itemName);

      if (!isValidName) {
        setItemNameError(
          `Use only letters, numbers, and basic symbols (- _ . / ()).`
        );
      }

      if (itemIdToEdit) {
        const res = await axiosInstance.patch(`/item/${itemIdToEdit}`, {
          data,
        });
        return res.data;
      } else {
        const res = await axiosInstance.post(`/item/${business?._id}`, {
          data,
        });
        return res.data;
      }
    },

    onSuccess: (data) => {
      toast.success(data.msg);
      setItem(data);
      setData(initialFormState);
      setItemNameError("");
      if (!itemIdToEdit) {
        document.getElementById(modalId)?.close();
      }
      setCurrentField("Basic Details");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      if (isOpen) {
        document.getElementById(modalId)?.close();
      } else {
        navigate(`/dashboard/items`);
      }
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.validationError?.itemName?._errors?.[0] ||
          err?.response?.data?.msg ||
          err?.response?.data?.err ||
          err?.message ||
          "Something went wrong"
      );
    },
  });

  return (
    <>
      <main className="h-full flex flex-col overflow-hidden rounded-md">
        <div className="w-full flex flex-col text-sm flex-1 overflow-hidden">
          {/* Title */}
          <p className="font-medium text-lg flex items-center my-3">
            <span className="mx-6">
              {state ? "Edit Item" : "Create New Item"}
            </span>
          </p>

          {/* Body (Sidebar + Main Content) */}
          <div className="flex flex-1  p-2 overflow-hidden">
            {/* Sidebar */}
            <motion.div
              initial={{ translateX: -70, opacity: 0 }}
              animate={{ translateX: 0, opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              className="w-3/10 rounded-md bg-white h-full flex flex-col overflow-auto"
            >
              {(data?.itemType === "product"
                ? newItemsSidebarDetails
                : newServiceSidebarDetails
              )?.map((item) => (
                <div
                  onClick={() => handleSidebar(item?.title)}
                  key={item.id}
                  className={`my-1 cursor-pointer rounded-md w-full transition-all ease-in duration-150 h-10 flex items-center font-normal text-gray-600 hover:bg-info/10 ${
                    item.title === currentField && "text-info bg-info/10"
                  }`}
                >
                  <button
                    className={`${
                      item.title === currentField && "text-info"
                    } flex gap-2 ml-5`}
                  >
                    {item?.icon}
                    {item.title}
                  </button>
                </div>
              ))}
            </motion.div>

            {/* Main Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
              className="rounded-md w-full bg-white p-1 flex flex-col ml-2 h-full overflow-hidden"
            >
              {/* Scrollable area */}
              <div className="flex-1 overflow-auto pr-1">
                {currentField === "Basic Details" ? (
                  <DashboardItemsBasicDetailPage
                    data={data}
                    setData={setData}
                    itemNameError={itemNameError}
                    err={
                      itemMutation.isError && itemMutation.error?.response?.data
                    }
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
                ) : currentField === "Other Details" ? (
                  <DashboardItemsSACCodePage data={data} setData={setData} />
                ) : (
                  ""
                )}
              </div>

              {/* Fixed bottom buttons */}
              <div className="w-full flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    document.getElementById(modalId).close();
                    setCurrentField("Basic Details");
                    setData(initialFormState);
                    setItemNameError("");
                  }}
                  className="btn btn-sm w-1/7"
                >
                  Cancel
                </button>

                <button
                  disabled={itemMutation.isPending}
                  onClick={() => itemMutation.mutate(data)}
                  className="btn btn-sm bg-[var(--primary-btn)] w-1/7"
                >
                  {itemMutation.isPending ? (
                    <CustomLoader text={state ? "Updating..." : "Loading..."} />
                  ) : state ? (
                    "Save Changes"
                  ) : (
                    "Save"
                  )}
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
