import { ChevronDown, IndianRupee, Search } from "lucide-react";

const DashboardItemsPricingDetailsPage = () => {
  return (
    <main className="grid grid-cols-2 gap-15">
      {/* left container */}
      <div>
        <div className=" flex flex-col">
          <span className="text-xs text-gray-600">Sales Price</span>
          <div className=" flex items-center h-8 border border-gray-300 rounded-xs w-full">
            <IndianRupee size={16} className="w-10 text-gray-600" />
            <input
              type="text"
              placeholder="eg: 200"
              className="w-70 text-xs text-gray-600 outline-none"
            />
            <div className="dropdown dropdown-center">
              <div
                tabIndex={0}
                role="button"
                className=" mr-3 text-xs text-gray-600 font-medium flex items-center"
              >
                <span className=" w-full">With Tax</span>
                <ChevronDown size={25} className="text-gray-600" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-5 bg-base-100 rounded-box shadow-xs text-gray-600 z-1 w-58 "
              >
                <li>
                  <a>All Expenses Categories</a>
                </li>
                <li>
                  <a>Bank Fee & Charges</a>
                </li>
                <li>
                  <a>Raw Material</a>
                </li>
              </ul>
            </div>
          </div>
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
            <div className="dropdown dropdown-center w-5 mr-5">
              <div
                tabIndex={0}
                role="button"
                className="text-xs  text-gray-600 font-medium flex items-center justify-between"
              >
                <ChevronDown size={25} className="text-gray-600" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-xs text-gray-600"
              >
                <li>
                  <a>All Expenses Categories</a>
                </li>
                <li>
                  <a>Bank Fee & Charges</a>
                </li>
                <li>
                  <a>Raw Material</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* right container */}
      <div>
        <div className=" flex flex-col">
          <span className="text-xs text-gray-600">Purchase Price</span>
          <div className=" flex items-center h-8 border border-gray-300 rounded-xs w-full">
            <IndianRupee size={16} className="text-gray-600 w-10" />
            <input
              type="text"
              placeholder="Select Category"
              className="w-full text-xs outline-none"
            />
            <div className="dropdown dropdown-end w-5 mr-5">
              <div
                tabIndex={0}
                role="button"
                className="text-xs text-gray-600 font-medium flex items-center justify-between"
              >
                <ChevronDown size={25} className="text-gray-600" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-xs text-gray-600"
              >
                <li>
                  <a>All Expenses Categories</a>
                </li>
                <li>
                  <a>Bank Fee & Charges</a>
                </li>
                <li>
                  <a>Raw Material</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardItemsPricingDetailsPage;
