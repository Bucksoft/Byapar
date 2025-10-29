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
  filterDate,
  type,
  setType,
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
          className={`flex gap-3  ${
            title === "Payment In" ||
            title === "Sales Return" ||
            title === "Credit Note"
              ? "w-3/6"
              : ""
          }   `}
        >
          {/* search box */}
          <div
            className={` ${
              title === "Payment In" ||
              title === "Sales Return" ||
              title === "Credit Note"
                ? "w-full"
                : ""
            }  `}
          >
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
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="" disabled>
              --Select-Day--
            </option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">This week</option>
            <option value="lastWeek">Last week</option>
          </select>

          {/* create quotation optional */}
          {(title === "Quotation / Estimate" ||
            title === "Proforma Invoice" ||
            title === "Delivery Challan" ||
            title === "Purchase Orders") && (
            <select
              className="select select-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="" disabled>
                --Select-type--
              </option>
              <option value="open">Show Open {selectText}</option>
              <option value="closed">Show Closed {selectText}</option>
              <option value="all">Show All {selectText}</option>
            </select>
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
              className="btn rounded-xl bg-[var(--primary-btn)] btn-sm text-zinc-700"
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
