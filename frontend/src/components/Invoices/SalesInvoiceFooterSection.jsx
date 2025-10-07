import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import BankAccountPopup from "../BankAccountPopup";
import BankAccountPopupForBusiness from "../BankAccountPopupForBusiness";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import { useBusinessStore } from "../../store/businessStore";
import { useBusinessBankAccountStore } from "../../store/businessBankAccount";
import toast from "react-hot-toast";
import { Pen, Trash } from "lucide-react";
import BusinessBankAccount from "../../../../backend/src/models/businessBankAccount";

const SalesInvoiceFooterSection = ({ data, setData, title }) => {
  const [notes, setNotes] = useState(false);
  const [termCondition, setTermCondition] = useState(false);
  const [charges, setCharges] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [selectCheckBox, setSelectCheckBox] = useState(false);
  const [markAsPaid, setMarkedAsPaid] = useState(false);
  const { business } = useBusinessStore();
  const { setBankAccounts } = useBusinessBankAccountStore();
  const [isDeletePopup, setIsDeletePopup] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [isEditingAccount, setIsEditingAccount] = useState(false);

  const { isLoading, data: bankAccounts } = useQuery({
    queryKey: ["businessBankAccounts"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/bank-account/${business?._id}`);
      setBankAccounts(res.data);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/bank-account/${accountId}`);
      if (res.data.success) {
        toast.success(res.data.msg);
        queryClient.invalidateQueries({
          queryKey: ["businessBankAccounts"],
        });
        document.getElementById("delete-modal").close();
      }
    },
  });

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
        <BankAccountPopupForBusiness />
        {bankAccounts &&
          bankAccounts.map((bankAccount) => (
            <div
              key={bankAccount._id}
              className=" mt-2 border border-zinc-200 mx-5 p-2"
            >
              {/* ACCOUNT NAME */}
              <div className="flex items-center gap-2 text-sm">
                <h2 className="font-semibold text-zinc-700">Account Name</h2>
                <p>{bankAccount?.accountName}</p>
              </div>

              {/* ACCOUNT NUMBER */}
              <div className="flex items-center gap-2 text-sm">
                <h2 className="font-semibold text-zinc-700">Account Number</h2>
                <p>{bankAccount?.bankAccountNumber}</p>
              </div>

              {/* IFSC Code */}
              <div className="flex items-center gap-2 text-sm">
                <h2 className="font-semibold text-zinc-700">IFSC Code</h2>
                <p>{bankAccount?.IFSCCode}</p>
              </div>

              {/* Account Holder's Name */}
              <div className="flex items-center gap-2 text-sm">
                <h2 className="font-semibold text-zinc-700">
                  Account Holder's Name
                </h2>
                <p>{bankAccount?.accountHoldersName}</p>
              </div>

              <div className="flex gap-2 clear-start mt-2">
                <button
                  className="btn btn-xs btn-error btn-outline"
                  onClick={() => {
                    document.getElementById("delete-modal").showModal();
                    setAccountId(bankAccount?._id);
                  }}
                >
                  <Trash size={14} />
                </button>
                {/* <button
                  onClick={() => setIsEditingAccount(true)}
                  className="btn btn-xs btn-success btn-outline"
                >
                  <Pen size={14} />
                </button> */}
              </div>
            </div>
          ))}
      </div>
      {/* Right Grid Part */}
      <div className="border-l border-l-zinc-300 py-2">
        {/* add additional charges */}
        <div>
          {charges && (
            <div className="px-2">
              <div className="flex justify-end relative">
                <IoCloseCircle
                  size={20}
                  onClick={() => setCharges(false)}
                  className="text-gray-500 absolute top-0 right-0 z-10"
                />
              </div>
              <div className=" relative">
                <input
                  type="text"
                  value={data?.additionalChargeReason}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      additionalChargeReason: e.target.value,
                    }))
                  }
                  placeholder="Enter charge (ex. Transport Charge)"
                  className="input input-xs border-none text-xs bg-zinc-200"
                />
                <span className="absolute top-0 right-57 z-60 px-1 pt-1 text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="0"
                  disabled={data.additionalChargeReason.length === 0}
                  value={data?.additionalChargeAmount}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      additionalChargeAmount: Number(e.target.value),
                    }))
                  }
                  className="input input-xs  text-xs bg-zinc-200 w-20 absolute top-0 right-41"
                />
                <select
                  defaultValue="No Tax Applicable"
                  value={
                    data.additionalChargeReason.length > 0
                      ? data?.additionalChargeTax
                      : 0
                  }
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      additionalChargeTax: e.target.value,
                    }))
                  }
                  className="select select-xs absolute top-0 right-5 w-fit"
                >
                  <option>No Tax Applicable</option>
                  {data?.items.map((item) => (
                    <option key={item?._id}>{item?.gstTaxRate}</option>
                  ))}
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
              <span className=" text-xs pr-5">
                ₹ {Number(data?.sgst).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className={`px-2 w-fit text-xs`}>CGST</span>
              <span className=" text-xs pr-5">
                ₹ {Number(data?.cgst).toLocaleString("en-IN")}
              </span>
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
                    // defaultValue="Discount After Tax"
                    className="select w-fit select-xs"
                    value={data?.additionalDiscountType}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        additionalDiscountType: e.target.value,
                      }))
                    }
                  >
                    <option value={"after tax"} className="hidden">
                      Discount After Tax
                    </option>
                    <option value={"after tax"}>Discount After Tax</option>
                    <option value={"before tax"}>Discount Before Tax</option>
                  </select>
                </div>
                <div className="flex space-x-1 relative">
                  <span className="absolute top-0 right-47 z-60 px-1 pt-1 text-xs">
                    %
                  </span>
                  <input
                    type="text"
                    placeholder="0"
                    value={data?.additionalDiscountAmount}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        additionalDiscountAmount: Number(e.target.value) || 0,
                      }))
                    }
                    className="input input-xs border-none w-fit text-xs bg-zinc-200 items-center px-5"
                  />
                  {/* <span>/</span>
                  <span className="absolute top-0 right-51 z-70 px-1 pt-1 text-xs">
                    ₹
                  </span>
                  <input
                    type="text"
                    placeholder=""
                    className="input input-xs border-none w-fit text-xs bg-zinc-200 mr-10 items-center px-5 "
                  /> */}
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
            {/* {!selectCheckBox && (
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
            )} */}
          </div>
          <div className="p-2 flex justify-between">
            <span className="text-sm font-semibold">Total Amount</span>
            {data?.items?.length > 0 ? (
              <>
                ₹{" "}
                {(selectCheckBox
                  ? Math.round(Number(data?.totalAmount))
                  : Number(data?.totalAmount)
                ).toLocaleString("en-IN")}
              </>
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
        {/* <div className="p-2 flex flex-col items-end mr-2">
          <p className="text-xs pb-2">
            Authorized signatory for{" "}
            <span className="font-bold"> Business Name</span>
          </p>
          <div className="border border-dashed w-fit p-10 text-info">
            +Add Signature
          </div>
        </div> */}
      </div>
      {
        <>
          <dialog id="delete-modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Deletion</h3>
              <p className="py-4 text-sm">
                Are you sure you want to remove the selected account ? This
                action cannot be undone.
              </p>
              <div className="flex w-full">
                <button
                  onClick={() => mutation.mutate()}
                  className="btn btn-sm btn-ghost  ml-auto text-[var(--error-text-color)]"
                >
                  Delete
                </button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </>
      }
    </div>
  );
};

export default SalesInvoiceFooterSection;
