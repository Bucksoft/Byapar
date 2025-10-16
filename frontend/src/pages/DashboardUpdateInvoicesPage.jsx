import { useParams, useSearchParams } from "react-router-dom";
import InvoicesForm from "../components/Invoices/InvoicesForm";
import { usePartyStore } from "../store/partyStore";
import { useEffect, useState } from "react";
import { useQuotationStore } from "../store/quotationStore";
import { useInvoiceStore } from "../store/invoicesStore";
import { useCreditNoteStore } from "../store/creditNoteStore";
import { useChallanStore } from "../store/challanStore";
import { useProformaInvoiceStore } from "../store/proformaStore";
import { useQuery } from "@tanstack/react-query";

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
    let selectedInvoice = null;

    if (type === "quotation") {
      selectedInvoice = quotations?.find((q) => q?._id === id);
    } else if (type === "sales invoice") {
      selectedInvoice = Array.isArray(invoices?.invoices)
        ? invoices?.invoices?.find((inv) => inv?._id === id)
        : [];
    } else if (type === "credit note") {
      selectedInvoice = creditNotes?.find((c) => c?._id === id);
    } else if (type === "delivery challan") {
      selectedInvoice = deliveryChallans?.find((d) => d?._id === id);
    } else if (type === "proforma invoice") {
      selectedInvoice = proformaInvoices?.find((p) => p?._id === id);
    }

    if (selectedInvoice) {
      setParty(selectedInvoice?.partyId || null);
      setInvoiceToUpdate(selectedInvoice || null);
    } else {
      setParty(null);
      setInvoiceToUpdate(null);
    }
  }, [
    id,
    type,
    quotations,
    invoices,
    creditNotes,
    deliveryChallans,
    proformaInvoices,
  ]);

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
