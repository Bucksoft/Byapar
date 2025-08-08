import { TbSettings } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa6";
import { FaKeyboard } from "react-icons/fa6";
import { BsCurrencyRupee } from "react-icons/bs";
import { BsBank } from "react-icons/bs";

const DashboardAddPartyPage = () => {
  return (
    <main className="flex flex-col ml-2 h-screen w-full">
      <header className="flex p-4  w-full  items-center justify-between border-b border-gray-300">
        <div className="flex items-center ml-3 text-xl gap-2 font-sembold">
          <FaArrowLeft />
          Create Party
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-gray-600 cursor-pointer px-4 ">
            <FaKeyboard size={23} />
          </p>
          <button className="text-xs flex items-center border curser-pointer hover:bg-gray-300 rounded px-4 py-1 gap-2 cursor-pointer border-gray-300 bg-white">
            Party Setting
            <TbSettings size={21} />
          </button>
          <button className="text-xs font-bold px-11 py-2 cursor-pointer bg-blue-800 rounded text-white hover:bg-blue-400 border border-gray-300 curser-pointer">
            Save
          </button>
        </div>
      </header>

      <div className="text-base bg-#FBFBFD w-full px-4 py-2 border-b border-gray-300">
        General Details
      </div>

      <section className="p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">
            Party Name<span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            placeholder="Enter name"
            className="border-1 border-gray-300  mt-1 w-85 p-2 rounded"
          />
        </div>
        <div>
          <div className="text-xs text-gray-500">Mobile number</div>
          <input
            type="number"
            placeholder="Enter Mobile number"
            className="border-1 border-gray-300 w-85 mt-1 p-2 rounded"
          />
        </div>
        <div>
          <div className="text-xs text-gray-500">Email</div>
          <input
            type="text"
            placeholder="Enter Email"
            className="border-1 border-gray-300 w-85 mt-1 p-2 rounded"
          />
        </div>
        <div>
          <div className="text-xs  text-gray-500">Opening Balance</div>
          <div className="flex items-center relative">
            <span className="absolute left-2 ">
              <BsCurrencyRupee className="text-zinc-500 w-4" />
            </span>
            <input
              type="number"
              placeholder=" 0"
              className="border-1 border-gray-300 w-42 mt-1 px-5 p-2 rounded"
            />
            <select className="border border-gray-300 cursor-pointer w-42 p-2 rounded">
              <option>To Collect</option>
              <option>To Pay</option>
            </select>
          </div>
        </div>
      </section>

      <section className="flex p-4">
        <div>
          <div className="text-xs text-gray-500">
            GSTIN<span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            placeholder="ex:29xxxxx9438x1xx"
            className="border-1 border-gray-300 mt-1 w-55 p-2 rounded"
          />
        </div>
        <button className="w-40 h-8 mt-7 ml-6 bg-purple-200 text-xs font-bold  rounded">
          Get Details
        </button>
        <div className="ml-6">
          <div className="text-xs text-gray-500 ml-1 ">
            PAN Number<span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            placeholder="Enter party PAN Number"
            className="border-1 border-gray-300 w-55 mt-1 p-2 rounded"
          />
        </div>
      </section>

      <p className="text-[12px] text-gray-500 ml-5  mb-10 ">
        Note: You can auto populate party details from GSTIN
      </p>

      <div className="border-b border-gray-300"></div>

      <section className="flex">
        <div className="ml-6 mt-5">
          <div className="text-xs text-gray-500 ml-1 ">
            Party Type<span className="text-red-500">*</span>
          </div>
          <select className="border border-gray-300 w-75 p-2 mt-1 rounded">
            <option>Customer</option>
            <option>Supplier</option>
          </select>
        </div>

        <div className="ml-6 mt-5 mb-5">
          <div className="text-xs text-gray-500 ml-1 ">
            Party Category<span className="text-red-500">*</span>
          </div>
          <select className="border border-gray-300 w-75 p-2 mt-1 rounded">
            <option>Select Category</option>
          </select>
        </div>
      </section>

      <div className="py-2 border-b border-t border-gray-300">
        <p className="text-base w-full  ml-7 ">Address</p>
      </div>

      <section className="flex items-center justify-center ml-6 mt-6 mb-5 gap-8">
        <div className="flex flex-col ">
          <div className="text-xs text-gray-500">
            Billing Address<span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            placeholder="Enter billing address"
            className="border border-gray-300 mt-1 w-190 h-25 p-2 rounded"
          />
        </div>

        <div className="flex flex-col border-b border-gray-300 mb-2">
          <div className="flex justify-between">
            <div className="text-xs mr-7 text-gray-500">
              Shipping Address<span className="text-red-500">*</span>
            </div>
            <p className="text-base  text-gray-400">
              <input
                type="checkbox"
                defaultChecked
                className="checkbox size-5 mr-2"
              />
              Same as Billing address
            </p>
          </div>
          <input
            type="text"
            placeholder="Enter Shipping Address"
            className="border border-gray-300 p-2 mt-1 w-190 h-25  rounded"
          />
        </div>
      </section>

      <div className="border-b border-gray-300"></div>

      <section className="p-5 flex gap-7  mb-5 items-center ">
        <div className="relative">
          <div className="text-xs text-gray-500">
            Credit Period<span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            placeholder="30"
            className="border-1 border-gray-300  mt-1 w-85 p-2 rounded"
          />
          <span className=" absolute items-center flex right-1 bottom-1 w-10 h-9 text-sm bg-gray-100 border-l text-gray-600">
            Days
          </span>
        </div>

        <div>
          <div className="text-xs text-gray-500">Credit Limit</div>
          <div className="flex items-center relative">
            <span className="absolute left-2 bottom-3  ">
              <BsCurrencyRupee className="text-zinc-500 w-4" />
            </span>
            <input
              type="number"
              placeholder=" 0"
              className="border-1 border-gray-300 w-75 mt-1 px-5 p-2 rounded"
            />
          </div>
        </div>
      </section>

      <div className="border-b border-t px-7 py-2 border-gray-300 text-base">
        Party Bank Account
      </div>

      <section className="flex flex-col items-center  justify-center">
        <div className="flex flex-col  items-center justify-center w-full h-45">
          <p className="text-gray-500 mb-5">
            <BsBank size={40} />
          </p>
          <p className="text-base mb-5 text-gray-500">
            Add party bank information to manage transactions
          </p>
          <p className="text-base text-info cursor-pointer hover:text-gray-500">
            + Add Bank Account
          </p>
        </div>
      </section>

      <div className="border-b border-t px-7 py-2 border-gray-300 text-base">
        Custom Field
      </div>

      <section className="flex flex-col items-center  justify-center">
        <div className="flex flex-col gap-3 items-center justify-center w-full h-60">
          <button className="text-[12px] text-gray-400 py-1 w-30 border rounded border-gray-300">
            Birthday
          </button>
          <button className="text-[12px] text-gray-400 py-2 w-30 border rounded border-gray-300">
            Drug license no
          </button>
          <div className="flex items-center gap-1">
            <p className="text-base text-gray-500">
              Store more information about your parties by adding custom fields
              from
            </p>
            <p className="text-base text-gray-900 font-semibold">
              Party Settings
            </p>
          </div>
          <button className="text-xs text-white font-bold bg-blue-800 hover:bg-blue-400 py-2 px-6 rounded cursor-pointer">
            Add Custom Fields
          </button>
        </div>
      </section>
    </main>
  );
};

export default DashboardAddPartyPage;
