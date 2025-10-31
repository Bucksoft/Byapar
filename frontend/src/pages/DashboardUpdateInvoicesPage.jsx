import { useParams, useSearchParams } from "react-router-dom";
import InvoicesForm from "../components/Invoices/InvoicesForm";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import CustomLoader from "../components/Loader";

const DashboardUpdateInvoicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [endpoint, setEndpoint] = useState("");
  const [invoiceToUpdate, setInvoiceToUpdate] = useState();
  const [party, setParty] = useState();

  // GET THE TYPE OF THE INVOICE AND ITS ID TO UPDATE
  const type = searchParams.get("type");
  const { id } = useParams();

  // THIS USE EFFECT FILTERS OUT THE CORRECT INVOICE BASED ON THE TYPE
  useEffect(() => {
    if (!id.length || !type.length) return;
    let endpoint = "";

    switch (type) {
      case "quotation":
        endpoint = `/quotation/${id}`;
        break;
      case "sales invoice":
        endpoint = `/sales-invoice/invoice/${id}`;
        break;
      case "credit note":
        endpoint = `/credit-note/invoice/${id}`;
        break;
      case "delivery challan":
        endpoint = `/delivery-challan/invoice/${id}`;
        break;
      case "proforma invoice":
        endpoint = `/proforma-invoice/invoice/${id}`;
        break;
      case "purchase invoice":
        endpoint = `/purchase-invoice/invoice/${id}`;
        break;
      case "purchase return":
        endpoint = `/purchase-return/return/${id}`;
        break;
      case "sale return":
        endpoint = `/sales-return/return/${id}`;
        break;
      default:
        break;
    }
    if (!endpoint) return;
    setEndpoint(endpoint);
  }, [id, type]);

  const { isLoading, data } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoint);
      if (res?.data?.invoice) {
        setInvoiceToUpdate(res?.data?.invoice);
      } else if (res?.data?.quotation) {
        setInvoiceToUpdate(res?.data?.quotation);
      } else if (res?.data?.creditNote) {
        setInvoiceToUpdate(res?.data?.creditNote);
      } else if (res?.data?.deliveryChallan) {
        setInvoiceToUpdate(res?.data?.deliveryChallan);
      } else if (res?.data?.proformaInvoice) {
        setInvoiceToUpdate(res?.data?.proformaInvoice);
      } else if (res?.data?.purchaseInvoice) {
        setInvoiceToUpdate(res?.data?.purchaseInvoice);
      } else if (res?.data?.purchaseReturn) {
        setInvoiceToUpdate(res?.data?.purchaseReturn);
      } else if (res?.data?.saleReturn) {
        setInvoiceToUpdate(res?.data?.saleReturn);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <CustomLoader text={"Loading..."} />
      </div>
    );
  }

  return (
    <main className="max-h-screen flex w-full overflow-auto">
      <section className="w-full h-screen p-2">
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
                : type === "purchase invoice"
                ? "Purchase Invoice"
                : type === "purchase Return"
                ? "Purchase Return"
                : type === "sale Return"
                ? "Sale Return"
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
