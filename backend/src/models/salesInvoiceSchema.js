import mongoose from "mongoose";

const salesInvoiceSchema = new mongoose.Schema(
  {
    partyName: { type: String, default: "" },
    salesInvoiceNumber: { type: Number, required: true },
    salesInvoiceDate: { type: Date, default: Date.now },
    paymentTerms: { type: Number },
    dueDate: { type: Date, default: Date.now },

    // items can have ANY shape (arbitrary fields allowed)
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
    status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const SalesInvoice = mongoose.model("SalesInvoice", salesInvoiceSchema);
export default SalesInvoice;
