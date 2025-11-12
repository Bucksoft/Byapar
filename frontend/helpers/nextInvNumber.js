export function getNextInvoiceNumber({
  type,
  business = {},
  latestNumbers = {},
}) {
  const invoiceType = (type || "").toLowerCase();

  const getNext = (latestNum = 0) => {
    if (business?.previousInvNumber) {
      return Math.max(business.previousInvNumber + 1, latestNum + 1);
    }
    return latestNum + 1;
  };

  const map = {
    "sales invoice": getNext(latestNumbers.latestInvoiceNumber),
    quotation: getNext(latestNumbers.latestQuotationNumber),
    "sales return": getNext(latestNumbers.latestSalesReturnNumber),
    "credit note": getNext(latestNumbers.latestCreditNoteNumber),
    "delivery challan": getNext(latestNumbers.latestChallanNumber),
    "proforma invoice": getNext(latestNumbers.latestProformaNumber),
    "purchase invoice": getNext(latestNumbers.latestPurchaseInvoiceNumber),
    "purchase order": getNext(latestNumbers.latestPurchaseOrderNumber),
    "debit note": getNext(latestNumbers.latestDebitNoteNumber),
  };

  return map[invoiceType] || 1;
}
