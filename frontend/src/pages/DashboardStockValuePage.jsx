import { FaArrowLeft } from "react-icons/fa6";
import { GiQueenCrown } from "react-icons/gi";
import { FaRegStar } from "react-icons/fa6";
import itemstocksummary from "../assets/itemstocksummary.png";
import { useNavigate } from "react-router-dom";
import { useItemStore } from "../store/itemStore";
import ItemsList from "../components/Items/ItemsList";
import { useEffect, useState } from "react";

const DashboardStockValuePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stockValue, setStockValue] = useState(0);
  const { items } = useItemStore();

  const searchedItems = items?.filter((item) =>
    item?.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const products = items.filter((item) => item?.itemType === "product");
    const stockValue = products.reduce(
      (acc, product) =>
        acc + (product?.purchasePrice || 0) * (product?.currentStock || 0),
      0
    );

    setStockValue(stockValue);
  }, [items]);

  return (
    <main className="flex p-2 shadow-2xs h-full gap-2 bg-[var(--primary-text-color)]">
      <section className="w-full rounded-2xl bg-white">
        <div className="w-full flex flex-col">
          {/* Header */}
          <header className="w-full flex items-center  p-3 gap-4">
            <div className=" flex items-center gap-2 ">
              <p className=" flex items-center text-base gap-3">
                <FaArrowLeft onClick={() => navigate(-1)} />
                Stock Summary
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
                className="input input-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <div className="p-2 border border-gray-200 flex justify-between">
              <p className="text-gray-600 text-base font-medium">
                Total Stock Value: {Number(stockValue).toLocaleString("en-IN")}
              </p>
            </div>
            {items ? (
              <ItemsList items={searchedItems} />
            ) : (
              <div className="flex flex-col items-center justify-center mt-25">
                <img
                  src={itemstocksummary}
                  alt="src/assets/itemstocksummary"
                  className="w-50"
                />
                <p className="text-sm text-gray-500 font-normal">
                  No items available to generate report
                </p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default DashboardStockValuePage;
