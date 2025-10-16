import { useParams, useSearchParams } from "react-router-dom";
import InvoicesForm from "../components/Invoices/InvoicesForm";
import { usePartyStore } from "../store/partyStore";
import { useEffect, useState } from "react";
import { useQuotationStore } from "../store/quotationStore";
import { useInvoiceStore } from "../store/invoicesStore";
import { useCreditNoteStore } from "../store/creditNoteStore";
import { useChallanStore } from "../store/challanStore";
import { useProformaInvoiceStore } from "../store/proformaStore";

const DashboardUpdateInvoicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { quotations } = useQuotationStore();
  const { creditNotes } = useCreditNoteStore();
  const { invoices } = useInvoiceStore();
  const { deliveryChallans } = useChallanStore();
  const { proformaInvoices } = useProformaInvoiceStore();

  const [invoiceToUpdate, setInvoiceToUpdate] = useState();
  const [party, setParty] = useState();

  // GET THE TYPE OF THE INVOICE AND ITS ID TO UPDATE
  const type = searchParams.get("type");
  const { id } = useParams();

  // THIS USE EFFECT FILTERS OUT THE CORRECT INVOICE BASED ON THE TYPE
  useEffect(() => {
    if (type === "quotation") {
      const quotationToUpdate = quotations?.filter(
        (quotation) => quotation?._id === id
      );
      setParty(quotationToUpdate?.partyId);
      setInvoiceToUpdate(quotationToUpdate[0]);
    } else if (type === "sales invoice") {
      const salesInvoiceToUpdate = invoices?.invoices?.filter(
        (invoice) => invoice?._id === id
      );
      setParty(salesInvoiceToUpdate?.partyId);
      setInvoiceToUpdate(salesInvoiceToUpdate[0]);
    } else if (type === "credit note") {
      const creditNoteToUpdate = creditNotes?.filter(
        (creditNote) => creditNote?._id === id
      );
      setParty(creditNoteToUpdate?.partyId);
      setInvoiceToUpdate(creditNoteToUpdate[0]);
    } else if (type === "delivery challan") {
      const challanToUpdate = deliveryChallans?.filter(
        (challan) => challan?._id === id
      );
      setParty(challanToUpdate?.partyId);
      setInvoiceToUpdate(challanToUpdate[0]);
    } else if (type === "proforma invoice") {
      const proformaInvoiceToUpdate = proformaInvoices?.filter(
        (invoice) => invoice?._id === id
      );
      setParty(proformaInvoiceToUpdate?.partyId);
      setInvoiceToUpdate(proformaInvoiceToUpdate[0]);
    }
  }, [id, type]);

  return (
    <main className="max-h-screen flex w-full overflow-auto">
      <section className=" w-full bg-gray-100  h-screen p-2">
        <div className=" border border-zinc-300 h-full rounded-md bg-white overflow-auto ">
          <InvoicesForm
            title={
              type === "quotation"
                ? "Quotation"
                : type === "sales invoice"
                ? "Sales Invoice"
                : type === "credit note"
                ? "Credit note"
                : type === "delivery challan"
                ? "Delivery Challan"
                : type === "proforma invoice"
                ? "Proforma Invoice"
                : ""
            }
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
