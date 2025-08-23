import { ChevronDown, IndianRupee, Search } from "lucide-react";
import { gstRates } from "../../utils/constants";

const DashboardItemsPricingDetailsPage = () => {
  return (
    <main className="grid grid-cols-2 gap-15">
      {/* left container */}
      <div>
        <div className=" flex flex-col">
          <span className="text-xs text-gray-600">Sales Price</span>
          <div className=" flex items-center h-8 border border-[var(--primary-border)] rounded-xs w-full">
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
                className="  text-xs text-gray-600 font-medium flex items-center mr-5"
              >
                <span className="text-info w-full text-nowrap">With Tax</span>
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
          <span className="text-xs text-gray-600">GST Tax Rate (%)</span>
          <div className="flex items-center h-8 border border-[var(--primary-border)] rounded-xs ">
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
                className="text-xs  text-gray-600 font-medium flex items-center justify-between"
              >
                <ChevronDown size={25} className="text-gray-600" />
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
      </div>
      {/* right container */}
      <div>
        <div className=" flex flex-col">
          <span className="text-xs text-gray-600">Purchase Price</span>
          <div className=" flex items-center h-8 border border-[var(--primary-border)] rounded-xs w-full">
            <IndianRupee size={16} className="text-gray-600 w-10" />
            <input
              type="text"
              placeholder="Ex : ₹ 200"
              className="w-full text-xs outline-none"
            />
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="  text-xs text-gray-600 font-medium flex items-center mr-5"
              >
                <span className="text-info w-full text-nowrap">With Tax</span>
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
      </div>
    </main>
  );
};

export default DashboardItemsPricingDetailsPage;
