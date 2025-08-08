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
import { states } from "../utils/constants";

const DashboardManageBusinessPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <main className="flex max-h-screen overflow-y-scroll bg-white  relative p-2 border border-gray-200 shadow-2xs  ">
      <div className="w-full ">
        {/* Header */}
        <header className="flex items-center  p-2 justify-between border-b border-gray-300">
          <div className="flex items-center justify-center gap-5  mr-4">
            <div className="flex ml-3 flex-col ">
              <p className="text-md font-normal">Business Settings</p>
              <p className=" text-sm text-gray-500">
                Edit your company settings and information
              </p>
            </div>
            <button className="btn btn-sm bg-success">
              Create New Business
            </button>
          </div>

          <div className="flex items-center justify-center mr-3 gap-4 ">
            <p className="text-gray-500 cursor-pointer">
              <MdKeyboard size={25} />
            </p>
            <button className="btn btn-sm btn-info btn-soft">
              <RiChat1Line size={14} />
              Chat Support
            </button>
            <button className="btn btn-sm btn-outline btn-info">
              <MdOutlineCalendarToday size={14} />
              Close Financial Year
            </button>
            <button className="btn btn-sm ">Cancel</button>
            <button className="btn btn-sm btn-primary">Save Changes</button>
          </div>
        </header>

        {/* main section */}
        <section className="min-h-screen  grid grid-cols-2 gap-2">
          {/* left  */}
          <div className="flex flex-col  p-4 mt-1 ml-2">
            <div className="flex gap-7 mb-4">
              <label
                htmlFor="file"
                className="border flex-col items-center  justify-center bg-[#F6F9FF] border-blue-500 flex border-dashed  cursor-pointer p-5 text-xs gap-2"
              >
                <LuImagePlus size={20} className="text-blue-500" />
                <span className="text-nowrap text-blue-500 font-semibold">
                  Upload Logo
                </span>
                <small className="text-nowrap">JPG/PNG, max-5MB</small>
              </label>
              <input type="file" id="file" className="hidden" />
              <div className="flex ml-3 flex-col gap-2 justify-center  w-full">
                <p className="text-[13px]  text-gray-500">
                  Business Name<span className="text-red-600">*</span>
                </p>
                <input
                  type="text"
                  placeholder="Business Name"
                  className="input input-sm"
                />
              </div>
            </div>
            <div className="flex gap-5 mb-4 items-center justify-between">
              <div className="flex  flex-col gap-2 justify-center  w-full">
                <p className="text-[13px]  text-gray-500">Phone number</p>
                <input
                  type="text"
                  placeholder="Enter Company Phone Number"
                  className="input input-sm"
                />
              </div>
              <div className="flex ml-3 flex-col gap-2 justify-center  w-full">
                <p className="text-[13px]  text-gray-500">Company Email</p>
                <input
                  type="text"
                  placeholder="Enter Company Email"
                  className="input input-sm"
                />
              </div>
            </div>
            <div className="flex flex-col mb-4 ">
              <p className="text-[13px]  text-gray-500 mb-2">Billing Address</p>
              <textarea
                placeholder="Enter Billing Address"
                className="textarea w-full"
              />
            </div>

            <div className=" flex gap-5 mb-4 items-center justify-between">
              <div className="w-full flex flex-col  justify-between">
                <p className="text-[13px]  text-gray-500 ">Optional</p>
                <fieldset className="fieldset mt-2">
                  <select
                    defaultValue="Pick a browser"
                    className="select select-sm "
                  >
                    {states?.map((state) => (
                      <option disabled={state === "Enter state"}>
                        {state}
                      </option>
                    ))}
                  </select>
                </fieldset>
              </div>
              <div className="flex ml-3 flex-col gap-2 justify-center  w-full">
                <p className="text-[13px]  text-gray-500">PIN Code</p>
                <input
                  type="text"
                  placeholder="Enter PIN Code"
                  className="input input-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center  w-full">
              <p className="text-[13px]  text-gray-500">City</p>
              <input
                type="text"
                placeholder="Enter City"
                className="input input-sm"
              />
            </div>

            <div className="w-full mt-5 flex relative flex-col">
              <p className="text-[13px]  text-gray-500 mb-2">
                Are you GST Registered?
              </p>
              <div className="flex   ">
                <div className="flex items-center gap-2 w-3/4 justify-between">
                  <button className="text-xs font-semibold cursor-pointer flex items-center hover:bg-gray-100 justify-between border w-1/2 p-2 border-gray-300  rounded hover:border-info">
                    Yes
                    <input
                      type="radio"
                      name="radio-9"
                      className="radio radio-info radio-sm"
                      defaultChecked
                    />
                  </button>
                  <button className="text-xs font-semibold cursor-pointer hover:bg-gray-100 w-1/2 p-2 flex items-center justify-between border border-gray-300  rounded hover:border-info">
                    No
                    <input
                      type="radio"
                      name="radio-9"
                      className="radio radio-info radio-sm"
                      defaultChecked
                    />
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
                placeholder="Enter your GST number"
                className="input input-sm"
              />
            </div>

            <div className=" font-semibold mt-3 base flex items-center justify-between w-full p-[5.8px] px-3 text-xs border border-gray-300  rounded text-purple-300">
              Enable e-Invoicing
              <input
                type="checkbox"
                defaultChecked
                className="toggle toggle-sm "
              />
            </div>

            <div className="w-full flex flex-col mb-3 mt-3 justify-between">
              <p className="text-[13px]  text-gray-500 mb-2">PAN Nummber</p>
              <input
                type="text"
                placeholder="Enter PAN number"
                className="input input-sm"
              />
            </div>

            <div className="w-full text-sm  mt-2 mb-5 flex items-center justify-between">
              Enable TDS
              <input
                type="checkbox"
                defaultChecked
                className="toggle toggle-sm"
              />
            </div>

            <div className="w-full text-sm  mt-2 flex items-center justify-between">
              Enable TCS
              <input
                type="checkbox"
                defaultChecked
                className="toggle toggle-sm"
              />
            </div>
          </div>

          {/* right */}
          <div className=" flex flex-col p-4 mt-1 mb-2">
            <div className="flex gap-5 mb-4 items-center justify-between">
              <div className="w-1/2 flex flex-col  justify-between">
                <p className="text-[13px]  text-gray-600 mb-2">
                  Business Type (Select multiple, if applicable)
                </p>
                <select className="select select-sm ">
                  <option>Retailer</option>
                  <option>Wholesaler</option>
                  <option>Distributor</option>
                  <option>Manufacturer</option>
                  <option>Services</option>
                </select>
              </div>
              <div className="w-1/2 flex flex-col justify-between">
                <p className="text-[13px]  text-gray-600 mb-2">Industry Type</p>
                <select className="select select-sm mt-[15.5px]">
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
              <select className="select select-sm ">
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

            <div className="flex items-center py-2 my-3 justify-center bg-[#F8F9FC]">
              <p className="text-xs font-bold">Note: </p>
              <p className="text-xs text-gray-600">
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
                  className="input input-sm "
                />
                <p className="px-3 text-gray-500">=</p>
                <input
                  type="text"
                  placeholder=" www.websites.com"
                  className="input input-sm  "
                />
                <button className="btn btn-sm btn-info ml-3">Add</button>
              </div>
            </div>
          </div>
        </section>
        {/* right sidebar end */}

        <footer className="w-full pb-8">
          <div className="border-b border-t border-gray-300">
            <p className="text-[14px]  p-2">Company Settings</p>
          </div>

          <div className="m-4">
            <button className="px-3 flex items-center gap-6 rounded-2xl p-2 border border-zinc-200 hover:shadow-md cursor-pointer ">
              <img src={tally} alt="/src/assets/tally" className="w-10" />
              <div className="flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Data Export to Tally</p>
                  <span className="text-sm font-semibold border rounded-3xl px-3 bg-error text-white ">
                    NEW
                  </span>
                </div>
                <p className="text-xs mt-1 text-gray-500">
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
            <button className="btn btn-sm btn-soft font-bold text-success-content rounded bg-success  cursor-pointer">
              Create New Business
            </button>
          </div>
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
              <div className="w-1/2 text-sm flex flex-col items-center justify-center px-2 py-5  border rounded border-zinc-300 cursor-pointer hover:border-info hover:shadow-2xl">
                <FaFileSignature size={50} />
                Upload Signature from Desktop
              </div>
              <div className="w-1/2 text-sm flex flex-col items-center justify-center px-2 py-5  border rounded border-zinc-300 cursor-pointer hover:border-info hover:shadow-2xl">
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
