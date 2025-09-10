import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import BankAccountPopup from "../BankAccountPopup";

const SalesInvoiceFooterSection = ({ data, setData, title }) => {
  const [notes, setNotes] = useState(false);
  const [termCondition, setTermCondition] = useState(false);
  const [charges, setCharges] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [selectCheckBox, setSelectCheckBox] = useState(false);
  const [markAsPaid, setMarkedAsPaid] = useState(false);

  return (
    <div className="grid grid-cols-2 w-full ">
      {/* left grid part */}
      <div className=" border-l-zinc-300 py-2">
        {/* add notes */}
        <div>
          <span
            onClick={() => setNotes(true)}
            className={`px-2 w-fit text-info text-xs cursor-pointer  ${
              notes ? "hidden" : ""
            }`}
          >
            + Add Notes
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
              <label htmlFor="notes" className="text-xs">
                Notes
              </label>
              <input
                id="notes"
                type="text"
                value={data.notes}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                placeholder="Enter Your Notes"
                className="input  w-full text-xs bg-zinc-200"
              />
            </div>
          )}
        </div>

        {/* add term & condition */}
        <div className="border-b border-b-zinc-300 py-2">
          <span
            onClick={() => setTermCondition(true)}
            className={`px-2 w-fit text-info text-xs cursor-pointer ${
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
              <label htmlFor="t&c" className="text-xs">
                Terms and Conditions
              </label>
              <br />
              <textarea
                type="text"
                id="t&c"
                value={data.termsAndCondition}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    termsAndCondition: e.target.value,
                  }))
                }
                placeholder="Enter your terms and conditions"
                className="textarea bg-zinc-200 w-full"
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
              className={`px-2 w-fit text-info text-xs cursor-pointer`}
            >
              + Add Another Charge
            </span>
            <span className=" text-xs pr-5 ">₹ 0</span>
          </div>
        </div>
        {/* taxable amount */}
        <div className="flex justify-between py-2">
          <span className={`px-2 w-fit text-xs`}>Taxable Amount</span>
          <span className=" text-xs pr-5">
            ₹ {Number(data?.taxableAmount).toLocaleString("en-IN") || 0}
          </span>
        </div>
        {data?.items?.length > 0 && (
          <>
            <div className="flex justify-between py-2">
              <span className={`px-2 w-fit text-xs`}>SGST</span>
              <span className=" text-xs pr-5">₹ {data?.sgst}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className={`px-2 w-fit text-xs`}>CGST</span>
              <span className=" text-xs pr-5">₹ {data?.cgst}</span>
            </div>
          </>
        )}

        {/* add discount */}
        <div className="border-b border-b-zinc-300 pb-2">
          <span
            onClick={() => setDiscount(true)}
            className={`px-2 w-fit text-info text-xs cursor-pointer ${
              discount ? "hidden" : ""
            }`}
          >
            + Add Discount
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
                className="checkbox checkbox-sm mr-2"
              />
              <span className="text-xs">Auto Round Off</span>
            </div>
            {!selectCheckBox && (
              <div className="relative">
                <select
                  defaultValue=""
                  className="select w-fit select-xs bg-zinc-100"
                >
                  <option>+Add</option>
                  <option>-Reduce</option>
                </select>
                <span className="absolute top-[1px] right-51 z-90 px-1 pt-1 text-xs">
                  ₹
                </span>
                <input
                  type="text"
                  className="input input-xs  w-fit text-xs  mr-2 items-center px-5"
                />
              </div>
            )}
          </div>
          <div className="p-2 flex justify-between">
            <span className="text-sm font-semibold">Total Amount</span>
            {data?.items?.length > 0 ? (
              <>₹ {Number(data?.totalAmount).toLocaleString("en-IN")}</>
            ) : (
              <input
                type="text"
                placeholder="Enter Payment Amount"
                className="input input-xs border-none w-fit text-xs bg-zinc-200 mr-2 items-center px-5 "
              />
            )}
          </div>
        </div>
        {/* balance amount */}
        {(title === "Sales Invoice" || title === "Sales Return") && (
          <div className="p-2 border-b border-b-zinc-300 pb-2">
            <div className="flex justify-end p-2 pr-5 space-x-2">
              <span className="text-xs">Mark as fully paid</span>
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                onChange={(e) => setMarkedAsPaid(e.target.checked)}
              />
            </div>
            <div className="text-xs text-[var(--badge)] flex justify-between items-center">
              <span>Balance Amount</span>
              <span className="mr-4">
                {markAsPaid ? (
                  data.balanceAmount === 0
                ) : data?.items?.length > 0 ? (
                  <>
                    {"₹" + Number(data?.balanceAmount).toLocaleString("en-IN")}
                  </>
                ) : (
                  <span>₹ 0</span>
                )}
              </span>
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
  );
};

export default SalesInvoiceFooterSection;
