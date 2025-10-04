import { FaArrowLeft } from "react-icons/fa6";
import { GiQueenCrown } from "react-icons/gi";
import { FaRegStar } from "react-icons/fa6";
import itemratelist from "../assets/itemratelist.png";
import { useNavigate } from "react-router-dom";

const DashboardItemsSalesAndPurchaseSummary = () => {
  const navigate = useNavigate();

  return (
    <main className="flex p-2  shadow-2xs h-full gap-2 bg-[var(--primary-text-color)]">
      <section className="w-full ">
        <div className="w-full flex flex-col">
          {/* Header */}
          <header className="w-full flex items-center border-b border-gray-200 p-3 gap-4">
            <div className=" flex items-center gap-2 ">
              <p className=" flex items-center text-base gap-3">
                <FaArrowLeft onClick={() => navigate(-1)} />
                Item Sales and Purchase Summary
              </p>
              <p className="text-amber-500 text-lg">
                <GiQueenCrown />
              </p>
            </div>
            <button className=" flex items-center gap-2 text-sm bg-gray-100 p-1 px-2 rounded">
              <FaRegStar className="text-gray-500" />
              Favourite
            </button>
          </header>

          {/* Body Section */}
          <section className="p-3 flex flex-col gap-3 ">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search Category "
                className="input input-sm "
              />
              <div className="max-w-xs">
                <select defaultValue="This week" className="select select-sm">
                  <option disabled={true}>Today</option>
                  <option>Yesterday</option>
                  <option>This week</option>
                  <option>Last week</option>
                  <option>Last 7 days</option>
                  <option>This month</option>
                  <option>Previous month</option>
                  <option>Last 30 days</option>
                  <option>This Quarter</option>
                  <option>Previoud Quarter</option>
                  <option>Current Fiscal Year</option>
                  <option>Previous Fiscal Year</option>
                  <option>Last 365 days</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                {/* head */}
                <thead>
                  <tr className="bg-zinc-100">
                    <th>Item Name</th>
                    <th>Sales Quantity</th>
                    <th>Purchase Quantity</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
            <div className="flex flex-col items-center justify-center mt-25">
              <img
                src={itemratelist}
                alt="src/assets/itemratelist"
                className="w-50"
                loading="lazy"
              />
              <p className="text-sm text-gray-500 font-normal">
                No transactions available to generate report
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default DashboardItemsSalesAndPurchaseSummary;
