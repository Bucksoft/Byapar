import { ArrowLeft, IndianRupee, Landmark, Settings } from "lucide-react";
import { statesAndCities } from "../utils/constants";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../components/Loader";
import { usePartyStore } from "../store/partyStore";
import { queryClient } from "../main";
import { motion } from "framer-motion";
import { useBusinessStore } from "../store/businessStore";
import BankAccountPopup from "../components/BankAccountPopup";

const DashboardAddPartyPage = () => {
  const navigate = useNavigate();
  const [isAddedBankInfo, setIsAddedBankInfo] = useState(false);
  const { setParty } = usePartyStore();
  const [addCategoryPopup, setAddCategoryPopup] = useState(false);
  const { business } = useBusinessStore();
  const [cities, setCities] = useState([]);
  const [data, setData] = useState({
    partyName: "",
    mobileNumber: "",
    email: "",
    openingBalance: 0,
    openingBalanceStatus: "To Collect",
    GSTIN: "",
    PANno: "",
    partyType: "Customer",
    categoryName: "",
    state: "",
    city: "",
    billingAddress: "",
    shippingAddress: "",
    creditPeriod: 0,
    creditLimit: 0,
    pincode: "",
    businessId: business?._id,
    bankAccountNumber: "",
    IFSCCode: "",
    accountHoldersName: "",
    bankAndBranchName: "",
    upiId: "",
  });

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
      const res = await axiosInstance.post("/parties", data);
      return res.data.party;
    },
    onSuccess: (data) => {
      toast.success("Party created");
      setParty(data);
      navigate("/dashboard/parties");
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
    onError: (err) => {
      toast.error(err.response.data.msg || err.response.data.err);
    },
  });

  return (
    <>
      <main className="h-screen overflow-y-scroll w-full relative">
        {/* navigation */}
        <header className="flex items-center justify-between p-3 bg-white">
          <h1 className="flex items-center gap-2">
            <ArrowLeft size={20} onClick={() => navigate(-1)} />
            Create Party
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
                <>Save</>
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
                disabled={mutation.isPending}
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
              <label
                htmlFor="opening_balance"
                className="text-xs text-zinc-700"
              >
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
                  mutation.error?.response?.data?.validationError
                    ?.openingBalance?._errors[0]
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
            <button className="btn btn-sm mt-6 bg-[var(--secondary-btn)]">
              Get Details
            </button>
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
          <p className="text-xs text-zinc-500 mt-5">
            Note: You can auto populate party detauls from GSTIN
          </p>

          <div className="divider" />

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
              <label
                htmlFor="Party_category"
                className="text-xs text-zinc-700 "
              >
                Party Category
              </label>

              <details className="dropdown mt-1 z-10">
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
          <div className="flex flex-col gap-2">
            <label htmlFor="Billing_address" className="text-xs text-zinc-700">
              Shipping Address
            </label>
            <textarea
              name="shippingAddress"
              disabled={mutation.isPending}
              value={data.shippingAddress}
              onChange={handleInputChange}
              className="textarea w-full bg-zinc-300"
              placeholder="Enter shipping address"
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

        {isAddedBankInfo ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-5">
            <section className="w-full grid grid-cols-5 gap-5">
              <div className=" flex flex-col border rounded-lg border-[var(--gray-text)]/20 p-2 shadow-md  bg-white">
                <p className="font-medium text-sm">Account Holder's Name</p>
                <span className="text-[var(--gray-text)]">
                  {data?.accountHoldersName}
                </span>
                <small className="text-[var(--error-text-color)]">
                  {
                    mutation?.error?.response?.data?.validationError
                      ?.accountHoldersName?._errors[0]
                  }
                </small>
              </div>

              <div className="flex flex-col border rounded-lg border-[var(--gray-text)]/20 p-2 shadow-md bg-white">
                <p className="font-medium text-sm">Bank Account Number</p>
                <span className="text-[var(--gray-text)]">
                  {data?.bankAccountNumber}
                </span>
                <small className="text-[var(--error-text-color)]">
                  {
                    mutation?.error?.response?.data?.validationError
                      ?.bankAccountNumber?._errors[0]
                  }
                </small>
              </div>

              <div className="flex flex-col  border rounded-lg border-[var(--gray-text)]/20 p-2 shadow-md bg-white">
                <p className="font-medium text-sm">IFSC Code</p>
                <span className="text-[var(--gray-text)]">
                  {data?.IFSCCode}
                </span>
                <small className="text-[var(--error-text-color)]">
                  {
                    mutation?.error?.response?.data?.validationError?.IFSCCode
                      ?._errors[0]
                  }
                </small>
              </div>

              <div className="flex flex-col border rounded-lg border-[var(--gray-text)]/20 p-2 shadow-md bg-white">
                <p className="font-medium text-sm">Bank & Branch Name</p>
                <span className="text-[var(--gray-text)]">
                  {data?.accountHoldersName}
                </span>
                <small className="text-[var(--error-text-color)]">
                  {
                    mutation?.error?.response?.data?.validationError
                      ?.accountHoldersName?._errors[0]
                  }
                </small>
              </div>

              <div className="flex flex-col border rounded-lg border-[var(--gray-text)]/20 p-2 shadow-md bg-white">
                <p className="font-medium text-sm">UPI Id</p>
                <span className="text-[var(--gray-text)]">{data?.upiId}</span>
                <small className="text-[var(--error-text-color)]">
                  {
                    mutation?.error?.response?.data?.validationError?.upiId
                      ?._errors[0]
                  }
                </small>
              </div>
            </section>
            <BankAccountPopup
              partyName={data?.partyName}
              setData={setData}
              data={data}
              handleInputChange={handleInputChange}
              setIsAddedBankInfo={setIsAddedBankInfo}
              mutation={mutation}
            />
          </div>
        ) : (
          <section className="flex flex-col py-16 items-center justify-center bg-white gap-4 text-xs">
            <Landmark size={30} />
            <p>Add party bank information to manage transactions</p>
            {/* Bank Account Popup */}
            <BankAccountPopup
              partyName={data?.partyName}
              setData={setData}
              data={data}
              handleInputChange={handleInputChange}
              setIsAddedBankInfo={setIsAddedBankInfo}
            />
          </section>
        )}

        {addCategoryPopup && (
          <>
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              {/* Modal Box with Animation */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white shadow-2xl rounded-2xl p-6 w-[400px] max-w-[90%]"
              >
                {/* Header */}
                <h1 className="text-lg font-semibold text-gray-800">
                  Add Category
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Create a new category for your items
                </p>

                {/* Input */}
                <input
                  type="text"
                  className="input input-sm mt-4 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Ex: Electronics"
                  disabled={mutation.isPending}
                  value={data.categoryName}
                  name="categoryName"
                  onChange={handleInputChange}
                />

                {/* Footer Actions */}
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    className="btn btn-sm"
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
                    className="btn btn-sm bg-[var(--secondary-btn)]"
                  >
                    Add
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default DashboardAddPartyPage;
