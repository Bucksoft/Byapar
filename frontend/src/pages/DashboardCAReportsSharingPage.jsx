import { FiInfo } from "react-icons/fi";

const DashboardCAReportsSharingPage = () => {
  return (
    <main className="flex h-screen w-full flex-col   ">
      <section className="flex items-center border border-gray-300 justify-between">
        <div className="flex-flex-col ml-5 mt-4 mb-4">
          <p className="font-lg font-semibold text-black text-left">
            CA Reports Sharing
          </p>
          <p className="text-sm whitespace-nowrap text-gray-500">
            Automatically share reports to your CA every month
          </p>
        </div>
        <div className="flex items-center gap-4 mr-5">
          <button className="text-sm border  rounded boredr-gray-300 px-12 py-2">
            Cancel
          </button>
          <button className="text-sm  bg-violet-100 rounded  text-violet-500 font-bold px-4 py-2">
            Save Changes
          </button>
        </div>
      </section>

      <div className="w-full ">
        <p className="text-lg ml-5  mt-3">Settings</p>
      </div>

      <section className="w-full  p-5 flex ">
        <div className=" flex border rounded w-full border-gray-300">
          <div className="  w-100  p-4  ">
            <p className="text-lg font-normal">Enable Sharing</p>
            <p className="text-sm text-gray-500">
              Control the business reports sharing with your CA
            </p>
          </div>
          <div className="py-6">
            <input
              type="checkbox"
              defaultChecked
              className="toggle toggle-md"
            />
          </div>
        </div>
      </section>

      <div className="w-full px-5 ">
        <div className=" bg-gradient-to-r from-amber-100 to-yellow-100 rounded w-full">
          <p className="flex items-center gap-2 py-2 text-base ml-9 font-normal">
            <FiInfo />
            Automatic report sending will be scheduled for the 1st of every
            month starting from August 1, 2025
          </p>
        </div>
      </div>
    </main>
  );
};

export default DashboardCAReportsSharingPage;
