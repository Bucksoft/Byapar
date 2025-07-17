
import { FaIndianRupeeSign } from "react-icons/fa6";
import {  Plus, Search } from "lucide-react";
import upload from "../assets/upload.png";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import DashboardNavbar from "../components/DashboardNavbar";
import { dashboardPartiesCardDetails } from "../lib/dashboardPartiesCards";

const DashboardPartiesPage = () => {
  return (
    <main className="h-full p-2">
      <section className="h-full w-full bg-white rounded-lg p-3">
        {/* Parties top navigation bar */}
        <DashboardNavbar title={"Parties"} />

        <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
          {dashboardPartiesCardDetails?.map((details) => (
            <div
              key={details.id}
              className={`border rounded-md p-3 shadow-md border-${details.color} bg-${details.color}/10 hover:-translate-y-1 transition-all ease-in-out duration-200 cursor-pointer`}
            >
              <p className={`flex items-center gap-3 text-${details.color}`}>
                {details.icon} {details.label}  
              </p>
              <span className="font-medium text-2xl flex items-center gap-2">
                {details.label === "To Collect" && (
                  <FaIndianRupeeSign size={15} />
                )}
                {details.label === "To Pay" && <FaIndianRupeeSign size={15} />}
                {details.value}
              </span>
            </div>
          ))}
        </div>


        <div className="flex items-center justify-between mt-8">
          <div className="">
            <label className="input">
              <Search size={16} className="text-zinc-400" />
              <input type="search" required placeholder="Search" />
            </label>
          </div>

          <div>
            <button className="btn btn-sm btn-info">
              <Plus size={14} /> Create Party
            </button>
          </div>
        </div>
          


        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mt-8 ">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Party Name</th>
                <th>Category</th>
                <th>Mobile Number</th>
                <th>Party type</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <td>Cash Sale</td>
                <td>-</td>
                <td>63874682348</td>
                <td>Customer</td>
                <td>₹ 0</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="w-full mt-7 flex  gap-3 bg-gradient-to-r from-sky-100 to-sky-50 rounded-md p-4">
          <img src={upload} alt="upload" width={120} />
          <div>
            <h2 className="mt-2 text-md font-semibold">
              Add multiple parties at once.
            </h2>
            <p className="text-xs text-zinc-500">
              Bulk upload all your parties to myBillBook using excel
            </p>

            <button className="btn btn-sm mt-5 btn-soft btn-success">
              <PiMicrosoftExcelLogoFill size={15} />
              Upload Excel
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardPartiesPage;
