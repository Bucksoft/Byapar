import React from "react";
import { MdKeyboard } from "react-icons/md";
import { MdOutlineMessage } from "react-icons/md";
import graph from "../assets/graph.jpg";
import holi from "../assets/holi.jpg";
import dewali from "../assets/dewali.jpg";
import newyear from "../assets/newyear.jpg";
import discount from "../assets/discount.jpg";

const DashboardSMSMarketingPage = () => {
  return (
    <main className="h-screen w-full flex flex-col bg-amber-400">
      {/* Header Part */}
      <header className="flex items-center justify-between p-4 bg-white border border-gray-300">
        <p className="text-lg font-bold">SMS Marketing</p>
        <div className="text-sm flex items-center gap-2">
          <MdOutlineMessage />
          Total SMS Quota Available : 1000
        </div>
        <div className="flex justify-center gap-4 items-center">
          <div className="text-sm ">
            <MdKeyboard size={30} />
          </div>
          <button className="bg-blue-800 text-sm rounded text-white font-semibold px-4 py-1 ">
            Creat Campaign
          </button>
        </div>
      </header>

      {/* body part */}
      <section className="flex h-full flex-col bg-white items-center justify-center">
        <div className="flex items-center justify-center">
          <img src={graph} alt="/src/assets/graph" width={300} />
        </div>
        <p className="text-xl flex items-center justify-center bg-white mt-4 mb-1 font-bold">
          Grow Your Business through SMS Promotions
        </p>
        <p className="text-base text-gray-500">
          Want to share festival sale and discount offer with your customer?
          Start an SMS campaign today with
        </p>
        <p className="text-base text-gray-500">
          myBillBook and make your sale a success
        </p>

        {/* 1st Big Button Part */}
        <section className="flex flex-col bg-gradient-to-r from-blue-500 to-cyan-400  rounded items-center justify-between">
          <div className="flex items-center  gap-60 ">
            <div className="flex text-white ml-4 mt-2 flex-col">
              <p className="text-lg font-bold">
                Share festival offer with Your customer
              </p>
              <p className="text-sm font-semibold">
                Increase your sale this festival season with our Festival SMS
                Campaign
              </p>
            </div>
            <img src={holi} alt="/src/assets/holi" className="w-14" />
          </div>

          <div className="flex items-center gap-122 justify-between">
            <button className="bg-white px-4 py-1 ml-4 mb-4 mt-4 rounded text-blue-600 text-sm font-bold">
              Select Template
            </button>
            <div className="gap-1 flex ">
              <img src={newyear} alt="/src/assets/newyear" className="w-14" />
              <img src={dewali} alt="/src/assets/dewali" className="w-14" />
            </div>
          </div>
        </section>

        {/* 2nd Big Button */}
        <section className="flex flex-col bg-gradient-to-r from-orange-400 to-red-600 mt-3 rounded items-center justify-between">
          <div className="flex items-center gap-27 justify-between">
            <div className="flex text-white ml-4 mt-2 flex-col">
              <p className="text-lg font-bold">
                Share discount Your customer will love
              </p>
              <p className="text-sm font-semibold">
                Share discount offers with your customers and watch your
                business grow
              </p>

              <button className="bg-white w-36 rounded text-orange-600 text-sm font-bold px-2 py-1 ml-0 mb-4 mt-4">
                Select Template
              </button>
            </div>

            <img src={discount} alt="src/assets/discount" className=" w-42" />
          </div>
        </section>
      </section>
    </main>
  );
};

export default DashboardSMSMarketingPage;
