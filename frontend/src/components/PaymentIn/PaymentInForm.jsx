import { ArrowLeft } from "lucide-react";
import "cally";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { usePartyStore } from "../../store/partyStore";

const PaymentInForm = () => {
  const { parties } = usePartyStore();
  const [date, setDate] = useState();
  const [data, setData] = useState({
    partyName: "",
    paymentAmount: 0,
    paymentDate: "",
    paymentMode: "",
    paymentReceivedIn: "",
    paymentInNumber: 1,
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(data);
  };

  return (
    <main className="bg-white h-full rounded-lg">
      <header className="flex items-center justify-between p-3">
        <h1 className="flex items-center gap-3 font-medium">
          <ArrowLeft />
          Record Payment In
        </h1>
        <button
          onClick={handleSubmit}
          className="bg-[var(--primary-btn)] text-[var(--primary-text-color)] btn btn-sm"
        >
          Save
        </button>
      </header>

      <section className="grid grid-cols-2 gap-4 p-5 ">
        <div className="border border-zinc-200 shadow-lg p-4 py-6 rounded-lg flex flex-col">
          <label htmlFor="party_name" className="text-sm text-zinc-500">
            Party Name
          </label>
          <select
            name="partyName"
            value={data.partyName}
            onChange={handleInputChange}
            className="select select-sm mt-1 w-full"
          >
            <option value="">Select Party</option>
            {parties.map((party) => (
              <option key={party?._id} value={party?.partyName}>
                {party?.partyName}
              </option>
            ))}
          </select>

          <label htmlFor="party_name" className="text-sm text-zinc-500 mt-5">
            Enter Payment Amount
          </label>
          <input
            value={data.paymentAmount}
            name="paymentAmount"
            onChange={handleInputChange}
            type="number"
            className="input input-sm w-full mt-1"
            placeholder="0"
          />
        </div>

        <div className="border border-zinc-200 shadow-lg p-4 py-6 rounded-lg text-sm">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-zinc-500">Payment Date</label>
              <button
                popoverTarget="rdp-popover"
                className="input input-border input-sm mt-1"
                style={{ anchorName: "--rdp" }}
              >
                {date ? date.toLocaleDateString() : "Pick a date"}
              </button>
              <div
                popover="auto"
                id="rdp-popover"
                className="dropdown"
                style={{ positionAnchor: "--rdp" }}
              >
                <DayPicker
                  className="react-day-picker"
                  mode="single"
                  selected={
                    data.paymentDate ? new Date(data.paymentDate) : undefined
                  }
                  onSelect={(selectedDate) => {
                    console.log(selectedDate);
                    setData((prev) => ({
                      ...prev,
                      paymentDate: selectedDate
                        ? selectedDate.toISOString().split("T")[0]
                        : "",
                    }));
                  }}
                />
              </div>
            </div>
            <div>
              <label className="text-zinc-500">Payment Mode</label>
              <select
                name="paymentMode"
                value={data.paymentMode}
                onChange={handleInputChange}
                className="select select-sm mt-1"
              >
                <option value="">Select Mode</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Netbanking">Netbanking</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-500">Payment Received In</label>
              <select
                name="paymentReceivedIn"
                value={data.paymentReceivedIn}
                onChange={handleInputChange}
                className="select select-sm mt-1"
              >
                <option value="">Select Account</option>
                <option value="Bank account">Bank account</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-500">Payment In Number</label>
              <input
                name="paymentInNumber"
                value={data.paymentInNumber}
                onChange={handleInputChange}
                type="number"
                className="input input-sm mt-1"
                placeholder="1"
              />
            </div>
          </div>
          <div className="mt-5 flex flex-col">
            <label className="text-zinc-500" htmlFor="notes">
              Notes
            </label>
            <textarea
              value={data.notes}
              onChange={handleInputChange}
              name="notes"
              id="notes"
              className="textarea w-full mt-1"
              placeholder="Add some notes"
            />
          </div>
        </div>
      </section>

      <section className="p-5 w-full grid place-items-center">
        No transactions yet!
      </section>
    </main>
  );
};

export default PaymentInForm;
