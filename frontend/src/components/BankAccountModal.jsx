import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";

const BankAccountsModal = ({ data, setData, businessId, partyId }) => {
  const [newBank, setNewBank] = useState({
    accountHoldersName: "",
    bankAccountNumber: "",
    IFSCCode: "",
    bankAndBranchName: "",
    upiId: "",
  });

  const [bankAccounts, setBankAccounts] = useState(data?.bankAccounts || []);

  const handleAddBank = () => {
    if (
      !newBank.accountHoldersName ||
      !newBank.bankAccountNumber ||
      !newBank.IFSCCode
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const updated = [...bankAccounts, { ...newBank, id: Date.now() }];
    setBankAccounts(updated);
    setNewBank({
      accountHoldersName: "",
      bankAccountNumber: "",
      IFSCCode: "",
      bankAndBranchName: "",
      upiId: "",
    });
  };

  const handleDeleteBank = (id) => {
    setBankAccounts((prev) => prev.filter((b) => b.id !== id));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch(
        `/bank-account/?businessId=${businessId}&partyId=${partyId}`,
        { bankAccounts }
      );
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res?.msg || "Bank accounts updated");
      setData((prev) => ({
        ...prev,
        bankAccounts,
      }));
      document.getElementById("bankAccountModal").close();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.msg || "Error updating bank accounts");
      document.getElementById("bankAccountModal").close();
    },
  });

  console.log(data);

  return (
    <dialog id="bankAccountModal" className="modal">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Manage Bank Accounts</h3>

        <div className="space-y-3">
          {bankAccounts.map((b, i) => (
            <div
              key={b.id}
              className="border border-gray-300 rounded-md p-3 flex justify-between items-start"
            >
              <div>
                <p className="font-medium text-sm">
                  {b.accountHoldersName} ({b.bankAccountNumber})
                </p>
                <p className="text-xs text-gray-500">
                  {b.bankAndBranchName} — {b.IFSCCode}
                </p>
                {b.upiId && <p className="text-xs">UPI: {b.upiId}</p>}
              </div>
              <button
                className="btn btn-xs rounded-xl btn-error btn-outline"
                onClick={() => handleDeleteBank(b.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="divider">Add New Bank</div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Account Holder's Name"
            className="input input-bordered input-sm"
            value={newBank.accountHoldersName}
            onChange={(e) =>
              setNewBank({ ...newBank, accountHoldersName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Bank Account Number"
            className="input input-bordered input-sm"
            value={newBank.bankAccountNumber}
            onChange={(e) =>
              setNewBank({ ...newBank, bankAccountNumber: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="IFSC Code"
            className="input input-bordered input-sm"
            value={newBank.IFSCCode}
            onChange={(e) =>
              setNewBank({ ...newBank, IFSCCode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Bank & Branch Name"
            className="input input-bordered input-sm"
            value={newBank.bankAndBranchName}
            onChange={(e) =>
              setNewBank({ ...newBank, bankAndBranchName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="UPI Id (optional)"
            className="input input-bordered input-sm"
            value={newBank.upiId}
            onChange={(e) => setNewBank({ ...newBank, upiId: e.target.value })}
          />
          <button
            onClick={handleAddBank}
            className="btn btn-sm rounded-xl btn-dash"
          >
            Add
          </button>
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm rounded-xl">Cancel</button>
          </form>
          <button
            className="btn btn-sm bg-[var(--primary-btn)] rounded-xl"
            onClick={() => mutation.mutate()}
          >
            Save Changes
          </button>
        </div>
      </div>
    </dialog>
  );
};
export default BankAccountsModal;
