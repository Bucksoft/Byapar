import { ChevronDown, IndianRupee, Search } from "lucide-react";
import { gstRates, uomList } from "../../utils/constants";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCategoryStore } from "../../store/categoryStore";
import { useBusinessStore } from "../../store/businessStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import { queryClient } from "../../main";
import toast from "react-hot-toast";

const DashboardItemsBasicDetailPage = ({
  data,
  setData,
  err,
  itemNameError,
}) => {
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  const { business } = useBusinessStore();
  const [searchUnitQuery, setSearchUnitQuery] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const dropdownRef = useRef();
  const { setCategories } = useCategoryStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSelectOpen(false);
  };

  // FETCH ALL CATEGORIES
  const { data: categories } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await axiosInstance.get("/category");
      setCategories(res.data);
      return res.data;
    },
  });

  // ADD CATEGORY MUTATION
  const categoryMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post(`/category/${business?._id}`, {
        categoryName: data,
      });
      return res.data?.newCategory;
    },
    onSuccess: (data) => {
      setShowAddCategoryPopup(false);
      toast.success("Category added");
      setCategories([data?.categoryName, ...categories]);
      // if (dropdownRef.current) {
      //   dropdownRef.current.open = false;
      // }
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleUnitSelection = (e, unit) => {
    console.log(unit);
    setData((prev) => ({
      ...prev,
      measuringUnit: unit?.label,
    }));
    setSelectOpen(false);
  };

  const filteredUnits = useMemo(() => {
    if (!searchUnitQuery) return uomList;
    return uomList.filter((unit) =>
      unit.label.toLowerCase().includes(searchUnitQuery.toLowerCase())
    );
  });

  return (
    <main className="grid grid-cols-2 gap-15 h-full ">
      {/* left container */}
      <div className="">
        {/* PRODUCT TYPE */}
        <div className=" flex flex-col">
          <p className="text-xs text-gray-600">Item Type </p>
          <div className="h-full flex gap-2">
            <p className="px-2 py-2 text-xs text-gray-600 w-1/2 border border-[var(--primary-border)] rounded-xs flex items-center justify-between">
              {" "}
              Product
              <input
                type="radio"
                name="itemType"
                value={"product"}
                onChange={handleInputChange}
                checked={data?.itemType === "product"}
                className="radio radio-xs"
              />
            </p>
            <p className="px-2 py-2 text-xs text-gray-600 w-1/2 border border-[var(--primary-border)] rounded-xs flex items-center justify-between">
              {" "}
              Services
              <input
                type="radio"
                value={"service"}
                onChange={handleInputChange}
                checked={data?.itemType === "service"}
                name="itemType"
                className="radio radio-xs"
              />
            </p>
          </div>
        </div>

        <div className=" flex flex-col mt-5">
          <p className="text-xs text-gray-600">
            {data?.itemType === "product" ? (
              <>
                Item Name <span className="text-red-500">*</span>{" "}
              </>
            ) : (
              <>
                Service Name <span className="text-red-500">*</span>
              </>
            )}
          </p>

          <div>
            <input
              type="text"
              value={data?.itemName}
              name="itemName"
              onChange={handleInputChange}
              placeholder="eg: Apple 5kg size"
              className="px-2 w-full border border-[var(--primary-border)] rounded-xs h-8 text-xs text-gray-500"
            />
            <span className="text-xs text-red-500">
              {err?.validationError?.itemName?._errors[0]}
            </span>
            <span className="text-xs text-red-500">{itemNameError}</span>
          </div>
        </div>

        <div className=" flex flex-col mt-5">
          <span className="text-xs text-gray-600">Sales Price (Customer)</span>
          <div className="flex items-center h-8 border border-[var(--primary-border)] rounded-xs w-full">
            <IndianRupee size={16} className="text-gray-600 w-10" />
            <input
              type="text"
              value={data?.salesPrice}
              name="salesPrice"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  salesPrice: Number(e.target.value),
                }))
              }
              placeholder="eg: 200"
              className="w-60 text-xs text-gray-600 outline-none"
            />
            <select
              name="salesPriceType"
              value={data?.salesPriceType}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  salesPriceType: e.target.value.toLowerCase(),
                }))
              }
              className="select select-sm w-3/8 text-info select-ghost"
            >
              <option value={"with tax"}>With Tax</option>
              <option value={"without tax"}>Without Tax</option>
            </select>
          </div>
        </div>

        {/* SALES PRICE FOR DEALER */}
        <div className=" flex flex-col mt-5">
          <span className="text-xs text-gray-600">Sales Price (Dealer)</span>
          <div className="flex items-center h-8 border border-[var(--primary-border)] rounded-xs w-full">
            <IndianRupee size={16} className="text-gray-600 w-10" />
            <input
              type="text"
              value={data?.salesPriceForDealer}
              name="salesPrice"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  salesPriceForDealer: Number(e.target.value),
                }))
              }
              placeholder="eg: 200"
              className="w-60 text-xs text-gray-600 outline-none"
            />
            <select
              name="salesPriceType"
              value={data?.salesPriceType}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  salesPriceType: e.target.value.toLowerCase(),
                }))
              }
              className="select select-sm w-3/8 text-info select-ghost"
            >
              <option value={"with tax"}>With Tax</option>
              <option value={"without tax"}>Without Tax</option>
            </select>
          </div>
        </div>
      </div>

      {/* right container */}
      <div className="flex flex-col justify-start">
        <div className="flex flex-col ">
          <label
            htmlFor="category"
            className="text-xs text-zinc-700 flex items-center justify-between w-full "
          >
            Category
            <button
              onClick={() => setShowAddCategoryPopup(true)}
              className="text-[var(--primary-btn)] cursor-pointer"
            >
              + Add Category
            </button>
          </label>

          <select
            name="category"
            className="select select-sm w-full"
            onChange={(e) =>
              setData((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            {categories?.length > 0 &&
              categories?.map((category) => (
                <option key={category?._id} value={category?.categoryName}>
                  {category?.categoryName}
                </option>
              ))}
          </select>
          <small className="text-xs text-[var(--error-text-color)] mt-1 ">
            {
              categoryMutation.error?.response?.data?.validationError
                ?.categoryName?._errors[0]
            }
          </small>

          {/* <details ref={dropdownRef} className="dropdown z-10">
              <summary className="select select-sm">
                {data?.category || "Category"}
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box  w-52 p-2 shadow-sm">
                {categories?.map((category) => (
                  <li
                    key={category?._id}
                    onClick={(e) => {
                      setData((prev) => ({
                        ...prev,
                        category: e.target.innerHTML,
                      }));
                      setShowAddCategoryPopup(false);
                      if (dropdownRef.current) {
                        dropdownRef.current.open = false;
                      }
                    }}
                    className="text-xs hover:bg-zinc-100 p-2 cursor-pointer"
                  >
                    {category?.categoryName}
                  </li>
                ))}
              </ul>
            </details> */}
        </div>

        {/* <div className="w-full h-8 mt-10 flex items-center justify-between">
          <p className="text-xs text-gray-600">Show Item in Online Store </p>
          <input
            type="checkbox"
            defaultChecked
            className="toggle mr-5 text-gray-600 toggle-sm"
          />
        </div> */}

        <div className="flex flex-col mt-4">
          <span className="text-xs text-gray-600">GST Tax Rate (%)</span>
          <div className="">
            {/* <Search size={16} className="w-10 text-gray-600" />
            <input
              type="text"
              placeholder="Select Category"
              className="w-full text-xs outline-none"
            /> */}
            <select
              value={data?.gstTaxRate}
              onChange={handleInputChange}
              className="select select-sm w-full"
              name="gstTaxRate"
            >
              {gstRates.map((gstRate, index) => (
                <option
                  key={index}
                  className="w-full text-left text-xs px-2 py-1 hover:bg-gray-100 rounded"
                >
                  {gstRate?.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {data?.itemType === "product" ? (
          <div className="flex flex-col mt-5">
            <span className="text-xs text-gray-600">Opening Stocks</span>
            <div className="">
              <input
                name="openingStock"
                value={data?.openingStock}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    openingStock: Number(e.target.value),
                  }))
                }
                type="text"
                placeholder="eg: 150 PCS"
                className="px-2 w-full border border-[var(--primary-border)] rounded-xs h-8 text-xs text-gray-600"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col mt-5">
            <span className="text-xs text-gray-600">Service Code</span>
            <div className="">
              <input
                name="serviceCode"
                value={data?.serviceCode}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    serviceCode: e.target.value,
                  }))
                }
                type="text"
                placeholder="Enter Service Code"
                className="px-2 w-full border border-[var(--primary-border)] rounded-xs h-8 text-xs text-gray-600"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col mt-[20.9px] relative">
          <span className="text-xs text-gray-600">Measuring Unit</span>

          <div>
            <button
              onClick={() => setSelectOpen(!selectOpen)}
              className="w-full text-xs
               truncate flex items-center justify-between  border border-zinc-300 rounded p-[7.25px]"
            >
              {data?.measuringUnit?.length > 0
                ? data?.measuringUnit
                : "Select Unit"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${
                  selectOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {selectOpen && (
              <div className="absolute z-20 w-full bg-base-100 border border-gray-200 rounded-lg shadow-lg p-2">
                {/* Search Input */}
                <input
                  type="text"
                  className="input input-xs w-full mb-2"
                  placeholder="Search parties..."
                  value={searchUnitQuery}
                  onChange={(e) => setSearchUnitQuery(e.target.value)}
                />

                {/* Unit List */}
                <ul className="max-h-30 overflow-y-auto">
                  {filteredUnits?.length > 0 ? (
                    filteredUnits?.map((unit, index) => (
                      <li
                        key={index}
                        name="measuringUnit"
                        className="p-1 text-xs rounded-md hover:bg-gray-100 flex items-center justify-between cursor-pointer truncate"
                        onClick={(e) => handleUnitSelection(e, unit)}
                      >
                        {unit?.label} ({unit?.code})
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-sm text-gray-500">
                      No units found
                    </li>
                  )}
                </ul>
              </div>
            )}
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
              value={data?.category}
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
                onClick={() => {
                  categoryMutation.mutate(data?.category);
                  setShowAddCategoryPopup(false);
                }}
                className="btn btn-sm bg-[var(--secondary-btn)]"
              >
                Add
              </button>
            </div>
          </motion.div>

          {selectOpen && (
            <div className="absolute z-15 w-full bg-base-100 border border-gray-200 rounded-lg shadow-lg p-2">
              {/* Search Input */}
              <input
                type="text"
                className="input input-xs w-full mb-2"
                placeholder="Search parties..."
                value={searchUnitQuery}
                onChange={(e) => setSearchUnitQuery(e.target.value)}
              />

              {/* Unit List */}
              <ul className="max-h-30 overflow-y-auto">
                {filteredUnits?.length > 0 ? (
                  filteredUnits?.map((unit, index) => (
                    <li
                      key={index}
                      name="measuringUnit"
                      className="p-1 text-xs rounded-md hover:bg-gray-100 flex items-center justify-between cursor-pointer truncate"
                      onClick={(e) => handleUnitSelection(e, unit)}
                    >
                      {unit?.label} ({unit?.code})
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-sm text-gray-500">No units found</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default DashboardItemsBasicDetailPage;
