import mongoose from "mongoose";

const salesReturnSchema = new mongoose.Schema(
  {
    partyName: { type: String, default: "" },
    salesReturnNumber: { type: Number, required: true },
    salesReturnDate: { type: Date, default: Date.now },
    // paymentTerms: { type: Number },
    // dueDate: { type: Date, default: Date.now },

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
        "draft",
        "approved",
        "partially settled",
        "settled",
        "cancelled",
        "refunded",
        "unpaid",
        "paid",
      ],
      default: "refunded",
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesInvoice",
    },
    type: {
      type: String,
      default: "sales return",
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const SalesReturn = mongoose.model("SalesReturn", salesReturnSchema);
export default SalesReturn;
