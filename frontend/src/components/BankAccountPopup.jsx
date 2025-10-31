import { useMutation } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa6";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";
import { useBusinessStore } from "../store/businessStore";
import { useEffect } from "react";

const BankAccountPopup = ({
  data,
  handleInputChange,
  setIsAddedBankInfo,
  mutation,
  id,
  isEdit,
  updateBankInfo,
  setUpdateBankInfo,
  ifscError,
}) => {
  const { business } = useBusinessStore();

  const bankMutation = useMutation({
    mutationFn: async () => {
      if (data?.bankAccountNumber?.length === 0) {
        throw new Error("Bank Account Number is required");
      }
      const res = await axiosInstance.post(
        `/bank-account/?businessId=${business?._id}`,
        data
      );
      if (res.data.success) {
        toast.success(res.data.msg);
        document.getElementById("bank-modal").close();
        setIsAddedBankInfo(false);
      }
      return res.data;
    },

    onError: (err) => {
      console.log(err);
      toast.error(
        err.response.data.msg ?? err.message ?? "Something went wrong"
      );
    },
  });

  return (
    <>
      <button
        className="text-[var(--primary-btn)] rounded-xl text-xs  flex items-center gap-2 p-2"
        onClick={() => document.getElementById("bank-modal").showModal()}
      >
        <FaPlus />
        Add Bank Account
      </button>

      <dialog id="bank-modal" className="modal text-xs">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn rounded-xl btn-sm btn-circle btn-ghost absolute right-2 top-4">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg">Add Bank Account</h3>
          <div className="flex flex-col justify-center bg-white p-5 gap-6">
            <div className="flex justify-between gap-2">
              <div className="flex flex-col w-full gap-1">
                <p className="text-gray-600 text-xs">
                  Bank Account Number
                  <span className="text-red-500"> *</span>
                </p>
                <input
                  type="number"
                  name="bankAccountNumber"
                  value={data?.bankAccountNumber}
                  onChange={handleInputChange}
                  placeholder="ex-123456789"
                  className="border border-gray-200  rounded w-full p-1"
                />
                <small className="text-red-500">
                  {bankMutation?.error?.response?.data?.errors
                    ?.bankAccountNumber?._errors[0] ||
                    bankMutation?.error?.message}
                </small>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex flex-col w-1/2 gap-1">
                <p className="text-gray-600 text-xs">IFSC Code</p>
                <input
                  type="text"
                  placeholder="ex-ICIC0001234"
                  name="IFSCCode"
                  value={data?.IFSCCode}
                  onChange={handleInputChange}
                  className={`border rounded w-full p-1 ${
                    ifscError ? "border-red-500" : "border-gray-200"
                  }`}
                  maxLength={11}
                  style={{ textTransform: "uppercase" }}
                />
                <small className="text-red-500">{ifscError}</small>
              </div>
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">Bank & Branch Name</p>
                <input
                  type="text"
                  placeholder="ex-ICICI Bank, Jharkhand"
                  name="bankAndBranchName"
                  value={data?.bankAndBranchName}
                  onChange={handleInputChange}
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
                <p className="text-gray-600 text-xs">Account Holder’s Name</p>
                <input
                  type="text"
                  name="accountHoldersName"
                  value={data?.accountHoldersName}
                  onChange={handleInputChange}
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
                  value={data?.upiId}
                  onChange={handleInputChange}
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
          {isEdit ? (
            <div className="flex justify-end mt-2 gap-3">
              <button
                onClick={() => {
                  setIsAddedBankInfo(true);
                }}
                className="btn rounded-xl btn-sm bg-[var(--primary-btn)]"
              >
                Update
              </button>
            </div>
          ) : (
            <div className="flex justify-end mt-2 gap-3 ">
              {updateBankInfo ? (
                <button
                  onClick={() => {
                    setIsAddedBankInfo(true);
                    setUpdateBankInfo(false);
                  }}
                  className="btn rounded-xl btn-sm bg-[var(--primary-btn)]"
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAddedBankInfo(true);
                  }}
                  className="btn rounded-xl btn-sm bg-[var(--primary-btn)]"
                >
                  Add
                </button>
              )}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default BankAccountPopup;
