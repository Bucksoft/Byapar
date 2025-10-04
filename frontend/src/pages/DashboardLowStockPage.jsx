import { FaArrowLeft } from "react-icons/fa6";
import { GiQueenCrown } from "react-icons/gi";
import { FaRegStar } from "react-icons/fa6";
import itemstocksummary from "../assets/itemstocksummary.png";
import { BiRupee } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const DashboardLowStockPage = () => {
  const navigate = useNavigate();
  return (
    <main className="flex p-2  shadow-2xs h-full gap-2 bg-[var(--primary-text-color)]">
      <section className="w-full rounded-2xl ">
        <div className="w-full flex flex-col">
          {/* Header */}
          <header className="w-full flex items-center border-b border-gray-200 p-3 gap-4">
            <div className=" flex items-center gap-2 ">
              <p className=" flex items-center text-base gap-3">
                <FaArrowLeft onClick={() => navigate(-1)} />
                Low Stock Summary
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
          <section className="p-3 flex flex-col  ">
            <div className="p-2 border border-gray-200 ">
              <p className="text-gray-600 text-base font-medium flex items-center gap-2">
                Total Stock Value:
                <BiRupee className="-mr-2" /> 0
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                {/* head */}
                <thead>
                  <tr className="bg-zinc-100 ">
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>Purchase Price</th>
                    <th>Selling Price</th>
                    <th>Stock Quantity</th>
                    <th>Stock Value</th>
                  </tr>
                </thead>
                <tbody>{/* row 1 */}</tbody>
              </table>
            </div>
            <div className="flex flex-col items-center justify-center mt-25">
              <img
                src={itemstocksummary}
                alt="src/assets/itemstocksummary"
                className="w-50"
                loading="lazy"
              />
              <p className="text-sm text-gray-500 font-normal">
                No items available to generate report
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default DashboardLowStockPage;
