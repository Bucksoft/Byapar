import { Plus, Info, UploadCloud } from "lucide-react";
import "react-day-picker/dist/style.css";
import { useInvoiceStore } from "../../store/invoicesStore";
import { useEffect, useState } from "react";

const DashboardItemsStockDetailsPage = ({ data, setData }) => {
  const [lowStockQuantityPopup, setLowStockQuantity] = useState(false);
  const { invoices } = useInvoiceStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const formatDate = (date) => {
  //   if (!date) return "";
  //   if (typeof date === "string") return date;
  //   if (date instanceof Date && !isNaN(date)) {
  //     return date.toISOString().split("T")[0];
  //   }
  //   return "";
  // };

  return (
    <main className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left section */}
        <div className="space-y-5">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600">Item Code</label>
            <div className="flex items-center border border-gray-300 rounded">
              <input
                type="text"
                name="itemCode"
                value={data.itemCode}
                onChange={handleInputChange}
                placeholder="eg: ITEM 45652"
                className="input input-sm border-none"
              />
              <span className="text-xs text-gray-600 pr-2">
                Generate Barcode
              </span>
            </div>
          </div>

          {/* <div className="flex flex-col">
            <label className="text-xs text-gray-600">Measuring Unit</label>
            <select
              name="measuringUnit"
              value={data.measuringUnit}
              onChange={handleInputChange}
              className="select select-sm w-full"
            >
              {uomList.map((unit, idx) => (
                <option key={idx} value={unit.code}>
                  {unit.label} ({unit.code})
                </option>
              ))}
            </select>
          </div> */}

          {/* <div className="flex items-center space-x-1 text-info text-xs">
            <Plus size={16} />
            <span>Alternative Unit</span>
          </div> */}

          <div className="flex flex-col">
            <label className="text-xs text-gray-600">Godowns</label>
            <select
              name="godown"
              value={data.godown}
              onChange={handleInputChange}
              className="select select-sm w-full"
            >
              <option disabled value="">
                Select Godown
              </option>
              <option value="Godown name">Godown name</option>
            </select>
          </div>

          {/* <div className="flex flex-col">
            <label className="text-xs text-gray-600">Opening Stocks</label>
            <input
              name="openingStock"
              type="number"
              value={data.openingStock}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  openingStock: Number(e.target.value),
                }))
              }
              placeholder="eg: 150"
              className="input input-sm"
            />
          </div> */}

          <div
            onClick={() => setLowStockQuantity(!lowStockQuantityPopup)}
            className="cursor-pointer flex items-center space-x-1 text-info text-xs"
          >
            <Plus size={16} />
            <span>Enable low stock quantity warning</span>
            <Info size={16} />
          </div>

          {lowStockQuantityPopup && (
            <div className="flex flex-col gap-2 p-4 bg-zinc-100 rounded-md">
              <label>Low Stock Quantity</label>
              <input
                type="number"
                name="lowStockQuantity"
                value={data.lowStockQuantity}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    lowStockQuantity: e.target.value,
                  }))
                }
                placeholder="Enter low stock quantity"
                className="input input-sm"
              />
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="space-y-5 ">
          <div className="flex flex-col relative">
            <label className="text-xs text-gray-600">HSN Code</label>
            <input
              type="text"
              name="HSNCode"
              value={data.HSNCode}
              onChange={handleInputChange}
              placeholder="eg: 85214"
              className="input input-sm w-full"
            />
            {/* <p className="text-xs text-info mt-1 cursor-pointer absolute right-2 top-5">
              Find HSN Code
            </p> */}
          </div>

          <div className="flex flex-col relative ">
            <label className="text-xs text-gray-600">As of Date</label>
            {/* <button
              type="button"
              onClick={() => setShowDatepicker((v) => !v)}
              className="btn btn-sm btn-outline border-zinc-300"
            >
              <p>{formatDate(data?.asOfDate) || "Pick a date"}</p>
            </button> */}
            <input
              type="date"
              className="input input-sm w-full"
              onChange={() => {
                const iso = date ? date.toISOString().split("T")[0] : "";
                setData((prev) => ({
                  ...prev,
                  asOfDate: iso,
                }));
              }}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="text-xs text-gray-600 mb-1 block">Description</label>
        <textarea
          name="description"
          value={data.description}
          onChange={handleInputChange}
          placeholder="Enter description"
          rows={3}
          className="w-full p-2 text-xs text-gray-600 border border-gray-300 rounded"
        />
      </div>

      {/* Upload section */}
      {/* <div className="mt-4 border-2 border-dashed border-gray-300 rounded-md flex items-center h-24 p-4">
        <UploadCloud size={30} className="text-gray-600 mx-4" />
        <div>
          <p className="text-xs text-gray-600">
            Please select or drag and drop up to 5 files
          </p>
          <p className="text-xs text-gray-600">
            JPEG or PNG, max size 5 MB each
          </p>
        </div>
        <button className="btn btn-info ml-auto">Select files</button>
      </div> */}
    </main>
  );
};

export default DashboardItemsStockDetailsPage;
