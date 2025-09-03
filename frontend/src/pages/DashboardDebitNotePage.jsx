import { BsCartXFill } from "react-icons/bs";
import DashboardNavbar from "../components/DashboardNavbar";
import SalesNavigationMenus from "../components/SalesNavigationMenus";

const DashboardDebitNotePage = () => {
  return (
    <main className="h-full p-2">
      <div className="h-full w-full bg-white rounded-lg p-3">
        <DashboardNavbar title={"Debit Note"} />
        <SalesNavigationMenus title={"Debit Note"} btnText={"Debit Note"} />
        <div className="mt-5 h-80 rounded-md mx-4 ">
          <table className="table ">
            {/* head */}
            <thead>
              <tr className="bg-zinc-100">
                <th className=" ">Date</th>
                <th className=" ">Debit Note Number</th>
                <th className="">Party Name</th>

                <th className="">Purchase No</th>
                <th className="">Amount</th>

                <th className="">Status</th>
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

export default DashboardDebitNotePage;
