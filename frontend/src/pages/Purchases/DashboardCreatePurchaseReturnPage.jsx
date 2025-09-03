import { useLocation } from "react-router-dom";
import { usePartyStore } from "../../store/partyStore";
import { useEffect, useState } from "react";
import InvoicesForm from "../../components/Invoices/InvoicesForm";

const DashboardCreatePurchaseReturnPage = () => {
  const { state } = useLocation();
  const { parties } = usePartyStore();
  const [party, setParty] = useState();

  useEffect(() => {
    if (!state?.id || !parties?.length > 0) return;
    const party = parties.filter((party) => party?._id === state?.id);
    setParty(party[0]);
  }, [state, parties]);
  return (
    <main className="max-h-screen flex w-full overflow-auto">
      <section className=" w-full bg-gray-100  h-screen p-2">
        <div className=" border border-zinc-300 h-full rounded-md bg-white overflow-auto ">
          <InvoicesForm
            title={"Purchase Return"}
            party={party}
            setParty={setParty}
          />
        </div>
      </section>
    </main>
  );
};

export default DashboardCreatePurchaseReturnPage;
