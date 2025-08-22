import { ChevronDown, IndianRupee, Plus, Search } from "lucide-react";
import { gstRates, uomList } from "../../utils/constants";

const DashboardItemsBasicDetailPage = () => {
  return (
    <main className="grid grid-cols-2 gap-15 ">
      {/* left container */}
      <div className="">
        <div className=" flex flex-col">
          <span className="text-xs text-gray-600">Item Type</span>
          <div className="h-full flex">
            <p className="px-2 py-2 text-xs text-gray-600 w-1/2 mt-2 border border-gray-300 rounded-xs flex items-center justify-between">
              {" "}
              Product
              <input
                type="radio"
                name="radio-1"
                className="radio radio-xs"
                defaultChecked
              />
            </p>
            <p className="px-2 text-xs text-gray-600 w-1/2 mt-2 border border-gray-300 rounded-xs ml-5 flex items-center justify-between">
              {" "}
              Services
              <input type="radio" name="radio-1" className="radio radio-xs" />
            </p>
          </div>
        </div>

        <div className=" flex flex-col mt-5">
          <span className="text-xs text-gray-600">Item Name</span>
          <div className="">
            <input
              type="text"
              placeholder="eg: Apple 5kg size"
              className="px-2 w-full border border-gray-300 rounded-xs h-8 text-xs text-gray-500"
            />
          </div>
        </div>

        <div className=" flex flex-col mt-5">
          <span className="text-xs text-gray-600">Sales Price</span>
          <div className=" flex items-center h-8 border border-gray-300 rounded-xs w-full">
            <IndianRupee size={16} className="text-gray-600 w-10" />
            <input
              type="text"
              placeholder="eg: 200"
              className="w-60 text-xs text-gray-600 outline-none"
            />
            <div className="dropdown dropdown-center">
              <div
                tabIndex={0}
                role="button"
                className="  text-xs text-gray-600 font-medium flex items-center mr-5"
              >
                <span className="text-info w-full">With Tax</span>
                <ChevronDown size={20} className="text-gray-600" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-5 bg-base-100 rounded-box shadow-xs text-gray-600 z-1 w-58 "
              >
                <li>
                  <a>With Tax</a>
                </li>
                <li>
                  <a>Without Tax</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-5">
          <span className="text-xs text-gray-600">Measuring Unit</span>

          <div className="flex items-center h-8 border border-gray-300 rounded-xs">
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
      </div>

      {/* right container */}
      <div className="">
        <div className="flex flex-col">
          <span className="text-xs text-gray-600">Category</span>
          <div className="flex items-center h-8 border border-gray-300 rounded-xs mt-2">
            <Search size={16} className="w-10 text-gray-600" />
            <input
              type="text"
              placeholder="Select Category"
              className="w-full text-xs outline-none"
            />
            <div className="dropdown dropdown-end w-5 mr-5">
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
                <button className="btn btn-sm btn-dash btn-info">add category</button>
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
          <div className="flex items-center h-8 border border-gray-300 rounded-xs ">
            <Search size={16} className="w-10 text-gray-600" />
            <input
              type="text"
              placeholder="Select Category"
              className="w-full text-xs outline-none"
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
                {gstRates.map((gstRate, index) => (
                  <li key={index} className="w-full">
                    <button className="w-full text-left text-xs px-2 py-1 hover:bg-gray-100 rounded">
                      {gstRate?.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-5">
          <span className="text-xs text-gray-600">Opening Stocks</span>
          <div className="">
            <input
              type="text"
              placeholder="eg: 150 PCS"
              className="px-2 w-full border border-gray-300 rounded-xs h-8 text-xs text-gray-600"
            />
          </div>
        </div>
        {/* save button */}
        <div className="flex justify-end w-full mt-30">
          <button className="btn bg-[var(--primary-btn)] btn-sm mt-30 w-1/3">
            Save
          </button>
        </div>
      </div>
    </main>
  );
};

export default DashboardItemsBasicDetailPage;
