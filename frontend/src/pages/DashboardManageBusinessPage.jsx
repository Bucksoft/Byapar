import React, { useState } from "react";
import { RiChat1Line } from "react-icons/ri";
import { MdOutlineCalendarToday } from "react-icons/md";
import { MdKeyboard } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import tally from "../assets/tally.jpg";
import store from "../assets/store.jpg";
import { FaFileSignature } from "react-icons/fa6";
import { PiRectangleBold } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";

const DashboardManageBusinessPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <main className="flex max-h-screen overflow-y-scroll  relative p-2 border border-gray-200 shadow-2xs rounded-2xl ">
      <div className="w-full ">
        {/* Header */}
        <header className="flex items-center  p-2 justify-between border-b border-gray-300">
          <div className="flex items-center justify-center gap-5">
            <div className="flex ml-3 flex-col ">
              <p className="text-lg font-normal">Business Settings</p>
              <p className="text-[14px] text-gray-500">
                Edit your company settings and information
              </p>
            </div>
            <button className="text-xs text-white py-1 px-4 hover:bg-[#C65917] bg-amber-600 cursor-pointer  rounded font-semibold ">
              Create New Business
            </button>
          </div>

          <div className="flex items-center justify-center mr-3 gap-4">
            <p className="text-gray-500 cursor-pointer">
              <MdKeyboard size={25} />
            </p>
            <button className="text-[12px] rounded font-semibold cursor-pointer flex items-center gap-1 text-blue-600 bg-[#DAE8FF] py-1 px-3">
              <RiChat1Line size={14} />
              Chat Support
            </button>
            <button className="text-[12px] font-semibold flex cursor-pointer items-center hover:bg-gray-200 border rounded border-gray-300 gap-1 py-1 px-3">
              <MdOutlineCalendarToday size={14} />
              Close Financial Year
            </button>
            <button className="text-[12px]  border border-gray-300 rounded hover:bg-gray-200 cursor-pointer py-1 px-13">
              Cancel
            </button>
            <button className="text-[12px] text-white font-semibold cursor-pointer bg-[#DCD9F5] border border-gray-300 rounded py-1 px-6">
              Save Changes
            </button>
          </div>
        </header>

        {/* main section */}
        <section className="min-h-screen  grid grid-cols-2 gap-2">
          {/* left  */}
          <div className="flex flex-col  p-4 mt-1 ml-2">
            <div className="flex gap-7 mb-4">
              <div className="border flex-col items-center  justify-center bg-[#F6F9FF] border-blue-500 flex border-dashed w-30 h-30 cursor-pointer">
                <p className="font-semibold text-blue-500">
                  <LuImagePlus size={20} />
                </p>
                <p className="text-[13px] text-blue-500 font-semibold">
                  Upload Logo
                </p>
                <p className="text-[11px] text-gray-500">JPG/PNG,max-5</p>
                <p className="text-[11px] text-gray-500">MB.</p>
              </div>
              <div className="flex flex-col gap-2 justify-center  w-full">
                <p className="text-[13px] ml-3 text-gray-500">
                  Business Name<span className="text-red-600">*</span>
                </p>
                <input
                  type="text"
                  placeholder=" Business Name"
                  className="text-sm font-semibold text-gray-600 border outline-none  hover:border-blue-500 rounded  border-gray-300 p-2 ml-2 "
                />
              </div>
            </div>
            <div className="flex gap-5 mb-4 items-center justify-between">
              <div className="w-1/2 flex flex-col  justify-between">
                <p className="text-[13px]  text-gray-500 mb-2">
                  Company Phone Number
                </p>
                <input
                  type="text"
                  placeholder=" Enter Company phone number"
                  className="text-sm font-semibold text-gray-600 border rounded  outline-none hover:border-blue-500 border-gray-300 p-2 "
                />
              </div>
              <div className="w-1/2 flex flex-col  justify-between">
                <p className="text-[13px]  text-gray-500 mb-2">
                  Company E-mail
                </p>
                <input
                  type="text"
                  placeholder=" Enter Company E-mail"
                  className="text-sm font-semibold text-gray-600 outline-none hover:border-blue-500 border rounded  border-gray-300 p-2"
                />
              </div>
            </div>
            <div className="flex flex-col mb-4 ">
              <p className="text-[13px]  text-gray-500 mb-2">Billing Address</p>
              <textarea
                placeholder="Enter Billing Address"
                className="text-sm font-semibold border align-top outline-none hover:border-blue-500 border-gray-300 rounded p-4  text-gray-600"
              />
            </div>

            <div className="flex gap-5 mb-4 items-center justify-between">
              <div className="w-1/2 flex flex-col  justify-between">
                <p className="text-[13px]  text-gray-500 mb-2">State</p>
                <select className="text-sm font-semibold text-gray-600 border rounded outline-none hover:border-blue-500 border-gray-300 p-2 ">
                  <option disabled>Enter state</option>
                  <option>Andaman & Nicobar Islands</option>
                  <option>Andhra Pradesh</option>
                  <option>Arunachal Pradesh</option>
                  <option>Assam</option>
                  <option>Bihar</option>
                  <option>Chandigarh</option>
                  <option>Chhasttisgarh</option>
                  <option>Dadra & Nagar Haveli & Daman & Diu</option>
                  <option>Delhi</option>
                  <option>Goa</option>
                  <option>Gujarat</option>
                  <option>Haryana</option>
                  <option>Himachal Pradesh</option>
                  <option>Jammu & Kashmir</option>
                  <option>Jharkhand</option>
                  <option>Karnataka</option>
                  <option>Kerala</option>
                  <option>Ladakh</option>
                  <option>Lakshadweep</option>
                  <option>Madhya Pradesh</option>
                  <option>Maharashtra</option>
                  <option>Manipur</option>
                  <option>Meghalay</option>
                  <option>Mizoram</option>
                  <option>Nagaland</option>
                  <option>Odisha</option>
                  <option>Puducherry</option>
                  <option>Punjab</option>
                  <option>Rajasthan</option>
                  <option>Sikkim</option>
                  <option>Tamil Nadu</option>
                  <option>Telangana</option>
                  <option>Tripura</option>
                  <option>Uttar Pradesh</option>
                  <option>Uttarakhand</option>
                  <option>West Bengal</option>
                  <option>Foreign Country</option>
                  <option>Other Territory</option>
                </select>
              </div>
              <div className="w-1/2 flex flex-col  justify-between">
                <p className="text-[13px]  text-gray-500 mb-2">PIN Code</p>
                <input
                  type="number"
                  placeholder=" Enter PIN Code"
                  className="text-sm font-semibold text-gray-600 outline-none hover:border-blue-500 border rounded  border-gray-300 p-2"
                />
              </div>
            </div>

            <div className="w-full flex flex-col mb-3 justify-between">
              <p className="text-[13px]  text-gray-500 mb-2">City</p>
              <input
                type="text"
                placeholder=" Enter City"
                className="text-sm font-semibold text-gray-600 outline-none hover:border-blue-500 border rounded  border-gray-300 px-2 py-1"
              />
            </div>

            <div className="w-full flex relative flex-col">
              <p className="text-[13px]  text-gray-500 mb-2">
                Are you GST Registered?
              </p>
              <div className="flex   ">
                <div className="flex items-center gap-2 w-3/4 justify-between">
                  <button className="text-xs font-semibold cursor-pointer flex items-center hover:bg-gray-100 justify-between border w-1/2 p-2 border-gray-300 hover:border-blue-500 rounded ">
                    Yes
                    <input
                      type="radio"
                      name="radio-1"
                      className="radio"
                      defaultChecked
                    />
                  </button>
                  <button className="text-xs font-semibold cursor-pointer hover:bg-gray-100 w-1/2 p-2 flex items-center justify-between border border-gray-300 hover:border-blue-500 rounded ">
                    No
                    <input type="radio" name="radio-1" className="radio" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center mt-3 w-full">
              <p className="text-[13px] text-gray-500">
                GSTIN<span className="text-red-600">*</span>
              </p>
              <input
                type="number"
                placeholder=" Enter Your GST Number"
                className="text-sm font-semibold text-gray-600 border outline-none  hover:border-blue-500 rounded  border-gray-300 p-2 "
              />
            </div>

            <div className="text-sm font-semibold mt-3 base flex items-center justify-between w-full p-2  border border-gray-300  rounded text-purple-300">
              Enable e-Invoicing
              <input type="checkbox" defaultChecked className="toggle" />
            </div>

            <div className="w-full flex flex-col mb-3 mt-3 justify-between">
              <p className="text-[13px]  text-gray-500 mb-2">PAN Nummber</p>
              <input
                type="text"
                placeholder=" Enter your PAN Number"
                className="text-sm font-semibold text-gray-700 outline-none hover:border-blue-500 border rounded  border-gray-300 p-2"
              />
            </div>

            <div className="w-full text-sm  mt-2 mb-5 flex items-center justify-between">
              Enable TDS
              <input type="checkbox" defaultChecked className="toggle" />
            </div>

            <div className="w-full text-sm  mt-2 flex items-center justify-between">
              Enable TCS
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
          </div>

          {/* right */}
          <div className=" flex flex-col p-4 mt-1 mb-2">
            <div className="flex gap-5 mb-4 items-center justify-between">
              <div className="w-1/2 flex flex-col  justify-between">
                <p className="text-[13px]  text-gray-600 mb-2">
                  Business Type (Select multiple, if applicable)
                </p>
                <select className="text-base text-gray-600 border rounded cursor-pointer  outline-none hover:border-blue-500 border-gray-300 p-2 ">
                  <option>Retailer</option>
                  <option>Wholesaler</option>
                  <option>Distributor</option>
                  <option>Manufacturer</option>
                  <option>Services</option>
                </select>
              </div>
              <div className="w-1/2 flex flex-col  justify-between">
                <p className="text-[13px]  text-gray-600 mb-2">Industry Type</p>
                <select className="text-base text-gray-600 border rounded cursor-pointer outline-none hover:border-blue-500 border-gray-300 p-2 ">
                  <option>Accounting and Financial Services</option>
                  <option>Agriculture</option>
                  <option>Automobile</option>
                  <option>Battery</option>
                  <option>Boardband/ cable/ internet</option>
                  <option>Building Material and Construction</option>
                  <option>Cleaning and pest Control</option>
                </select>
              </div>
            </div>

            <div className="w-1/2 flex flex-col  justify-between">
              <p className="text-[13px]  text-gray-600 mb-2">
                Business Registration Type{" "}
              </p>
              <select className="text-base text-gray-600 border rounded cursor-pointer outline-none hover:border-blue-500 border-gray-300 p-2 ">
                <option>Private Limited Company</option>
                <option>Public Limited Company</option>
                <option>Partnerships Films</option>
                <option>Limited Liability Partnership</option>
                <option>One Person Company</option>
                <option>Sole Proprietorship</option>
                <option>Section 8 Company</option>
                <option>Business Not Registered</option>
              </select>
            </div>

            <div className="flex items-center py-2 mb-3 mt-3 justify-center bg-[#F8F9FC]">
              <p className="text-[12px] font-bold">Note: </p>
              <p className="text-[12px] text-gray-600">
                Terms & Conditions and Signature added below will be shown on
                your Invoices
              </p>
            </div>

            <p className="text-[13px] text-gray-500">Signature</p>
            <div className="flex items-center justify-between py-2">
              <button
                onClick={() => setShowPopup(true)}
                className="border border-dashed p-11 text-xs border-blue-500 text-blue-500 cursor-pointer"
              >
                + Add Signature
              </button>
            </div>

            <div className="border rounded mt-2 border-gray-300">
              <div className=" py-3 border-b border-gray-300">
                <p className="text-xs ml-5 text-gray-500">
                  Add Business Details
                </p>
                <p className="text-[12px] ml-5 text-gray-500 ">
                  Add additional business information such as MSME number,
                  Website etc.
                </p>
              </div>
              <div className="p-3 flex items-center ">
                <input
                  type="text"
                  placeholder="Websites"
                  className="text-base text-gray-600 border outline-none  hover:border-blue-500 rounded  border-gray-300 p-2 ml-2 "
                />
                <p className="px-3 text-gray-500">=</p>
                <input
                  type="text"
                  placeholder=" www.websites.com"
                  className="text-base text-gray-600 border outline-none  hover:border-blue-500 rounded  border-gray-300 p-2 ml-2  "
                />
                <button className="rounded border bg-blue-600 text-base text-white text-semibold cursor-pointer hover:bg-blue-400 w-1/5 ml-4 py-2 ">
                  Add
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* right sidebar end */}

        <footer className="w-full">
          <div className="border-b border-t border-gray-300">
            <p className="text-[14px]  p-2">Company Settings</p>
          </div>

          <div className="m-4 ">
            <button className="flex items-center gap-6 rounded-2xl p-2 border border-zinc-200 hover:shadow-md cursor-pointer ">
              <img src={tally} alt="/src/assets/tally" className="w-10" />
              <div className="flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Data Export to Tally</p>
                  <p className="text-sm font-bold border rounded-3xl px-1 bg-blue-700 text-white ">
                    NEW
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Transfer vouchers, items and parties to Tally
                </p>
              </div>
            </button>
          </div>

          <div className="border-b border-t border-gray-300">
            <p className="text-[14px]  p-2">Add New Business</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <img src={store} alt="/src/assets/tally" className="w-100" />
            <p className="text-[13px] mb-3">
              Easily Manage all your businesses in one place on myBillBook app
            </p>
            <button className="text-xs font-bold text-white rounded px-4 py-1 hover:bg-indigo-400 bg-indigo-600 cursor-pointer">
              Create New Business
            </button>
          </div>
        </footer>
      </div>

      {/* Pop-up Section */}
      {showPopup && (
        <div className="absolute bg-white/60 h-screen w-full flex items-center justify-center">
          <div className="flex flex-col bg-zinc-200 w-1/5  rounded-lg items-center justify-between">
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
              <div className="w-1/2 text-sm flex flex-col items-center justify-center px-2 py-5  border rounded border-zinc-300 cursor-pointer hover:border-blue-600 hover:shadow-2xl">
                <FaFileSignature size={50} />
                Upload Signature from Desktop
              </div>
              <div className="w-1/2 text-sm flex flex-col items-center justify-center px-2 py-5  border rounded border-zinc-300 cursor-pointer hover:border-blue-600 hover:shadow-2xl">
                <PiRectangleBold size={50} />
                Upload Signature from Desktop
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardManageBusinessPage;
