import { ArrowLeft, Keyboard, Settings } from "lucide-react";
import { useState } from "react";
import { FaCirclePlus, FaPlus } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import scanner from "../../assets/scanner.png";
import BankAccountPopup from "../BankAccountPopup";
import { useNavigate } from "react-router-dom";

const InvoicesForm = ({ title }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [notes, setNotes] = useState(false);
  const [termCondition, setTermCondition] = useState(false);
  const [account, setAccount] = useState(false);
  const [charges, setCharges] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [selectCheckBox, setSelectCheckBox] = useState(false);

  return (
    <main className="max-h-screen w-full">
      {/* navbar */}
      <header className="p-2 w-full flex items-center justify-between bg-white">
        <div className="flex items-center justify-center">
          <ArrowLeft onClick={() => navigate(-1)} />
          <span className="pl-3">Create {title}</span>
        </div>
        <div className="flex items-center justify-center gap-5">
          <Keyboard className="text-gray-700" />
          <button className="btn btn-sm">Settings</button>
          <button className="btn btn-info btn-sm">Save {title}</button>
        </div>
      </header>

      <section className="grid grid-cols-3  ">
        {/* first block */}
        <div className="border-t border-r border-zinc-300 ">
          <div className="bg-red flex items-center justify-between p-2 border-b border-b-zinc-300">
            <span className="text-xs">Bill To</span>
            <button className="btn btn-xs text-xxs border">
              Change Party
            </button>
          </div>
          <div className="p-2">
            <p className="text-sm font-medium pt-5">Cash Sale</p>
            <p className="text-xs pt-1 text-zinc-400">Phone Number:</p>
          </div>
        </div>
        {/* second block */}
        <div className="border-t border-r border-zinc-300 ">
          <div className="bg-red flex items-center justify-between p-2 border-b border-b-zinc-300">
            <span className="text-xs">Ship To</span>
            <button className="btn btn-xs text-xxs border">
              Change Shipping Address
            </button>
          </div>
          <div className="p-2">
            <p className="text-sm font-medium pt-5">Business Name</p>
            <p className="text-xs pt-1 text-zinc-400">Phone Number:</p>
          </div>
        </div>
        {/* third block */}
        <div className="border-t border-r border-zinc-300 pt-1">
          {/* upper part */}
          <div className=" p-2 flex space-x-2 items-center">
            <div className="">
              <p className="text-xs pb-2">Sales Invoice No: </p>
              <input
                type="number"
                placeholder=""
                className="input input-xs border-none bg-zinc-200 w-30"
              />
            </div>
            <div>
              <p className="text-xs pb-2 ">Sales Invoice Date: </p>
              <input
                type="date"
                placeholder=""
                className="input input-xs border-none bg-zinc-200 w-30"
              />
            </div>
          </div>
          {/* lower */}

          <div className="p-2">
            <button
              onClick={() => setOpen(true)}
              className={`btn btn-info btn-sm btn-dash px-20 w-fit ${
                open ? "hidden" : ""
              }`}
            >
              +Add Due Date
            </button>
          </div>

          {open && (
            <>
              <div className="flex justify-end  relative">
                <IoCloseCircle
                  size={25}
                  onClick={() => setOpen(false)}
                  className="text-gray-500 absolute top-0 right-57"
                />
              </div>
              <div className="px-2 py-4 flex space-x-2 border border-dashed w-fit m-2 rounded-md ">
                <div>
                  <p className="text-xs pb-2">Payment Terms: </p>
                  <div className="relative  rounded-sm">
                    <input
                      type="number"
                      placeholder=""
                      className="input input-xs  w-30"
                    />
                    <span className="text-xs absolute z-50 left-21 top-1.5 bg-zinc-200">
                      Days
                    </span>
                  </div>
                </div>
                <div className="">
                  <p className="text-xs pb-2">Due Date: </p>
                  <input
                    type="date"
                    placeholder=""
                    className="input input-xs border-none bg-zinc-200 w-30"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* third  */}
      <div className="w-full grid grid-cols-11 text-sm">
        <span className="border-t  p-2 border-gray-300 ">NO</span>
        <span className="border-t border-l  p-2 border-gray-300 col-span-3">
          Items/ Services
        </span>
        <span className="border-t border-l p-2 border-gray-300 ">HSN/ SAC</span>
        <span className="border-t border-l p-2 border-gray-300 ">Qty</span>
        <span className="border-l border-t p-2 border-gray-300 ">
          Price/Item (₹)
        </span>
        <span className="border-l border-t p-2 border-gray-300 ">Discount</span>
        <span className="border-l border-t p-2 border-gray-300 ">Tax</span>
        <span className="border-l border-t p-2 border-gray-300 ">
          Amount (₹)
        </span>
        <span className="border-l border-t border-r p-2 border-gray-300  text-gray-500">
          <FaCirclePlus size={24} />
        </span>
      </div>
      {/* button barcode div */}
      <div className="p-2 flex border-t border-r border-gray-300">
        <div className="w-7/10">
          <button className="btn btn-info btn-sm btn-dash w-full hover:bg-none">
            +Add Item
          </button>
        </div>
        <div className="px-2 ml-2 border border-gray-300 w-3/10 rounded-sm">
          <div className="flex items-center gap-10 justify-center">
            <img src={scanner} alt="qrcode_scanner" className="size-6" />
            <span className="font-medium">Scan Barcode</span>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-11 text-sm">
        <span className="border-t border-b border-r p-2 border-gray-300 col-span-8 text-end">
          SUBTOTAL
        </span>
        <span className="border-t border-b p-2 border-gray-300 ">₹ 0</span>
        <span className="border-t border-l border-b p-2 border-gray-300 ">
          ₹ 0
        </span>
        <span className="border p-2 border-gray-300 ">₹ 0</span>
      </div>

      {/* bottom grid part */}
      <div className="grid grid-cols-2 w-full ">
        {/* left grid part */}
        <div className=" border-l-zinc-300 py-2">
          {/* add notes */}
          <div>
            <span
              onClick={() => setNotes(true)}
              className={`px-2 w-fit text-info text-xs  ${
                notes ? "hidden" : ""
              }`}
            >
              +Add Notes
            </span>
            {notes && (
              <div className="p-2">
                <div className="flex justify-end  relative">
                  <IoCloseCircle
                    size={20}
                    onClick={() => setNotes(false)}
                    className="text-gray-500 absolute top-0 right-0 z-10"
                  />
                </div>
                <label htmlFor="" className="text-xs">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Notes"
                  className="input border-none w-full text-xs bg-zinc-200"
                />
              </div>
            )}
          </div>

          {/* add term & condition */}

          <div className="border-b border-b-zinc-300 py-2">
            <span
              onClick={() => setTermCondition(true)}
              className={`px-2 w-fit text-info text-xs  ${
                termCondition ? "hidden" : ""
              }`}
            >
              +Add Terms & Conditions
            </span>
            {termCondition && (
              <div className="p-2">
                <div className="flex justify-end  relative">
                  <IoCloseCircle
                    size={20}
                    onClick={() => setTermCondition(false)}
                    className="text-gray-500 absolute top-0 right-0 z-10"
                  />
                </div>
                <label htmlFor="" className="text-xs">
                  Terms and Conditions
                </label>
                <input
                  type="text"
                  placeholder="Enter your terms and conditions"
                  className="input border-none w-full text-xs bg-zinc-200"
                />
              </div>
            )}
          </div>

          {/* add new account */}
          <BankAccountPopup />
        </div>

        {/* Right Grid Part */}
        <div className="border-l border-l-zinc-300 py-2">
          {/* add additional charges */}
          <div>
            {charges && (
              <div className="px-2">
                <div className="flex justify-end  relative">
                  <IoCloseCircle
                    size={20}
                    onClick={() => setCharges(false)}
                    className="text-gray-500 absolute top-0 right-0 z-10"
                  />
                </div>
                <div className=" relative">
                  <input
                    type="text"
                    placeholder="Enter charge (ex. Transport Charge)"
                    className="input input-xs border-none text-xs bg-zinc-200"
                  />
                  <span className="absolute top-0 right-57 z-60 px-1 pt-1 text-xs">
                    ₹
                  </span>
                  <input
                    type="text"
                    placeholder=""
                    className="input input-xs  text-xs bg-zinc-200 w-20 absolute top-0 right-41"
                  />
                  <select
                    defaultValue="No Tax Applicable"
                    className="select select-xs absolute top-0 right-5 w-fit"
                  >
                    <option>No Tax Applicable</option>
                  </select>
                </div>
              </div>
            )}
            <div className="flex justify-between py-2 ">
              <span
                onClick={() => setCharges(true)}
                className={`px-2 w-fit text-info text-xs`}
              >
                +Add Another Charge
              </span>
              <span className=" text-xs pr-5 ">₹ 0</span>
            </div>
          </div>
          {/* taxable amount */}
          <div className="flex justify-between py-2">
            <span className={`px-2 w-fit text-xs`}>Taxable Amount</span>
            <span className=" text-xs pr-5">₹ 0</span>
          </div>
          {/* add discount */}
          <div className="border-b border-b-zinc-300 pb-2">
            <span
              onClick={() => setDiscount(true)}
              className={`px-2 w-fit text-info text-xs  ${
                discount ? "hidden" : ""
              }`}
            >
              +Add New Account
            </span>
            {discount && (
              <div className="p-2">
                <div className="flex justify-end items-center relative">
                  <IoCloseCircle
                    size={20}
                    onClick={() => setDiscount(false)}
                    className="text-gray-500 absolute top-0 right-0 z-10"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <select
                      defaultValue="Discount After Tax"
                      className="select w-fit select-xs"
                    >
                      <option>Discount After Tax</option>
                      <option>Discount Before Tax</option>
                    </select>
                  </div>
                  <div className="flex space-x-1 relative">
                    <span className="absolute top-0 right-98 z-60 px-1 pt-1 text-xs">
                      %
                    </span>
                    <input
                      type="text"
                      placeholder=""
                      className="input input-xs border-none w-fit text-xs bg-zinc-200 items-center px-5"
                    />
                    <span>/</span>
                    <span className="absolute top-0 right-51 z-70 px-1 pt-1 text-xs">
                      ₹
                    </span>
                    <input
                      type="text"
                      placeholder=""
                      className="input input-xs border-none w-fit text-xs bg-zinc-200 mr-10 items-center px-5 "
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* check box round-off section*/}
          <div className="border-b border-b-zinc-300 pb-2">
            <div className="pt-2 px-2 flex items-center justify-between">
              <div className="flex items-center justify-center py-2">
                <input
                  type="checkbox"
                  onChange={(e) => setSelectCheckBox(e.target.checked)}
                  className=" px-2 size-4 text-info text-xs"
                />
                <span className="text-xs">Auto Round Off</span>
              </div>
              {!selectCheckBox && ( // ✅ will render only when checkbox is not checked
                <div className="relative">
                  <select
                    defaultValue="Discount After Tax"
                    className="select w-fit select-xs"
                  >
                    <option>+Add</option>
                    <option>-Reduce</option>
                  </select>
                  <span className="absolute top-0 right-44 z-90 px-1 pt-1 text-xs">
                    ₹
                  </span>
                  <input
                    type="text"
                    className="input input-xs border-none w-fit text-xs bg-zinc-200 mr-2 items-center px-5"
                  />
                </div>
              )}
            </div>
            <div className="p-2 flex justify-between">
              <span className="text-sm font-semibold">Total Amount</span>
              <input
                type="text"
                placeholder="Enter Payment Amount"
                className="input input-xs border-none w-fit text-xs bg-zinc-200 mr-2 items-center px-5 "
              />
            </div>
          </div>
          {/* balance amount */}
          {(title === "Sales Invoice" || title === "Sales Return") && (
            <div className="p-2 border-b border-b-zinc-300 pb-2">
              <div className="flex justify-end p-2 pr-5 space-x-2">
                <span className="text-xs">Mark as fully paid</span>
                <input type="checkbox" className="size-4" />
              </div>
              <div className="text-xs flex justify-between items-center">
                <span className="text-green-500">Balance Amount</span>
                <span className="mr-4">₹ 0</span>
              </div>
            </div>
          )}

          {/* add signature */}
          <div className="p-2 flex flex-col items-end mr-2">
            <p className="text-xs pb-2">
              Authorized signatory for{" "}
              <span className="font-bold"> Business Name</span>
            </p>
            <div className="border border-dashed w-fit p-10 text-info">
              +Add Signature
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InvoicesForm;
