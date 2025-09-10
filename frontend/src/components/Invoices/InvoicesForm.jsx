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
import { useBusinessStore } from "../../store/businessStore";
import { useRef } from "react";
import CustomLoader from "../Loader";
import { BsFillSaveFill } from "react-icons/bs";

const InvoicesForm = ({ title, party, setParty }) => {
  const { business } = useBusinessStore();
  const invoiceNoRef = useRef();
  const invoiceData = {
    paymentTerms: 0,
    dueDate: new Date(Date.now()),
    validFor: 0,
    validityDate: new Date(Date.now()),
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
    invoiceId: "",
  };

  const navigate = useNavigate();
  const [addedItems, setAddedItems] = useState([]);
  const [data, setData] = useState(invoiceData);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (!party) {
        throw new Error("Please select a party");
      }
      if (data.items.length <= 0) {
        throw new Error("Please add at least 1 item");
      }

      // Dynamically decide endpoint based on title
      let endpoint = "";
      switch (title) {
        case "Quotation":
          endpoint = `/quotation/${business?._id}`;
          break;
        case "Sales Invoice":
          endpoint = `/sales-invoice/${business?._id}`;
          break;
        case "Purchase Invoice":
          endpoint = `/purchase-invoice/${business?._id}`;
          break;
        case "Sales Return":
          endpoint = `/sales-return/${business?._id}`;
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
      toast.success(data?.msg);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });

      if (data?.quotation?._id) {
        navigate(`/dashboard/quotations/${data?.quotation?._id}`);
      } else if (data?.salesInvoice?._id) {
        navigate(`/dashboard/sales-invoice/${data?.salesInvoice?._id}`);
      } else if (data?.purchaseInvoice?._id) {
        navigate(`/dashboard/purchase-invoice/${data?.purchaseInvoice?._id}`);
      } else if (data?.salesReturn?._id) {
        navigate(`/dashboard/sales-return/${data?.salesReturn?._id}`);
      }
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.msg || err?.message || "Something went wrong"
      );
      if (
        err.response.data.msg ===
        "Invoice already exists with this invoice number"
      ) {
        invoiceNoRef.current.focus();
        invoiceNoRef.current.style.outline = "1px solid red";
      }
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
            disabled={mutation?.isPending}
            className="btn bg-[var(--primary-btn)] btn-sm"
          >
            {mutation.isPending ? (
              <CustomLoader text={"Saving..."} />
            ) : (
              <>
                {" "}
                <BsFillSaveFill />
                Save {title}
              </>
            )}
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
        invoiceNoRef={invoiceNoRef}
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
