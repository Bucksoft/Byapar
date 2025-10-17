import { useLocation } from "react-router-dom";
import InvoicesForm from "../components/Invoices/InvoicesForm";
import { useEffect, useState } from "react";
import { usePartyStore } from "../store/partyStore";
import { useInvoiceStore } from "../store/invoicesStore";

const DashboardSalesInvoicePage = () => {
  const { state } = useLocation();
  const { parties } = usePartyStore();
  const { invoices } = useInvoiceStore();
  const [party, setParty] = useState();

  useEffect(() => {
    if (!state?.id || !parties?.length > 0) return;
    const party = parties.filter((party) => party?._id === state?.id);
    setParty(party[0]);
  }, [state, parties]);

  return (
    <main className="max-h-screen flex w-full overflow-auto">
      <section className=" w-full h-screen p-2">
        <div className=" border border-zinc-300 h-full rounded-md  overflow-auto ">
          <InvoicesForm
            title={"Sales Invoice"}
            party={party}
            setParty={setParty}
            invoices={invoices}
          />
        </div>
      </section>
    </main>
  );
};

export default DashboardSalesInvoicePage;
