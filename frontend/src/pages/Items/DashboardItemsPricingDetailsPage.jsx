import { ChevronDown, IndianRupee, Search } from "lucide-react";
import { gstRates } from "../../utils/constants";

const DashboardItemsPricingDetailsPage = ({ data, setData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <main className="grid grid-cols-2 gap-15 h-full">
      {/* left container */}
      <div>
        {/* <div className=" flex flex-col">
          <span className="text-xs text-gray-600">Sales Price</span>
          <div className=" flex items-center h-8 border border-[var(--primary-border)] rounded-xs w-full ">
            <IndianRupee size={16} className="w-10 text-gray-600" />
            <input
              type="number"
              value={data.salesPrice}
              name="salesPrice"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  salesPrice: Number(e.target.value),
                }))
              }
              placeholder="eg: 200"
              className="w-70 text-xs text-gray-600 outline-none"
            />
            <select
              defaultValue="With tax"
              name="salesPriceType"
              value={data.salesPriceType}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  salesPriceType: e.target.value.toLowerCase(),
                }))
              }
              className="select select-sm outline-none w-3/8 text-info select-ghost "
            >
              <option disabled={true} className="hidden">
                With tax
              </option>
              <option value={"with tax"}>With tax</option>
              <option value={"without tax"}>Without tax</option>
            </select>
          </div>
        </div> */}

        <div className="flex flex-col ">
          <span className="text-xs text-gray-600">GST Tax Rate (%)</span>
          {/* <Search size={16} className="w-10 text-gray-600" />
            <input
              type="text"
              placeholder="Select Category"
              className="w-full text-xs outline-none"
            /> */}
          <select
            value={data.gstTaxRate}
            onChange={handleInputChange}
            className="select select-sm w-full"
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
      {/* right container */}
      <div>
        <div className=" flex flex-col">
          <span className="text-xs text-gray-600">Purchase Price</span>
          <div className=" flex items-center h-8 border border-[var(--primary-border)] rounded-xs w-full">
            <IndianRupee size={16} className="text-gray-600 w-10" />
            <input
              type="text"
              name="purchasePrice"
              value={data.purchasePrice}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  purchasePrice: Number(e.target.value),
                }))
              }
              placeholder="Ex : ₹ 200"
              className="w-full text-xs outline-none"
            />
            <select
              defaultValue="With tax"
              name="purchasePriceType"
              value={data.purchasePriceType}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  purchasePriceType: e.target.value.toLowerCase(),
                }))
              }
              className="select select-sm outline-none w-3/8 text-info select-ghost mr-1"
            >
              <option disabled={true} className="hidden">
                With tax
              </option>
              <option value={"with tax"}>With tax</option>
              <option value={"without tax"}>Without tax</option>
            </select>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardItemsPricingDetailsPage;
