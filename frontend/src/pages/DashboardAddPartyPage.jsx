import { ArrowLeft, IndianRupee, Landmark, Settings } from "lucide-react";
import { statesAndCities } from "../utils/constants";
import { useState } from "react";

const DashboardAddPartyPage = () => {
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    const stateInfo = statesAndCities.find((s) => s.state === stateName);
    setCities(stateInfo ? stateInfo.cities : []);
  };

  return (
    <main className="h-screen overflow-y-scroll  w-full ">
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
          <button className="btn btn-sm bg-[var(--primary-btn)]">Save</button>
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
              className="input input-sm"
              placeholder="Enter party name"
            />
          </div>
          <div>
            <label htmlFor="mobile_number" className="text-xs text-zinc-700">
              Mobile number
            </label>
            <input
              type="text"
              id="mobile_number"
              className="input input-sm"
              placeholder="Enter mobile number"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-xs text-zinc-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="input input-sm"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label htmlFor="opening_balance" className="text-xs text-zinc-700">
              Opening Balance
            </label>
            <div className="flex items-center relative">
              <IndianRupee className="absolute z-10 left-2" size={11} />
              <input
                type="text"
                id="opening_balance"
                className="input input-sm px-6"
                placeholder="0"
              />
              <select defaultValue="Pick a color" className="select select-sm ">
                <option>To Collect</option>
                <option>To Pay</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-2">
          <div>
            <label htmlFor="GST_in" className="text-xs text-zinc-700">
              GSTIN
            </label>
            <input
              type="text"
              id="GST_in"
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
              className="input input-sm"
              placeholder="Enter party PAN number"
            />
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-5">
          Note: You can auto populate party detauls from GSTIN
        </p>

        <div className="divider" />

        <div className="grid grid-cols-4 gap-3 mt-2">
          <div>
            <label htmlFor="Party_type" className="text-xs text-zinc-700">
              Party type
            </label>
            <select defaultValue="Pick a color" className="select select-sm ">
              <option>Customer</option>
              <option>Supplier</option>
            </select>
          </div>

          <div>
            <label htmlFor="Party_category" className="text-xs text-zinc-700">
              Party Category
            </label>
            <div>
              <select defaultValue="Pick a color" className="select select-sm ">
                <option>Customer</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="State" className="text-xs text-zinc-700">
              State
            </label>
            <div>
              <select
                value={selectedState}
                onChange={handleStateChange}
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
              <select disabled={!cities.length} className="select select-sm ">
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
        </div>
      </section>

      <h3 className="p-3 text-sm text-zinc-500">Address</h3>

      <section className="grid grid-cols-2 gap-5 p-3 bg-white">
        <div className="flex flex-col gap-2">
          <label htmlFor="Billing_address" className="text-xs text-zinc-700">
            Billing Address
          </label>
          <textarea
            className="textarea w-full"
            placeholder="Enter billing address"
          ></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="Billing_address" className="text-xs text-zinc-700">
            Shipping Address
          </label>
          <textarea
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
            className="input input-sm"
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
              id="opening_balance"
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
    </main>
  );
};

export default DashboardAddPartyPage;
