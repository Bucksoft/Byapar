import { ArrowLeft, IndianRupee, Landmark, Settings } from "lucide-react";
import { statesAndCities } from "../utils/constants";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";

const DashboardAddPartyPage = () => {
  const [selectedState, setSelectedState] = useState("");
  const [addCategoryPopup, setAddCategoryPopup] = useState(false);
  const [cities, setCities] = useState([]);
  const [data, setData] = useState({
    partyName: "",
    mobileNumber: "",
    email: "",
    openingBalance: "",
    openingBalanceType: "to_collect",
    GSTIN: "",
    PANno: "",
    partyType: "",
    categoryName: "",
    state: "",
    city: "",
    billingAddress: "",
    shippingAddress: "",
    creditPeriod: "",
    creditLimit: "",
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
      await axiosInstance.post("/parties", data);
    },
    onSuccess: () => {
      toast.success("Party created");
    },
  });

  return (
    <>
      <main className="h-screen overflow-y-scroll w-full relative">
        {/* navigation */}
        <header className="flex items-center justify-between p-3 bg-white">
          <h1 className="flex items-center gap-2">
            <ArrowLeft size={20} />
            Create Party
          </h1>
          <div className="space-x-3">
            <button className="btn btn-sm">
              Party Settings <Settings size="16" />{" "}
            </button>
            <button
              className="btn btn-sm bg-[var(--primary-btn)]"
              onClick={() => mutation.mutate(data)}
            >
              Save
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
                value={data.partyName}
                onChange={handleInputChange}
              />
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
                value={data.mobileNumber}
                onChange={handleInputChange}
                placeholder="Enter mobile number"
              />
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
                onChange={handleInputChange}
                className="input input-sm"
                placeholder="Enter email"
              />
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
                  value={data.openingBalance}
                  onChange={handleInputChange}
                />
                <select
                  name="openingBalanceType"
                  value={data.openingBalanceType}
                  onChange={handleInputChange}
                  className="select select-sm "
                >
                  <option>To Collect</option>
                  <option>To Pay</option>
                </select>
              </div>
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
                value={data.GSTIN}
                onChange={handleInputChange}
                className="input input-sm"
                placeholder="Enter GSTIN"
              />
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
                value={data.PANno}
                onChange={handleInputChange}
                className="input input-sm"
                placeholder="Enter party PAN number"
              />
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
              <details className="dropdown mt-1">
                <summary className="select select-sm">Party Category</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                  <button
                    onClick={() => setAddCategoryPopup(true)}
                    className="btn btn-sm btn-dash btn-info mt-2"
                  >
                    Add Category
                  </button>
                </ul>
              </details>
            </div>

            <div>
              <label htmlFor="State" className="text-xs text-zinc-700">
                State
              </label>
              <div>
                <select
                  name="state"
                  value={data.state}
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
            </div>

            <div>
              <label htmlFor="City" className="text-xs text-zinc-700">
                City
              </label>
              <div>
                <select
                  name="city"
                  disabled={!cities.length}
                  value={data.city}
                  onChange={handleInputChange}
                  className="select select-sm "
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
            </div>
            <div>
              <label htmlFor="pincode" className="text-xs text-zinc-700">
                Pincode
              </label>
              <div>
                <input
                  type="text"
                  id="PAN_number"
                  name="PANno"
                  value={data.PANno}
                  onChange={handleInputChange}
                  className="input input-sm"
                  placeholder="Enter party PAN number"
                />
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
              value={data.billingAddress}
              onChange={handleInputChange}
              className="textarea w-full"
              placeholder="Enter billing address"
            ></textarea>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="Billing_address" className="text-xs text-zinc-700">
              Shipping Address
            </label>
            <textarea
              name="shippingAddress"
              value={data.shippingAddress}
              onChange={handleInputChange}
              className="textarea w-full bg-zinc-300"
              placeholder="Enter shipping address"
            ></textarea>
          </div>
        </section>

        <section className="grid grid-cols-4 gap-5 p-3 bg-white">
          <div className="flex flex-col gap-2">
            <label htmlFor="Credit_period" className="text-xs text-zinc-700">
              Credit Period
            </label>
            <input
              type="text"
              id="Credit_period"
              name="creditPeriod"
              className="input input-sm"
              value={data.creditPeriod}
              onChange={handleInputChange}
              placeholder="30 (in days)"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="Billing_address" className="text-xs text-zinc-700">
              Credit Limit
            </label>
            <div className="flex items-center relative">
              <IndianRupee className="absolute z-10 left-2" size={11} />
              <input
                type="text"
                id="credit_limit"
                name="creditLimit"
                value={data.creditLimit}
                onChange={handleInputChange}
                className="input input-sm px-6"
                placeholder="0"
              />
            </div>
          </div>
        </section>

        <h3 className="p-3 text-sm text-zinc-500">Party Bank Account</h3>

        <section className="flex flex-col py-16 items-center justify-center bg-white gap-4 text-xs">
          <Landmark size={30} />
          <p>Add party bank information to manage transactions</p>
          <button className="btn btn-ghost text-[var(--primary-btn)] ">
            + Add Bank Account
          </button>
        </section>
        {addCategoryPopup && (
          <>
            <div className="h-full z-2000 w-full bg-black/20 backdrop-blur flex items-center justify-center absolute top-0">
              <div className="w-3/8 p-4 shadow-lg rounded-lg bg-white">
                <h1 className="font-medium">Add a Category</h1>
                <input
                  type="text"
                  name="categoryName"
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
    </>
  );
};

export default DashboardAddPartyPage;
