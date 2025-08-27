import mongoose from "mongoose";

const salesInvoiceSchema = new mongoose.Schema({
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
  },
  salesInvoiceNumber: {
    type: Number,
    required: true,
  },
  salesInvoiceDate: {
    type: Date,
    default: Date.now,
  },
  paymentTerms: {
    type: Number,
  },
  dueDate: {
    type: Date,
    default: Date.now,
  },
  items: [{}],
  taxSubtotal: {
    type: Number,
  },
  amountSubTotal: {
    type: Number,
    required: true,
  },
  discountSubtotal: {
    type: Number,
  },
  notes: [String],
  termsAndCondition: [String],
  taxableAmount: String,
  sgst: String,
  cgst: String,
  totalAmount: {
    type: Number,
    required: true,
  },
  balanceAmount: {
    type: Number,
    required: true,
  },
});

const SalesInvoice = mongoose.model("SalesInvoice", salesInvoiceSchema);
export default SalesInvoice;
