import { ChevronDown, IndianRupee, Search } from "lucide-react";
import { gstRates, uomList } from "../../utils/constants";
import { useState } from "react";
import { motion } from "framer-motion";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";

const DashboardItemsBasicDetailPage = ({ data, setData }) => {
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const mutation = useMutation({
    
  })

  return (
    <main className="grid grid-cols-2 gap-15">
      {/* left container */}
      <div className="">
        <div className=" flex flex-col">
          <span className="text-xs text-gray-600">Item Type</span>
          <div className="h-full flex">
            <p className="px-2 py-2 text-xs text-gray-600 w-1/2 mt-2 border border-[var(--primary-border)] rounded-xs flex items-center justify-between">
              {" "}
              Product
              <input
                type="radio"
                name="itemType"
                value={"product"}
                onChange={handleInputChange}
                checked={data.itemType === "product"}
                className="radio radio-xs"
              />
            </p>
            <p className="px-2 text-xs text-gray-600 w-1/2 mt-2 border border-[var(--primary-border)] rounded-xs ml-5 flex items-center justify-between">
              {" "}
              Services
              <input
                type="radio"
                value={"service"}
                onChange={handleInputChange}
                checked={data.itemType === "service"}
                name="itemType"
                className="radio radio-xs"
              />
            </p>
          </div>
        </div>

        <div className=" flex flex-col mt-5">
          <span className="text-xs text-gray-600">Item Name</span>
          <div className="">
            <input
              type="text"
              value={data.itemName}
              name="itemName"
              onChange={handleInputChange}
              placeholder="eg: Apple 5kg size"
              className="px-2 w-full border border-[var(--primary-border)] rounded-xs h-8 text-xs text-gray-500"
            />
          </div>
        </div>

        <div className=" flex flex-col mt-5">
          <span className="text-xs text-gray-600">Sales Price</span>
          <div className="flex items-center h-8 border border-[var(--primary-border)] rounded-xs w-full">
            <IndianRupee size={16} className="text-gray-600 w-10" />
            <input
              type="text"
              value={data.salesPrice}
              name="salesPrice"
              onChange={handleInputChange}
              placeholder="eg: 200"
              className="w-60 text-xs text-gray-600 outline-none"
            />
            <select
              name="salesPriceType"
              value={data.salesPriceType}
              onChange={handleInputChange}
              className="outline-none text-xs px-3 bg-zinc-200 rounded-md mr-3"
            >
              <option>With Tax</option>
              <option>Without Tax</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col mt-5">
          <span className="text-xs text-gray-600">Measuring Unit</span>

          <div className="flex items-center h-8 border border-[var(--primary-border)] rounded-xs">
            <select
              name="measuringUnit"
              className="outline-none w-full text-zinc-500"
              value={data.measuringUnit}
              onChange={handleInputChange}
            >
              {uomList.map((unit, index) => (
                <option key={index} className="w-full">
                  <button className="w-full text-left text-xs px-2 py-1 hover:bg-gray-100 rounded">
                    {unit?.label} ({unit?.code})
                  </button>
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* right container */}
      <div className="">
        <div className="flex flex-col">
          <span className="text-xs text-gray-600">Category</span>
          <div className="flex items-center h-8 border border-[var(--primary-border)] rounded-xs mt-2">
            <input
              type="text"
              value={data.category}
              placeholder="Select Category"
              className="w-full text-xs outline-none pl-3"
            />
            <div
              value={data.category}
              onChange={handleInputChange}
              name="category"
              className="dropdown dropdown-end w-5 mr-5"
            >
              <div
                tabIndex={0}
                role="button"
                className="text-xs font-medium flex items-center justify-between text-gray-600"
              >
                <ChevronDown size={20} className="text-gray-600" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-xs text-gray-600"
              >
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <button
                  className="btn btn-dash btn-sm btn-info"
                  onClick={() => {
                    setShowAddCategoryPopup(true);
                  }}
                >
                  Add Category
                </button>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full h-8 mt-10 flex items-center justify-between">
          <p className="text-xs text-gray-600">Show Item in Online Store </p>
          <input
            type="checkbox"
            defaultChecked
            className="toggle mr-5 text-gray-600 toggle-sm"
          />
        </div>

        <div className="flex flex-col mt-5">
          <span className="text-xs text-gray-600">GST Tax Rate (%)</span>
          <div className="flex items-center h-8 border border-[var(--primary-border)] rounded-xs ">
            {/* <Search size={16} className="w-10 text-gray-600" />
            <input
              type="text"
              placeholder="Select Category"
              className="w-full text-xs outline-none"
            /> */}
            <select
              value={data.gstTaxRate}
              onChange={handleInputChange}
              className="w-full text-zinc-500 outline-none"
              name="gstTaxRate"
            >
              {gstRates.map((gstRate, index) => (
                <option key={index} className="w-full">
                  <button className="w-full text-left text-xs px-2 py-1 hover:bg-gray-100 rounded">
                    {gstRate?.label}
                  </button>
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col mt-5">
          <span className="text-xs text-gray-600">Opening Stocks</span>
          <div className="">
            <input
              name="openingStock"
              value={data.openingStock}
              onChange={handleInputChange}
              type="text"
              placeholder="eg: 150 PCS"
              className="px-2 w-full border border-[var(--primary-border)] rounded-xs h-8 text-xs text-gray-600"
            />
          </div>
        </div>
      </div>
      {showAddCategoryPopup && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          {/* Modal Box with Animation */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white shadow-2xl rounded-2xl p-6 w-[400px] max-w-[90%] "
          >
            {/* Header */}
            <h1 className="text-lg font-semibold text-gray-800">
              Add Category
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create a new category for your items
            </p>

            {/* Input */}
            <input
              type="text"
              value={data.category}
              onChange={handleInputChange}
              name="category"
              className="input input-sm mt-4 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ex: Electronics"
            />

            {/* Footer Actions */}
            <div className="mt-5 flex justify-end gap-3">
              <button
                className="btn btn-sm"
                onClick={() => setShowAddCategoryPopup(false)}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddCategoryPopup(false)}
                className="btn btn-sm bg-[var(--secondary-btn)]"
              >
                Add
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default DashboardItemsBasicDetailPage;
