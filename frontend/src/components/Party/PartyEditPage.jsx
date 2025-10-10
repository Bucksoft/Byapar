import {
  ArrowLeft,
  IndianRupee,
  Landmark,
  Settings,
  Trash,
} from "lucide-react";
import { statesAndCities } from "../../utils/constants";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import CustomLoader from "../../components/Loader";
import { usePartyStore } from "../../store/partyStore";
import { queryClient } from "../../main";
import BankAccountPopup from "../BankAccountPopup";
import { useBusinessStore } from "../../store/businessStore";

const PartyEditPage = () => {
  const navigate = useNavigate();
  const [party, setParty] = useState();
  const { business } = useBusinessStore();
  const { id } = useParams();
  const [sameAsBillingAddress, setSameAsBillingAddress] = useState(false);
  const { parties } = usePartyStore();
  const [addCategoryPopup, setAddCategoryPopup] = useState(false);
  const [cities, setCities] = useState([]);
  const [isAddedBankInfo, setIsAddedBankInfo] = useState(false);

  // FETCH THE BANK DETAILS OF THE PARTY AS WELL
  const { data: partyBankAccount } = useQuery({
    queryKey: ["bank-accounts", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/bank-account/party/${id}`);
      return res.data;
    },
  });

  const [data, setData] = useState({
    partyName: party?.partyName,
    mobileNumber: party?.mobileNumber,
    email: party?.email,
    openingBalance: party?.openingBalance,
    openingBalanceStatus: party?.openingBalanceStatus,
    GSTIN: party?.GSTIN,
    PANno: party?.PANno,
    partyType: party?.partyType,
    categoryName: party?.categoryName,
    state: party?.state,
    city: party?.city,
    billingAddress: party?.billingAddress,
    shippingAddress: party?.shippingAddress,
    creditPeriod: party?.creditPeriod,
    creditLimit: party?.creditLimit,
    pincode: party?.pincode,
    bankAccountNumber: "",
    IFSCCode: "",
    accountHoldersName: "",
    bankAndBranchName: "",
    upiId: "",
  });

  useEffect(() => {
    if (party) {
      setData({
        partyName: party.partyName || "",
        mobileNumber: party.mobileNumber || "",
        email: party.email || "",
        openingBalance: party.openingBalance || "",
        openingBalanceStatus: party.openingBalanceStatus || "",
        GSTIN: party.GSTIN || "",
        PANno: party.PANno || "",
        partyType: party.partyType || "",
        categoryName: party.categoryName || "",
        state: party.state || "",
        city: party.city || "",
        billingAddress: party.billingAddress || "",
        shippingAddress: party.shippingAddress || "",
        creditPeriod: party.creditPeriod || "",
        creditLimit: party.creditLimit || "",
        pincode: party.pincode || "",
        bankAccountNumber: partyBankAccount?.bankAccountNumber || "",
        IFSCCode: partyBankAccount?.IFSCCode || "",
        accountHoldersName: partyBankAccount?.accountHoldersName || "",
        bankAndBranchName: partyBankAccount?.bankAndBranchName || "",
        upiId: partyBankAccount?.upiId || "",
      });
    }
  }, [party, partyBankAccount]);

  // Filtering the selected party to be edited from all the parties
  useEffect(() => {
    const party = parties?.find((party) => party?._id === id);
    setParty(party);
  }, [parties, id]);

  // handling the input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      const stateInfo = statesAndCities.find((s) => s.state === value);
      setCities(stateInfo ? stateInfo.cities : []);
    }

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handling actual form submission
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.patch(
        `/parties/${party?._id}?businessId=${business?._id}`,
        data
      );
    },
    onSuccess: () => {
      toast.success("Party updated");
      navigate("/dashboard/parties");
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
    onError: (err) => {
      toast.error(err.response.data.msg || err.response.data.err);
    },
  });

  // bank account delete
  const deleteBankAccount = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/bank-account/party/${id}`);
    },
    onSuccess: () => {
      toast.success("Bank Account deleted");
      document.getElementById("delete-account-modal").close();
      queryClient.invalidateQueries({
        queryKey: ["bank-accounts", id, party, "parties"],
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (err) => {
      toast.error(err.response.data.msg || err.response.data.err);
    },
  });

  return (
    <main className="h-screen overflow-y-scroll w-full relative">
      {/* navigation */}
      <header className="flex items-center justify-between p-3 bg-white">
        <h1 className="flex items-center gap-2">
          <ArrowLeft size={20} onClick={() => navigate(-1)} />
          Edit Party
        </h1>
        <div className="space-x-3">
          <button className="btn btn-sm">
            Party Settings <Settings size="16" />{" "}
          </button>
          <button
            className={`btn btn-sm bg-[var(--primary-btn)] ${
              mutation.isPending && ""
            } `}
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(data)}
          >
            {mutation.isPending ? (
              <CustomLoader text={"Saving..."} />
            ) : (
              <>Save Changes</>
            )}
          </button>
        </div>
      </header>

      <h3 className="p-3 text-sm text-zinc-500">General Settings</h3>

      {/* Main content */}
      <section className="p-3 bg-white">
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label htmlFor="party_name" className="text-xs text-zinc-700">
              Party Name
            </label>
            <input
              type="text"
              id="party_name"
              name="partyName"
              className="input input-sm"
              placeholder="Enter party name"
              //   disabled={mutation.isPending}
              value={data.partyName}
              onChange={handleInputChange}
            />
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.partyName
                  ?._errors[0]
              }
            </small>
          </div>
          <div>
            <label htmlFor="mobile_number" className="text-xs text-zinc-700">
              Mobile number
            </label>
            <input
              type="number"
              id="mobile_number"
              name="mobileNumber"
              className="input input-sm"
              disabled={mutation.isPending}
              value={data.mobileNumber}
              onChange={handleInputChange}
              placeholder="Enter mobile number"
            />
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.mobileNumber
                  ?._errors[0]
              }
            </small>
          </div>
          <div>
            <label htmlFor="email" className="text-xs text-zinc-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              disabled={mutation.isPending}
              onChange={handleInputChange}
              className="input input-sm"
              placeholder="Enter email"
            />
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.email
                  ?._errors[0]
              }
            </small>
          </div>
          <div>
            <label htmlFor="opening_balance" className="text-xs text-zinc-700">
              Opening Balance
            </label>
            <div className="flex items-center relative">
              <IndianRupee className="absolute z-10 left-2" size={11} />
              <input
                type="number"
                id="opening_balance"
                name="openingBalance"
                className="input input-sm px-6"
                placeholder="0"
                disabled={mutation.isPending}
                value={data.openingBalance}
                onChange={(e) =>
                  setData({
                    ...data,
                    openingBalance: parseInt(e.target.value),
                  })
                }
              />

              <select
                name="openingBalanceStatus"
                disabled={mutation.isPending}
                value={data.openingBalanceStatus}
                onChange={handleInputChange}
                className="select select-sm"
              >
                <option>To Collect</option>
                <option>To Pay</option>
              </select>
            </div>
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.openingBalance
                  ?._errors[0]
              }
            </small>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-2 ">
          <div>
            <label htmlFor="GST_in" className="text-xs text-zinc-700">
              GSTIN
            </label>
            <input
              type="text"
              id="GST_in"
              name="GSTIN"
              disabled={mutation.isPending}
              value={data.GSTIN}
              onChange={handleInputChange}
              className="input input-sm"
              placeholder="Enter GSTIN"
            />
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.GSTIN
                  ?._errors[0]
              }
            </small>
          </div>

          <div>
            <label htmlFor="PAN_number" className="text-xs text-zinc-700">
              PAN Number
            </label>
            <input
              type="text"
              id="PAN_number"
              name="PANno"
              disabled={mutation.isPending}
              value={data.PANno}
              onChange={handleInputChange}
              className="input input-sm"
              placeholder="Enter party PAN number"
            />
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.PANno
                  ?._errors[0]
              }
            </small>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-2 ">
          <div>
            <label htmlFor="Party_type" className="text-xs text-zinc-700">
              Party type
            </label>
            <select
              name="partyType"
              disabled={mutation.isPending}
              value={data.partyType}
              onChange={handleInputChange}
              className="select select-sm "
            >
              <option>Customer</option>
              <option>Supplier</option>
            </select>
          </div>

          <div className="flex flex-col mt-1">
            <label htmlFor="Party_category" className="text-xs text-zinc-700 ">
              Party Category
            </label>

            <details className="dropdown mt-1">
              <summary className="select select-sm">Party Category</summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box  w-52 p-2 shadow-sm">
                <button
                  onClick={() => setAddCategoryPopup(true)}
                  className="btn btn-sm btn-dash btn-info mt-2"
                >
                  Add Category
                </button>
              </ul>
            </details>
            <small className="text-xs text-[var(--error-text-color)] mt-1 ">
              {
                mutation.error?.response?.data?.validationError?.categoryName
                  ?._errors[0]
              }
            </small>
          </div>

          <div>
            <label htmlFor="State" className="text-xs text-zinc-700">
              State
            </label>
            <div>
              <select
                name="state"
                value={data.state}
                disabled={mutation.isPending}
                onChange={handleInputChange}
                className="select select-sm"
              >
                <option value="" disabled>
                  --Select State--
                </option>
                {statesAndCities?.map((s, index) => (
                  <option key={index} value={s.state}>
                    {s.state}
                  </option>
                ))}
              </select>
            </div>
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.state
                  ?._errors[0]
              }
            </small>
          </div>

          <div>
            <label htmlFor="City" className="text-xs text-zinc-700">
              City
            </label>
            <div>
              <select
                name="city"
                disabled={!cities.length || mutation.isPending}
                value={data.city}
                onChange={handleInputChange}
                className="select select-sm"
              >
                <option value="" disabled>
                  --Select city--
                </option>
                {cities?.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <small className="text-xs text-[var(--error-text-color)] ">
              {
                mutation.error?.response?.data?.validationError?.city
                  ?._errors[0]
              }
            </small>
          </div>
          <div>
            <label htmlFor="pincode" className="text-xs text-zinc-700">
              Pincode
            </label>
            <div>
              <input
                type="text"
                id="Pincode"
                name="pincode"
                disabled={mutation.isPending}
                value={data.pincode}
                onChange={handleInputChange}
                className="input input-sm"
                placeholder="Enter Pincode"
              />
              <small className="text-xs text-[var(--error-text-color)]">
                {
                  mutation.error?.response?.data?.validationError?.pincode
                    ?._errors[0]
                }
              </small>
            </div>
          </div>
        </div>
      </section>

      <h3 className="p-3 text-sm text-zinc-500">Address</h3>

      <section className="grid grid-cols-2 gap-5 p-3 bg-white">
        <div className="flex flex-col gap-2">
          <label htmlFor="Billing_address" className="text-xs text-zinc-700">
            Billing Address
          </label>
          <textarea
            name="billingAddress"
            disabled={mutation.isPending}
            value={data.billingAddress}
            onChange={handleInputChange}
            className="textarea w-full"
            placeholder="Enter billing address"
          ></textarea>
          <small className="text-xs text-[var(--error-text-color)] ">
            {
              mutation.error?.response?.data?.validationError?.billingAddress
                ?._errors[0]
            }
          </small>
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="Billing_address"
            className="text-xs text-zinc-700 flex items-center justify-between"
          >
            Shipping Address
            <div>
              <input
                checked={sameAsBillingAddress}
                onChange={(e) => {
                  setSameAsBillingAddress(e.target.checked);
                  if (e.target.checked) {
                    setData((prev) => ({
                      ...prev,
                      shippingAddress: prev.billingAddress,
                    }));
                  } else {
                    setData((prev) => ({
                      ...prev,
                      shippingAddress: "",
                    }));
                  }
                }}
                type="checkbox"
                className="checkbox checkbox-sm mr-1 checkbox-info"
              />
              Same as Billing address
            </div>
          </label>
          <textarea
            name="shippingAddress"
            disabled={mutation.isPending}
            value={data.shippingAddress}
            onChange={handleInputChange}
            className="textarea w-full bg-zinc-300"
            placeholder="Enter Shipping Address"
          ></textarea>
          <small className="text-xs text-[var(--error-text-color)] ">
            {
              mutation.error?.response?.data?.validationError?.shippingAddress
                ?._errors[0]
            }
          </small>
        </div>
      </section>

      <section className="grid grid-cols-4 gap-5 p-3 bg-white">
        <div className="flex flex-col gap-2">
          <label htmlFor="Credit_period" className="text-xs text-zinc-700">
            Credit Period
          </label>
          <input
            type="number"
            id="Credit_period"
            name="creditPeriod"
            disabled={mutation.isPending}
            className="input input-sm"
            value={data.creditPeriod}
            onChange={(e) =>
              setData({
                ...data,
                creditPeriod: parseInt(e.target.value) || 0,
              })
            }
            placeholder="30 (in days)"
          />
          <small className="text-xs text-[var(--error-text-color)] ">
            {
              mutation.error?.response?.data?.validationError?.creditPeriod
                ?._errors[0]
            }
          </small>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="Billing_address" className="text-xs text-zinc-700">
            Credit Limit
          </label>
          <div className="flex items-center relative">
            <IndianRupee className="absolute z-10 left-2" size={11} />
            <input
              type="number"
              id="credit_limit"
              name="creditLimit"
              disabled={mutation.isPending}
              value={data.creditLimit}
              onChange={(e) =>
                setData({
                  ...data,
                  creditLimit: parseInt(e.target.value) || 0,
                })
              }
              className="input input-sm px-6"
              placeholder="0"
            />
          </div>
          <small className="text-xs text-[var(--error-text-color)] ">
            {
              mutation.error?.response?.data?.validationError?.creditLimit
                ?._errors[0]
            }
          </small>
        </div>
      </section>

      <h3 className="p-3 text-sm text-zinc-500">Party Bank Account</h3>

      {partyBankAccount || isAddedBankInfo ? (
        <>
          <div className="flex gap-2 items-center justify-center pt-4 pb-16 px-5">
            <div>
              <label className="label text-xs">Account Holder's Name</label>
              <input
                className="input input-sm"
                type="text"
                name="accountHoldersName"
                onChange={handleInputChange}
                value={data?.accountHoldersName}
              />
            </div>
            <div>
              <label className="label text-xs">Bank Account Number</label>
              <input
                className="input input-sm"
                type="text"
                onChange={handleInputChange}
                name="bankAccountNumber"
                value={data?.bankAccountNumber}
              />
            </div>
            <div>
              <label className="label text-xs">IFSC Code</label>
              <input
                className="input input-sm"
                type="text"
                name="IFSCCode"
                onChange={handleInputChange}
                value={data?.IFSCCode}
              />
            </div>
            <div>
              <label className="label text-xs">Bank & Branch Name</label>
              <input
                className="input input-sm"
                type="text"
                name="bankAndBranchName"
                onChange={handleInputChange}
                value={data?.bankAndBranchName}
              />
            </div>
            <div>
              <label className="label text-xs">UPI Id</label>
              <input
                className="input input-sm"
                type="text"
                name="upiId"
                onChange={handleInputChange}
                value={data?.upiId}
              />
            </div>
            <button
              onClick={() => {
                // setBankAccountToDeleteid(partyBankAccount._id);
                document.getElementById("delete-account-modal").showModal();
              }}
              className="btn btn-xs btn-error mt-6"
            >
              <Trash size={12} />
            </button>
            <dialog id="delete-account-modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Confirm Delete</h3>
                <p className="py-4">
                  Are you sure you want to delete this account ?
                </p>
                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm">Close</button>
                  </form>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() =>
                      deleteBankAccount.mutate(partyBankAccount._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </dialog>
          </div>
        </>
      ) : (
        <>
          <section className="flex flex-col py-16 items-center justify-center bg-white gap-4 text-xs">
            <Landmark size={30} />
            <p>Add party bank information to manage transactions</p>
            <BankAccountPopup
              partyName={data?.partyName}
              setData={setData}
              data={data}
              handleInputChange={handleInputChange}
              mutation={mutation}
              setIsAddedBankInfo={setIsAddedBankInfo}
              id={id}
              isEdit={true}
            />
          </section>
        </>
      )}

      {addCategoryPopup && (
        <>
          <div className="h-full z-2000 w-full bg-black/20 backdrop-blur flex items-center justify-center absolute top-0">
            <div className="w-3/8 p-4 shadow-lg rounded-lg bg-white">
              <h1 className="font-medium">Add a Category</h1>
              <input
                type="text"
                name="categoryName"
                disabled={mutation.isPending}
                value={data.categoryName}
                onChange={handleInputChange}
                placeholder="Enter category name"
                className="input input-sm mt-5 w-full"
              />
              <div className="w-full flex items-center justify-end gap-3">
                <button
                  className="btn btn-sm mt-3"
                  onClick={() => setAddCategoryPopup(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (data.categoryName) {
                      setAddCategoryPopup(false);
                    }
                  }}
                  className="btn btn-sm mt-3 bg-[var(--secondary-btn)]"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default PartyEditPage;
