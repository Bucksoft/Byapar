import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
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
import { useInvoiceStore } from "../../store/invoicesStore";
import { useQuotationStore } from "../../store/quotationStore";

const InvoicesForm = ({
  title,
  party,
  setParty,
  type,
  isEditing,
  invoiceToUpdate,
}) => {
  const { business } = useBusinessStore();
  const { invoices } = useInvoiceStore();
  const { quotations } = useQuotationStore();
  const [quantities, setQuantities] = useState({});

  const invoiceNoRef = useRef();
  const invoiceData = {
    paymentTerms: 0,
    dueDate: new Date(Date.now()),
    validFor: 0,
    validityDate: new Date(Date.now()),
    salesInvoiceDate: new Date(Date.now()),
    salesInvoiceNumber:
      title === "Sales Invoice"
        ? invoices?.length + 1
        : title === "Quotation"
        ? quotations.length + 1
        : 1,
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
    additionalChargeReason: "",
    additionalChargeAmount: 0,
    additionalChargeTax: "",
    additionalDiscountType: "after tax",
    additionalDiscountAmount: 0,
  };

  const navigate = useNavigate();
  const [addedItems, setAddedItems] = useState([]);
  const [data, setData] = useState(invoiceData);

  useEffect(() => {
    if (isEditing && invoiceToUpdate) {
      setData((prev) => ({
        ...prev,
        ...invoiceToUpdate,
        partyName: invoiceToUpdate?.partyName || prev.partyName,
      }));

      setAddedItems(invoiceToUpdate?.items || []);
    }
  }, [isEditing, invoiceToUpdate]);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      if (!party) {
        throw new Error("Please select a party");
      }
      if (formData.items.length <= 0) {
        throw new Error("Please add at least 1 item");
      }

      let endpoint = "";
      let method = isEditing ? "patch" : "post";

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
        case "Credit Note":
          endpoint = `/credit-note/${business?._id}`;
          break;
        case "Delivery Challan":
          endpoint = `/delivery-challan/${business?._id}`;
          break;
        case "Proforma Invoice":
          endpoint = `/proforma-invoice/${business?._id}`;
          break;
        case "Purchase Return":
          endpoint = `/purchase-return/${business?._id}`;
          break;
        default:
          toast.error("Invalid invoice type");
          return;
      }

      if (isEditing && invoiceToUpdate?._id) {
        endpoint = `${endpoint}/${invoiceToUpdate._id}`;
      }

      let res;
      if (method === "post") {
        res = await axiosInstance.post(endpoint, {
          ...formData,
          partyName: party?.partyName,
        });
      } else {
        res = await axiosInstance.patch(endpoint, {
          ...formData,
          partyName: party?.partyName,
        });
      }

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
      } else if (data?.deliveryChallan?._id) {
        navigate(`/dashboard/delivery-challan/${data?.deliveryChallan?._id}`);
      } else if (data?.proformaInvoice?._id) {
        navigate(`/dashboard/proforma-invoice/${data?.proformaInvoice?._id}`);
      } else if (data?.purchaseReturn?._id) {
        navigate(`/dashboard/purchase-return/${data?.purchaseReturn?._id}`);
      }
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.msg || err?.message || "Something went wrong"
      );
      if (
        err.response?.data?.msg ===
        "Invoice already exists with this invoice number"
      ) {
        invoiceNoRef.current.focus();
        invoiceNoRef.current.style.outline = "1px solid red";
      }
    },
  });

  useEffect(() => {
    if (isEditing && invoiceToUpdate) {
      // Normalize items coming from backend (ensure numeric fields & quantity)
      const normalizedItems = (invoiceToUpdate.items || []).map((it, idx) => {
        const id = it._id || it.itemId || `item-${idx}`;
        const qty = Number(it.quantity ?? it.qty ?? 1);
        return {
          ...it,
          _id: id,
          quantity: qty,
          salesPrice: Number(it.salesPrice ?? it.rate ?? 0),
          gstTaxRate: it.gstTaxRate ?? it.gstRate ?? "0%",
          gstTaxRateType: it.gstTaxRateType ?? "with tax",
          discountPercent: it.discountPercent ?? 0,
          discountAmount: Number(it.discountAmount ?? 0),
        };
      });

      // seed quantities map
      const qtyMap = {};
      normalizedItems.forEach((it) => {
        qtyMap[it._id] = it.quantity;
      });

      setAddedItems(normalizedItems);
      setQuantities(qtyMap);

      // normalize top-level numeric fields as well before setting data
      setData((prev) => ({
        ...prev,
        ...invoiceToUpdate,
        partyName: invoiceToUpdate?.partyName ?? prev.partyName,
        additionalChargeAmount: Number(
          invoiceToUpdate?.additionalChargeAmount ??
            prev.additionalChargeAmount ??
            0
        ),
        additionalDiscountAmount: Number(
          invoiceToUpdate?.additionalDiscountAmount ??
            prev.additionalDiscountAmount ??
            0
        ),
        additionalChargeTax:
          invoiceToUpdate?.additionalChargeTax ?? prev.additionalChargeTax,
        additionalDiscountType:
          invoiceToUpdate?.additionalDiscountType ??
          prev.additionalDiscountType,
        items: normalizedItems,
        balanceAmount: Number(
          invoiceToUpdate?.balanceAmount ?? prev.balanceAmount ?? 0
        ),
      }));
    }
  }, [isEditing, invoiceToUpdate]);

  return (
    <main className="max-h-screen w-full">
      {/* navbar starts ----------------------------------------------------- */}
      <header className="p-2 w-full flex items-center justify-between ">
        <div className="flex items-center justify-center">
          <ArrowLeft size={18} onClick={() => navigate(-1)} />
          <span className="pl-3">
            {" "}
            {isEditing ? `Update ${title}` : `Create ${title}`}{" "}
          </span>
        </div>
        <div className="flex items-center justify-center gap-5">
          {/* <button className="btn btn-sm">Settings</button> */}
          <button
            onClick={() => mutation.mutate(data)}
            disabled={mutation?.isPending}
            className="btn bg-[var(--primary-btn)] btn-sm hover:bg-[var(--primary-btn)]/80"
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
      <SalesInvoicePartyDetailsSection
        data={data}
        setData={setData}
        party={party}
        setParty={setParty}
        title={title}
        invoiceNoRef={invoiceNoRef}
        isEditing={isEditing}
      />

      <SalesInvoiceItemTable
        title={title}
        data={data}
        setData={setData}
        isEditing={isEditing}
      />

      {/* bottom grid part */}
      <SalesInvoiceFooterSection
        data={data}
        setData={setData}
        addedItems={addedItems}
        title={title}
        isEditing={isEditing}
      />
    </main>
  );
};

export default InvoicesForm;
