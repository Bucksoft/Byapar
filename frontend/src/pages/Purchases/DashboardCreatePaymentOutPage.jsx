import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePartyStore } from "../../store/partyStore";
import { useEffect, useState } from "react";
import { useInvoiceStore } from "../../store/invoicesStore";
import { LiaRupeeSignSolid } from "react-icons/lia";

const DashboardCreatePaymentOutPage = () => {
  const navigate = useNavigate();
  const { parties } = usePartyStore();
  const { invoices } = useInvoiceStore();
  const [selectedParty, setSelectedParty] = useState();
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);

  useEffect(() => {
    if (!parties || !invoices) return;
    const allInvoices = invoices.filter(
      (invoice) => invoice.partyId?.partyName === selectedParty
    );
    console.log(allInvoices);
    const totalAmount = allInvoices.reduce(
      (acc, item) => item?.totalAmount + acc,
      0
    );
    setTotalInvoiceAmount(totalAmount);
  }, [selectedParty]);

  return (
    <main className="h-full w-full p-2">
      <section className="h-full w-full bg-white rounded-lg">
        {/* Header */}
        <header className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <ArrowLeft onClick={() => navigate(-1)} />
            Payment Out
          </div>
          <div>
            <button className="btn btn-soft btn-sm mr-2">Cancel</button>
            <button className="btn btn-sm bg-[var(--primary-btn)]">Save</button>
          </div>
        </header>

        {/* form */}
        <section className="grid grid-cols-2 py-2 px-4 gap-2">
          {/* left div */}
          <div className="p-4  text-sm border border-[var(--primary-background)] rounded-lg">
            <label className="text-zinc-500">Party Name</label>
            <br />
            <select
              className="select select-sm w-full mt-2 mb-5"
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value)}
            >
              <option className="hidden">testing-party</option>
              {parties.map((party) => (
                <>
                  <option value={party?.partyName} key={party?._id}>
                    {party?.partyName}
                  </option>
                </>
              ))}
            </select>
            {selectedParty && (
              <p className="flex items-center mb-1 text-green-500 text-xs">
                Current Balance :
                <LiaRupeeSignSolid />{" "}
                {Number(totalInvoiceAmount).toLocaleString("en-IN")}
              </p>
            )}

            <label className="text-zinc-500 ">Party Amount</label>
            <br />
            <input
              type="number"
              placeholder="0"
              className="input input-sm w-full mt-2"
            />
          </div>

          {/* right div */}
          <div className="p-4  text-sm border border-[var(--primary-background)] rounded-lg">
            <div className="flex items-center justify-center gap-3 ">
              <div className="flex flex-col w-full">
                <label className="text-zinc-500">Payment Date</label>
                <input type="date" className="input input-sm mt-2 " />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-zinc-500">Payment Mode</label>
                <select className="select select-sm mt-2">
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Netbanking">Netbanking</option>
                  <option value="Bank transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label className="text-zinc-500">Payment Out Number</label>
                <input
                  type="text"
                  className="input input-sm mt-2"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="flex flex-col mt-5">
              <label className="text-zinc-500">Notes</label>
              <textarea
                className="textarea mt-3 w-full"
                placeholder="Enter notes"
              />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default DashboardCreatePaymentOutPage;
