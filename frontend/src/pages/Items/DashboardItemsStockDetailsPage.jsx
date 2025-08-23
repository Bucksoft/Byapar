import {
  Calendar,
  ChevronDown,
  Info,
  Plus,
  Search,
  UploadCloud,
} from "lucide-react";
import { uomList } from "../../utils/constants";

const DashboardItemsStockDetailsPage = () => {
  return (
    <main>
      <div className="grid grid-cols-2 gap-5">
        {/* left container */}
        <div>
          <div className=" flex flex-col">
            <span className="text-xs text-gray-600">Item Code</span>
            <div className=" flex items-center h-8 border border-[var(--primary-border)] rounded-xs w-full">
              <input
                type="text"
                placeholder="eg: ITEM 45652"
                className=" px-2 text-xs text-gray-600 outline-none w-60"
              />
              <div className="dropdown dropdown-center w-fit">
                <div
                  tabIndex={0}
                  role="button"
                  className=" text-xs text-gray-600 font-medium flex items-center h-full"
                >
                  <span className="h-full">Generate Barcode</span>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box w-52 shadow-xs text-gray-600"
                >
                  <li>All Expenses Categories</li>
                  <li>Bank Fee & Charges</li>
                  <li>Raw Material</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-8">
            <span className="text-xs text-gray-600">Measuring Unit</span>
            <div className="flex items-center h-8 border border-[var(--primary-border)] rounded-xs">
              <Search size={16} className="w-10 text-gray-600" />

              <input
                type="text"
                placeholder="Select Pieces (PCS)"
                className="w-full text-xs text-gray-600 outline-none"
                readOnly
              />

              <div className="dropdown dropdown-end w-5 mr-5">
                <div
                  tabIndex={0}
                  role="button"
                  className="text-xs text-gray-600 font-medium flex items-center justify-between cursor-pointer"
                >
                  <ChevronDown size={20} className="text-gray-600" />
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content bg-base-100 rounded-box shadow-md w-52 max-h-40 overflow-y-auto mt-2 text-gray-600 flex flex-col space-y-1 p-2"
                >
                  {uomList.map((unit, index) => (
                    <li key={index} className="w-full">
                      <button className="w-full text-left text-xs px-2 py-1 hover:bg-gray-100 rounded">
                        {unit?.label} ({unit?.code})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center">
            <Plus size={16} className="text-info" />
            <span className="text-info text-xs ml-1">Alternative Unit</span>
          </div>

          <div className="flex flex-col mt-2">
            <span className="text-xs text-gray-600">Opening Stocks</span>
            <div className="">
              <input
                type="text"
                placeholder="eg: 150 PCS"
                className="px-2 w-full border border-[var(--primary-border)] rounded-xs h-8 text-xs text-gray-600"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center">
            <Plus size={16} className="text-info" />
            <span className="text-info text-xs ml-1">
              Enable low stock quantity warning
            </span>
            <Info size={16} className="text-info ml-2" />
          </div>
        </div>
        {/* right container */}
        <div>
          <div className=" flex flex-col ">
            <span className="text-xs text-gray-600">HSN Code</span>
            <div className="">
              <input
                type="text"
                placeholder="eg: 85214"
                className="px-2 w-full border border-[var(--primary-border)] rounded-xs h-8 text-xs text-gray-600"
              />
              <p className="text-xs text-info mt-1">Find HSN Code</p>
            </div>
          </div>

          <div className="dropdown dropdown-end w-full mt-26">
            <span className="text-xs text-gray-600">As of Date</span>
            <div
              tabIndex={0}
              role="button"
              className="flex items-center justify-between border-[var(--primary-border)] border rounded-xs  h-8 text-xs font-medium"
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-zinc-300 ml-5" />
                <span className="text-gray-600 text-xs">Last 365 days</span>
              </div>
              <ChevronDown size={20} className="text-gray-600 mr-3" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box p-2 shadow-xs text-gray-600"
            >
              <li>
                <a>Today</a>
              </li>
              <li>
                <a>Yesterday</a>
              </li>
              <li>
                <a>This week</a>
              </li>
              <li>
                <a>Last week</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* TextArea */}
      <div>
        <p className="text-xs text-gray-600 my-3">Description</p>
        <textarea
          name=""
          id=""
          className="w-full rounded-md border-[var(--primary-border)] border h-18"
        ></textarea>
      </div>

      <div className="border border-dashed border-[var(--primary-border)] rounded-md flex items-center h-20 mt-2">
        <UploadCloud size={30} className="text-gray-600 mx-10" />
        <div>
          <p className="text-xs text-gray-600">
            Please select or drag and drop 5 files
          </p>
          <p className="text-xs text-gray-600">
            Maximum of 5 images in JPEG or PNG, files size less than 5 MB
          </p>
        </div>
        <button className="btn btn-info ml-40">Select files</button>
      </div>
    </main>
  );
};

export default DashboardItemsStockDetailsPage;
