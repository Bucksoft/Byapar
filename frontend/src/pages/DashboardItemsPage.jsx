import DashboardNavbar from "../components/DashboardNavbar";
import { Plus, Search } from "lucide-react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { AiOutlineStock } from "react-icons/ai";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { LuPackageSearch } from "react-icons/lu";
import no_items from "../assets/no_items.jpg";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { dashboardPartiesCardDetails } from "../lib/dashboardPartiesCards";
import { dashboardItemsCardDetails } from "../lib/dashboardItemCards";

const DashboardItemsPage = () => {
  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Items"} />

        <section className="grid grid-cols-2 gap-2 ">
          {dashboardItemsCardDetails?.map((details) => (
            <div
              key={details.id}
              className={`border rounded-md p-3 mt-5 shadow-md border-${details.color} bg-${details.color}/10 hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
            >
              <p className={`flex items-center gap-3 text-${details.color}`}>
                {details.icon} {details.label}
              </p>
              <span className="font-medium text-2xl flex gap-2 items-center">
                {details?.label === "Stock Value" && (
                  <FaIndianRupeeSign size={14} />
                )}
                1
              </span>
            </div>
          ))}
        </section>

        <div className="flex items-center justify-between mt-8 ">
          <div className="flex items-center gap-2">
            <label className="input">
              <Search size={16} className="text-zinc-400" />
              <input type="search" required placeholder="Search" />
            </label>
            <button className="btn btn-ghost">
              <LuPackageSearch className="flex items-center" /> Show Low Stock
            </button>
          </div>

          <div>
            <button className="btn btn-sm btn-info">
              <Plus size={14} /> Create Item
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center  flex-col">
          <img src={no_items} alt="no_items" width={250} />
          <h3 className="font-semibold">Add all your Items at once!</h3>
          <p className="text-zinc-500 text-xs">
            For quicker and easier experience of creating sales invoices
          </p>
          <button className="btn btn-soft btn-sm mt-4 btn-info">
            {" "}
            <PiMicrosoftExcelLogoFill size={15} /> Add Items with Excel
          </button>
        </div>
      </div>
    </main>
  );
};

export default DashboardItemsPage;
