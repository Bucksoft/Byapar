import mongoose from "mongoose";

const proformaInvoiceSchema = new mongoose.Schema(
  {
    partyName: { type: String, default: "" },
    proformaInvoiceNumber: { type: Number, required: true },
    proformaInvoiceDate: { type: Date, default: Date.now },
    paymentTerms: { type: Number },
    dueDate: { type: Date, default: Date.now },
    items: [
      {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        required: true,
      },
    ],
    amountSubTotal: { type: Number, required: true },
    discountSubtotal: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    taxableAmount: { type: Number },
    taxSubTotal: { type: Number },
    sgst: String,
    cgst: String,
    totalAmount: { type: Number, required: true },
    balanceAmount: { type: Number, required: true },
    partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    notes: { type: String, default: "" },
    termsAndCondition: { type: String, default: "" },
    settledAmount: {
      type: Number,
      default: 0,
    },
    pendingAmount: {
      type: Number,
    },
    isConverted: {
      type: Boolean,
      default: false,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCredential",
    },
    status: {
      type: String,
      enum: [
        "paid",
        "unpaid",
        "draft",
        "partially paid",
        "cancelled",
        "draft",
        "open",
        "accepted",
        "rejected",
        "converted",
        "expired",
      ],
      default: "open",
    },
    fullyPaid: {
      type: Boolean,
      default: false,
    },
    roundedOff: {
      type: Boolean,
      default: false,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const ProformaInvoice = mongoose.model(
  "ProformaInvoice",
  proformaInvoiceSchema
);
export default ProformaInvoice;
