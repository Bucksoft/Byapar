import { FaPlus } from "react-icons/fa6";

const BankAccountPopup = () => {
  return (
    <>
      <button
        className="text-[var(--primary-btn)] text-xs flex items-center gap-2 p-2"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
        <FaPlus />
        Add Bank Account
      </button>

      <dialog id="my_modal_3" className="modal text-xs">
        <div className="modal-box ">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-4">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg">Add Bank Account</h3>
          <div className="flex flex-col justify-center bg-white p-5 gap-6">
            <div className="flex justify-between gap-2">
              <div className="flex flex-col w-1/2 gap-1">
                <p className="text-gray-600 text-xs">
                  Bank Account Number
                  <span className="text-red-500"> *</span>
                </p>
                <input
                  type="number"
                  placeholder="ex-123456789"
                  className="border border-gray-200  rounded w-full p-1"
                />
              </div>
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs text-nowrap">
                  Re-Enter Bank Account Number
                  <span className="text-red-500"> *</span>
                </p>
                <input
                  type="number"
                  placeholder="ex-123456789"
                  className="border border-gray-200  rounded w-full p-1"
                />
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">IFSC Code</p>
                <input
                  type="text"
                  placeholder="ex-ICIC0001234"
                  className="border border-gray-200  rounded w-full p-1"
                />
              </div>
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">Bank & Branch Name</p>
                <input
                  type="text"
                  placeholder="ex-ICICI Bank, Jharkhand"
                  className="border border-gray-200  rounded w-full p-1"
                />
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">Account Holder’s Name</p>
                <input
                  type="text"
                  placeholder="ex-Manish"
                  className="border border-gray-200  rounded w-full p-1"
                />
              </div>
              <div className="flex flex-col  w-1/2 gap-1">
                <p className="text-gray-600 text-xs">UPI ID</p>
                <input
                  type="text"
                  placeholder="ex:manis@upi"
                  className="border border-gray-200  rounded w-full p-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-2 gap-3 ">
            <button className="btn btn-sm bg-[var(--primary-btn)]">
              Submit
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default BankAccountPopup;
