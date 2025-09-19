import { FaFileInvoice } from "react-icons/fa6";
import DashboardNavbar from "../components/DashboardNavbar";
import SalesNavigationMenus from "../components/SalesNavigationMenus";

const DashboardCreditNotePage = () => {
  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Credit Note"} />
        <SalesNavigationMenus btnText={"Credit Note"} title={"Credit Note"} />
        <div className=" mt-5 h-80 rounded-md mx-4 ">
          <table className="table ">
            {/* head */}
            <thead>
              <tr className="text-xs bg-zinc-100 ">
                <th>Date</th>
                <th>Credit Note Number</th>
                <th>Party Name</th>
                <th>Invoice Number</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
          </table>
          <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
            <FaFileInvoice size={40} />
            <span className="text-sm">
              No transactions matching the current filter
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardCreditNotePage;
