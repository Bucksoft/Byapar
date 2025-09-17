import { Calendar, ChevronDown, Keyboard, Search } from "lucide-react";
import { TbCoinRupee } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const SalesNavigationMenus = ({
  title,
  btnText,
  selectText,
  setPage,
  setSearchedQuery,
  setFilterDate,
}) => {
  const navigate = useNavigate();

  return (
    <main>
      {title === "Payment In" && (
        <div className="mx-5 mt-6  border-zinc-200 text-sm flex items-center gap-1 font-medium border-b ">
          <p className="pb-2 border-w">
            <TbCoinRupee size={16} className="text-[var(--primary-btn)] " />
          </p>
          <span className="text-[var(--primary-btn)] pb-2">
            Payment Received
          </span>
        </div>
      )}

      <div className="flex justify-between mx-5 mt-5">
        <div
          className={`flex gap-3 ${title === "Payment In" ? "w-3/6" : ""}   `}
        >
          {/* search box */}
          <div className={` ${title === "Payment In" ? "w-full" : ""}  `}>
            <label className="input input-sm">
              <Search size={16} className="" />
              <input
                type="search"
                required
                placeholder={
                  title === "Payment In"
                    ? "Search by payment in number or party name"
                    : "Search"
                }
                onChange={(e) => setSearchedQuery(e.target.value)}
              />
            </label>
          </div>
          {/* calender */}
          <select
            className="select select-sm"
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="today" className="hidden">
              Today
            </option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this week">This week</option>
            <option value="last week">Last week</option>
          </select>

          {/* create quotation optional */}
          {(title === "Quotation / Estimate" ||
            title === "Proforma Invoice" ||
            title === "Delivery Challan" ||
            title === "Purchase Orders") && (
            <div className="dropdown dropdown-center w-60 ">
              <div
                tabIndex={0}
                role="button"
                className=" bg-white btn btn-wide w-full  btn-sm  text-xs font-medium flex items-center justify-between"
              >
                <span className="text-zinc-400">Show Open {selectText}</span>
                <ChevronDown size={16} className="text-zinc-400" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm text-zinc-400 "
              >
                <li>
                  <a>Show All {selectText}</a>
                </li>
                <li>
                  <a>Show Open {selectText}</a>
                </li>
                <li>
                  <a>Show Closed {selectText}</a>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div>
          <div className="h-full">
            <button
              onClick={() => {
                btnText === "Payment In" ? setPage("Payment In") : "";
                navigate(
                  `/dashboard/parties/${
                    "create-" + btnText.split(" ").join("-").toLowerCase()
                  }`
                );
              }}
              className="btn bg-[var(--primary-btn)] btn-sm text-zinc-700"
            >
              Create {btnText}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SalesNavigationMenus;
