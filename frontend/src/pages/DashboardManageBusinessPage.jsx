import { useEffect, useState } from "react";
import tally from "../assets/tally.jpg";
import store from "../assets/store.jpg";
import { FaFileSignature } from "react-icons/fa6";
import { PiRectangleBold } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import BusinessForm from "../components/Business/BusinessForm";
import { useLocation } from "react-router-dom";
import { useBusinessStore } from "../store/businessStore";

const DashboardManageBusinessPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [editableBusiness, setEditableBusiness] = useState();
  const { state } = useLocation();
  const { businesses } = useBusinessStore();

  useEffect(() => {
    const business = businesses.filter(
      (business) => business?._id === state?.businessId
    );
    setEditableBusiness(business[0]);
  }, [state]);

  return (
    <main className="">
      <div className=" flex max-h-screen overflow-y-scroll bg-white  relative p-2 shadow-2xs  ">
        <div className="w-full ">
          {/* main section */}
          <BusinessForm businessToBeUpdated={editableBusiness} />

          {/* right sidebar end */}

          <footer className="w-full pb-8">
            {/* <div className="border-b border-t border-[var(--primary-border)]">
              <p className="text-[14px]  p-2">Company Settings</p>
            </div>

            <div className="m-4">
              <button className="px-3 rounded-xl flex items-center gap-6 rounded-2xl p-2 border border-zinc-200 hover:shadow-md cursor-pointer ">
                <img
                  src={tally}
                  alt="/src/assets/tally"
                  className="w-10"
                  loading="lazy"
                />
                <div className="flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      Data Export to Tally
                    </p>
                    <span className="text-sm font-semibold border rounded-3xl px-3 bg-error text-white ">
                      NEW
                    </span>
                  </div>
                  <p className="text-xs mt-1 text-gray-500">
                    Transfer vouchers, items and parties to Tally
                  </p>
                </div>
              </button>
            </div> */}

            {/* <div className="border-b border-t border-[var(--primary-border)]">
              <p className="text-[14px]  p-2">Add New Business</p>
            </div> */}
            {/* 
            <div className="flex flex-col items-center justify-center">
              <img
                src={store}
                alt="/src/assets/tally"
                className="w-100"
                loading="lazy"
              />
              <p className="text-[13px] mb-3">
                Easily Manage all your businesses in one place on myBillBook app
              </p>
              <button className="btn rounded-xl btn-sm btn-soft font-bold text-success-content rounded bg-success  cursor-pointer">
                Create New Business
              </button>
            </div> */}
          </footer>
        </div>

        {/* Pop-up Section */}
        {showPopup && (
          <div className="absolute bg-white/80 h-screen w-full flex items-center justify-center">
            <div className="flex flex-col bg-zinc-200 w-1/2  rounded-lg items-center justify-between">
              <div className="border-b px-4 flex items-center border-zinc-400 justify-between w-full py-2">
                <h1>Signature</h1>
                <button
                  className="cursor-pointer"
                  onClick={() => setShowPopup(false)}
                >
                  <RxCross2 />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 gap-2">
                <div className="w-1/2 text-sm flex flex-col items-center justify-center px-2 py-5  border rounded border-zinc-300 cursor-pointer hover:border-[var(--primary-btn)] hover:shadow-2xl">
                  <FaFileSignature size={50} />
                  Upload Signature from Desktop
                </div>
                <div className="w-1/2 text-sm flex flex-col items-center justify-center px-2 py-5  border rounded border-zinc-300 cursor-pointer hover:border-[var(--primary-btn)] hover:shadow-2xl">
                  <PiRectangleBold size={50} />
                  Upload Signature from Desktop
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardManageBusinessPage;
