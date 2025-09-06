import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../config/axios";
import { toast } from "react-hot-toast";
import SalesInvoicePartyDetailsSection from "./SalesInvoicePartyDetailsSection";
import SalesInvoiceItemTable from "./SalesInvoiceItemTable";
import SalesInvoiceFooterSection from "./SalesInvoiceFooterSection";
import { queryClient } from "../../main";

const InvoicesForm = ({ title, party, setParty, invoices }) => {
  const invoiceData = {
    paymentTerms: 0,
    dueDate: new Date(Date.now()),
    salesInvoiceDate: new Date(Date.now()),
    salesInvoiceNumber: 1,
    partyName: party?.partyName || "",
    items: [],
    discountSubtotal: 0,
    taxableAmount: "",
    discountAmount: 0,
    discountPercent: 0,
    balanceAmount: 0,
    sgst: "",
    cgst: "",
    notes: "",
    termsAndCondition: "",
    invoiceId:""
  };

  const navigate = useNavigate();
  const [addedItems, setAddedItems] = useState([]);
  const [data, setData] = useState(invoiceData);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (!party) {
        toast.error("Please select a party");
        return;
      }
      if (data.items.length <= 0) {
        toast.error("Please add at least 1 item");
        return;
      }

      // Dynamically decide endpoint based on title
      let endpoint = "";
      switch (title) {
        case "Quotation":
          endpoint = "/quotation";
          break;
        case "Sales Invoice":
          endpoint = "/sales-invoice";
          break;
        case "Purchase Invoice":
          endpoint = "/purchase-invoice";
          break;
        case "Sales Return":
          endpoint = "/sales-return";
          break;
        default:
          toast.error("Invalid invoice type");
          return;
      }

      const res = await axiosInstance.post(endpoint, {
        ...data,
        partyName: party?.partyName,
      });
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.msg);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });

      // Navigate dynamically based on invoice type
      if (data?.quotation?._id) {
        navigate(`/dashboard/quotations/${data?.quotation?._id}`);
      } else if (data?.salesInvoice?._id) {
        navigate(`/dashboard/sales-invoice/${data?.salesInvoice?._id}`);
      } else if (data?.purchaseInvoice?._id) {
        navigate(`/dashboard/purchase-invoice/${data?.purchaseInvoice?._id}`);
      }
    },

    onError: (err) => {
      toast.error(err.response?.data?.msg || "Something went wrong");
    },
  });

  return (
    <main className="max-h-screen w-full">
      {/* navbar starts ----------------------------------------------------- */}
      <header className="p-2 w-full flex items-center justify-between ">
        <div className="flex items-center justify-center">
          <ArrowLeft size={18} onClick={() => navigate(-1)} />
          <span className="pl-3">Create {title}</span>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className="btn btn-sm">Settings</button>
          <button
            onClick={() => mutation.mutate(data)}
            className="btn bg-[var(--primary-btn)] btn-sm"
          >
            Save {title}
          </button>
        </div>
      </header>
      {/* navbar ends ----------------------------------------------------- */}

      {/* Upper section of invoice form invoice number, dates , party name details etc */}
      <SalesInvoicePartyDetailsSection
        data={data}
        setData={setData}
        party={party}
        setParty={setParty}
        title={title}
      />
      {/* Upper section of invoice form invoice number, dates , party name details etc ends here ---------------------------------------*/}

      {/* This is the table where items are listed with their prices ----------------------------*/}
      <SalesInvoiceItemTable data={data} setData={setData} />

      {/* bottom grid part */}
      <SalesInvoiceFooterSection
        data={data}
        setData={setData}
        addedItems={addedItems}
        title={title}
      />
    </main>
  );
};

export default InvoicesForm;
