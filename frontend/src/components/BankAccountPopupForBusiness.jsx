import { useMutation } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa6";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useBusinessStore } from "../store/businessStore";
import { queryClient } from "../main";

const BankAccountPopupForBusiness = () => {
  const [accountName, setAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [openingBalance, setOpeningBalance] = useState(0);
  const [bankAndBranchName, setBankAndBranchName] = useState("");
  const [accountHoldersName, setAccountHoldersName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [asOfDate, setAsOfDate] = useState(new Date());

  const { business } = useBusinessStore();
  const bankMutation = useMutation({
    mutationFn: async () => {
      // API request
      const res = await axiosInstance.post(`/bank-account/${business?._id}`, {
        accountName,
        bankAccountNumber,
        ifscCode,
        openingBalance,
        bankAndBranchName,
        accountHoldersName,
        upiId,
        asOfDate,
      });
      if (res.data.success) {
        toast.success(res.data.msg);
        document.getElementById("bank-modal").close();
        queryClient.invalidateQueries({
          queryKey: ["businessBankAccounts", business?._id],
        });
      }
      return res.data;
    },
    onError: (err) => {
      // // Check if it's an Axios error
      // if (err.response?.data?.msg) {
      //   toast.error(err.response.data.msg);
      // } else if (err.message) {
      //   toast.error(err.message); // JS error (like validation)
      // } else {
      //   toast.error("Something went wrong");
      // }
      console.error(err);
    },
  });

  return (
    <>
      <button
        className="text-[var(--primary-btn)] text-xs flex items-center gap-2 p-2"
        onClick={() => document.getElementById("bank-modal").showModal()}
      >
        <FaPlus />
        Add Bank Account
      </button>

      <dialog id="bank-modal" className="modal text-xs">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-4">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg">Add Bank Account</h3>
          <div className="flex flex-col justify-center bg-white p-5 gap-3">
            <div className="flex justify-between gap-2">
              <div className="flex flex-col w-full gap-1">
                <p className="text-gray-600 text-xs">
                  Account Name
                  <span className="text-red-500"> *</span>
                </p>
                <input
                  type="text"
                  name="acountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Personal Account"
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {
                    bankMutation?.error?.response?.data?.errors?.accountName
                      ?._errors[0]
                  }
                </small>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <div className="flex flex-col w-full gap-1">
                <p className="text-gray-600 text-xs">
                  Bank Account Number
                  <span className="text-red-500"> *</span>
                </p>
                <input
                  type="number"
                  name="bankAccountNumber"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="ex-123456789"
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {
                    bankMutation?.error?.response?.data?.errors
                      ?.bankAccountNumber?._errors[0]
                  }
                </small>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <div className="flex flex-col w-1/2 gap-1">
                <p className="text-gray-600 text-xs">Opening Balance</p>
                <input
                  type="number"
                  name="openingbalance"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  placeholder="ex-123456789"
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {
                    bankMutation?.error?.response?.data?.errors?.openingBalance
                      ?._errors[0]
                  }
                </small>
              </div>
              <div className="flex justify-between w-1/2 gap-2">
                <div className="flex flex-col  w-full gap-1">
                  <p className="text-gray-600 text-xs">As of Date</p>
                  <input
                    type="date"
                    name="asofDate"
                    value={asOfDate}
                    onChange={(e) => setAsOfDate(e.target.value)}
                    placeholder="ex-123456789"
                    className="border border-gray-200  rounded w-full p-1"
                  />
                  <small className="text-red-500">
                    {
                      bankMutation?.error?.response?.data?.errors?.asOfDate
                        ?._errors[0]
                    }
                  </small>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">
                  IFSC Code <span className="text-red-500"> *</span>
                </p>

                <input
                  type="text"
                  placeholder="ex-ICIC0001234"
                  name="IFSCCode"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {
                    bankMutation?.error?.response?.data?.errors?.ifscCode
                      ?._errors[0]
                  }
                </small>
              </div>
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">
                  Bank & Branch Name <span className="text-red-500"> *</span>
                </p>

                <input
                  type="text"
                  placeholder="ex-ICICI Bank, Jharkhand"
                  name="bankAndBranchName"
                  value={bankAndBranchName}
                  onChange={(e) => setBankAndBranchName(e.target.value)}
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {
                    bankMutation?.error?.response?.data?.errors
                      ?.bankAndBranchName?._errors[0]
                  }
                </small>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">
                  Account Holder’s Name <span className="text-red-500"> *</span>
                </p>

                <input
                  type="text"
                  name="accountHoldersName"
                  value={accountHoldersName}
                  onChange={(e) => setAccountHoldersName(e.target.value)}
                  placeholder="ex-Manish"
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {
                    bankMutation?.error?.response?.data?.errors
                      ?.accountHoldersName?._errors[0]
                  }
                </small>
              </div>
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">UPI ID</p>
                <input
                  type="text"
                  name="upiId"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="ex:manis@upi"
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {
                    bankMutation?.error?.response?.data?.errors?.upiId
                      ?._errors[0]
                  }
                </small>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-2 gap-3 ">
            <button
              onClick={() => bankMutation.mutate()}
              className="btn btn-sm bg-[var(--primary-btn)]"
            >
              Add
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default BankAccountPopupForBusiness;
