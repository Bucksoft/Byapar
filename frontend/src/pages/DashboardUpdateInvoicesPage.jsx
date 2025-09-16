import { useParams, useSearchParams } from "react-router-dom";
import InvoicesForm from "../components/Invoices/InvoicesForm";
import { usePartyStore } from "../store/partyStore";
import { useEffect, useState } from "react";
import { useQuotationStore } from "../store/quotationStore";

const DashboardUpdateInvoicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { quotations } = useQuotationStore();
  const [invoiceToUpdate, setInvoiceToUpdate] = useState();
  const [party, setParty] = useState();

  const type = searchParams.get("type");
  const { id } = useParams();

  useEffect(() => {
    if (type === "quotation") {
      const quotationToUpdate = quotations.filter(
        (quotation) => quotation?._id === id
      );
      setParty(quotationToUpdate?.partyId);
      setInvoiceToUpdate(quotationToUpdate[0]);
    }
  }, [id, type]);

  return (
    <main className="max-h-screen flex w-full overflow-auto">
      <section className=" w-full bg-gray-100  h-screen p-2">
        <div className=" border border-zinc-300 h-full rounded-md bg-white overflow-auto ">
          <InvoicesForm
            title={type === "quotation" ? "Quotation" : ""}
            type={type}
            isEditing={true}
            party={party}
            setParty={setParty}
            invoiceToUpdate={invoiceToUpdate}
          />
        </div>
      </section>
    </main>
  );
};

export default DashboardUpdateInvoicesPage;
