import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import { useSalesReturnStore } from "../../store/salesReturnStore";
import { useCreditNoteStore } from "../../store/creditNoteStore";
import { useChallanStore } from "../../store/challanStore";
import { useProformaInvoiceStore } from "../../store/proformaStore";
import { usePurchaseInvoiceStore } from "../../store/purchaseInvoiceStore";
import { usePurchaseOrderStore } from "../../store/purchaseOrderStore";
import { useDebitNoteStore } from "../../store/debitNoteStore";
import { usePartyStore } from "../../store/partyStore";
import SalesInvoiceItemTableTesting from "./InvoiceItemTableTesting";
import { getTotalTaxRate } from "../../../helpers/getGSTTaxRate";

const InvoicesForm = ({
  title,
  party,
  setParty,
  type,
  isEditing,
  invoiceToUpdate,
}) => {
  const { business } = useBusinessStore();
  const { parties } = usePartyStore();
  const { totalInvoices } = useInvoiceStore();
  const { totalQuotations } = useQuotationStore();
  const { totalSalesReturn } = useSalesReturnStore();
  const { totalCreditNotes } = useCreditNoteStore();
  const { totalDeliveryChallans } = useChallanStore();
  const { totalProformaInvoices } = useProformaInvoiceStore();
  const { totalPurchaseInvoices } = usePurchaseInvoiceStore();
  const { totalPurchaseOrders } = usePurchaseOrderStore();
  const { totalDebitNotes } = useDebitNoteStore();

  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const [addedItems, setAddedItems] = useState([]);

  const invoiceNoRef = useRef();

  console.log(business);

  // INVOICE DATA TO SEND
  const invoiceData = {
    paymentTerms: 0,
    dueDate: new Date(Date.now()),
    validFor: 0,
    validityDate: new Date(Date.now()),
    salesInvoiceDate: new Date(Date.now()),
    salesInvoiceNumber:
      title === "Sales Invoice"
        ? totalInvoices + 1
        : title === "Quotation"
        ? totalQuotations + 1
        : title === "Sales Return"
        ? totalSalesReturn + 1
        : title === "Credit Note"
        ? totalCreditNotes + 1
        : title === "Delivery Challan"
        ? totalDeliveryChallans + 1
        : title === "Proforma Invoice"
        ? totalProformaInvoices + 1
        : title === "Purchase Invoice"
        ? totalPurchaseInvoices + 1
        : title === "Purchase Order"
        ? totalPurchaseOrders + 1
        : title === "Debit Note"
        ? totalDebitNotes + 1
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

    additionalCharges: [
      {
        reason: "",
        amount: 0,
        tax: "",
      },
    ],

    additionalDiscountType: "after tax",
    additionalDiscountPercent: 0,
  };

  const [data, setData] = useState(invoiceData);

  // MUTATION FOR CREATING & UPDATING INVOICE
  const mutation = useMutation({
    mutationFn: async (formData) => {
      console.log(formData);
      if (!business) {
        throw new Error(
          "You don't have any active business yet, create one first"
        );
      }
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
        case "Purchase Order":
          endpoint = `/purchase-order/${business?._id}`;
          break;
        case "Debit Note":
          endpoint = `/debit-note/${business?._id}`;
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
      navigate("/dashboard/sales");
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
      } else if (data?.creditNoteNumber?._id) {
        navigate(`/dashboard/credit-note/${data?.creditNoteNumber?._id}`);
      } else if (data?.purchaseOrder?._id) {
        navigate(`/dashboard/purchase-order/${data?.purchaseOrder?._id}`);
      } else if (data?.debitNote?._id) {
        navigate(`/dashboard/debit-note/${data?.debitNote?._id}`);
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

  // THIS USE EFFECT IS FOR SETTING THE INVOICE WHICH NEEDS TO BE UPDATED
  useEffect(() => {
    if (isEditing && invoiceToUpdate) {
      const normalizedItems = (invoiceToUpdate.items || []).map((it, idx) => {
        const id = it?._id || it?.itemId || `item-${idx}`;
        const qty = Number(it?.quantity ?? it?.qty ?? 1);
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

      // Add quantities
      const qtyMap = {};
      normalizedItems.forEach((it) => {
        qtyMap[it._id] = it.quantity;
      });

      setAddedItems(normalizedItems);
      setQuantities(qtyMap);

      // Set main data
      setData((prev) => ({
        ...prev,
        ...invoiceToUpdate,
        partyName: invoiceToUpdate?.partyName ?? prev.partyName,
        additionalChargeAmount: Number(
          invoiceToUpdate?.additionalChargeAmount ?? 0
        ),
        additionalDiscountPercent: Number(
          invoiceToUpdate?.additionalDiscountPercent ?? 0
        ),
        additionalChargeTax: invoiceToUpdate?.additionalChargeTax ?? "0%",
        additionalDiscountType:
          invoiceToUpdate?.additionalDiscountType ?? "before tax",
        items: normalizedItems,
        balanceAmount: Number(invoiceToUpdate?.balanceAmount ?? 0),
      }));
    }
    // Run only when invoiceToUpdate changes from null → object
  }, [invoiceToUpdate, isEditing]);

  const invoiceTotals = useMemo(() => {
    if (!data?.items?.length)
      return {
        totalDiscount: 0,
        totalTaxableValue: 0,
        totalTax: 0,
        totalAmount: 0,
        totalCGST: 0,
        totalSGST: 0,
        additionalCharge: 0,
        additionalChargeGST: 0,
        additionalDiscountAmount: 0,
      };

    let totalDiscount = 0;
    let totalTaxableValue = 0;
    let totalTax = 0;
    let totalAmount = 0;
    let totalAdditionalDiscount = 0;

    // === ITEM CALCULATIONS ===
    data.items.forEach((item) => {
      const quantity = Number(item.quantity || 0);
      const basePrice = Number(item.basePrice || 0);
      const discountAmount = Number(item.discountAmount || 0);
      const gstAmount = Number(item.gstAmount || 0);
      const additionalDiscountAmount = Number(
        item.additionalDiscountAmount || 0
      );

      const taxableValue = basePrice * quantity - discountAmount;

      totalDiscount += discountAmount;
      totalTaxableValue += taxableValue;
      totalTax += gstAmount;
      totalAdditionalDiscount += additionalDiscountAmount;
      totalAmount += taxableValue + gstAmount - additionalDiscountAmount;
    });

    // === ADDITIONAL CHARGES CALCULATION (ARRAY) ===
    let totalAdditionalCharge = 0;
    let totalAdditionalChargeGST = 0;

    if (
      Array.isArray(data?.additionalCharges) &&
      data.additionalCharges.length > 0
    ) {
      data.additionalCharges.forEach((charge) => {
        const chargeAmount = Number(charge.amount || 0);
        const taxRate = getTotalTaxRate(charge.tax || "0");
        const chargeGST = (chargeAmount * taxRate) / 100;

        totalAdditionalCharge += chargeAmount;
        totalAdditionalChargeGST += chargeGST;
      });
    }

    totalAmount += totalAdditionalCharge + totalAdditionalChargeGST;

    return {
      totalDiscount: Number(totalDiscount.toFixed(2)),
      totalTaxableValue: Number(totalTaxableValue.toFixed(2)),
      totalTax: Number(totalTax.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      totalCGST: Number((totalTax / 2).toFixed(2)),
      totalSGST: Number((totalTax / 2).toFixed(2)),
      additionalCharge: Number(totalAdditionalCharge.toFixed(2)),
      additionalChargeGST: Number(totalAdditionalChargeGST.toFixed(2)),
      additionalDiscountAmount: Number(totalAdditionalDiscount.toFixed(2)),
    };
  }, [
    data?.items,
    data?.additionalDiscountPercent,
    data?.additionalDiscountType,
    data?.additionalCharges,
  ]);

  useEffect(() => {
    if (!invoiceTotals) return;
    setData((prev) => ({
      ...prev,
      discountSubtotal: invoiceTotals.totalDiscount,
      taxableAmount: invoiceTotals.totalTaxableValue,
      cgst: invoiceTotals.totalCGST,
      sgst: invoiceTotals.totalSGST,
      balanceAmount: invoiceTotals.totalAmount,
      additionalChargeAmount: invoiceTotals.additionalCharge,
      additionalChargeTax: data?.additionalChargeTax || "",
      additionalDiscountPercent: data?.additionalDiscountPercent || 0,
      additionalDiscountType: data?.additionalDiscountType || "after tax",
    }));
  }, [invoiceTotals]);

  return (
    <main className="max-h-screen w-full">
      {/* navbar starts ----------------------------------------------------- */}
      <header className="p-2 w-full flex items-center justify-between">
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
                <BsFillSaveFill />
                {isEditing ? `Update ${title}` : `Save ${title}`}
              </>
            )}
          </button>
        </div>
      </header>
      {/* navbar ends ----------------------------------------------------- */}
      <SalesInvoicePartyDetailsSection
        data={data}
        setData={setData}
        parties={parties}
        party={party}
        setParty={setParty}
        title={title}
        invoiceNoRef={invoiceNoRef}
        isEditing={isEditing}
        invoiceToUpdate={invoiceToUpdate}
      />

      <SalesInvoiceItemTableTesting
        title={title}
        data={data}
        setData={setData}
        isEditing={isEditing}
        invoiceToUpdate={invoiceToUpdate}
        invoiceTotals={invoiceTotals}
      />

      {/* bottom grid part */}
      <SalesInvoiceFooterSection
        data={data}
        setData={setData}
        addedItems={addedItems}
        title={title}
        isEditing={isEditing}
        invoiceTotals={invoiceTotals}
      />
    </main>
  );
};
export default InvoicesForm;
