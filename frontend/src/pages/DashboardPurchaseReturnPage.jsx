import { BsCartXFill } from "react-icons/bs";
import DashboardNavbar from "../components/DashboardNavbar";
import SalesNavigationMenus from "../components/SalesNavigationMenus";

const DashboardPurchaseReturnPage = () => {
  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Purchase Return"} />
        <SalesNavigationMenus btnText={"Purchase Return"} />
        <div className="border border-zinc-200 mt-5 h-80 rounded-md mx-4 ">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="text-xs bg-gray-100 border-b border-b-gray-200">
                <th className="border-r border-r-zinc-200 w-60">Date</th>
                <th className="border-r border-r-zinc-200 w-60">
                  Purchase Return Number
                </th>
                <th className="border-r border-r-zinc-200 w-60">Party Name</th>

                <th className="border-r border-r-zinc-200 w-60">Due In</th>
                <th className="border-r border-r-zinc-200 w-60">
                  Ipurchase Number
                </th>

                <th className="border-r border-r-zinc-200 w-60">Amount</th>
                <th className="w-60">Status</th>
              </tr>
            </thead>
          </table>
          <div className="w-full flex items-center justify-center py-20 flex-col gap-3 text-zinc-400">
            <BsCartXFill size={40} />
            <span className="text-sm">
              No transactions matching the current filter
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPurchaseReturnPage;
