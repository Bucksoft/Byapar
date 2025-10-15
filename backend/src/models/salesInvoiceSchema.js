import mongoose from "mongoose";

const salesInvoiceSchema = new mongoose.Schema(
  {
    partyName: { type: String, default: "" },
    salesInvoiceNumber: { type: Number, required: true },
    salesInvoiceDate: { type: Date, default: Date.now },
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

    additionalCharges: [
      {
        reason: { type: String, default: "" },
        amount: { type: Number, default: 0 },
        tax: { type: String, default: "" },
      },
    ],

    totalAdditionalChargeAmount: { type: Number, default: 0 },
    totalAdditionalChargeGST: { type: Number, default: 0 },

    additionalDiscountType: {
      type: String,
      enum: ["after tax", "before tax"],
      default: "after tax",
    },
    additionalDiscountAmount: { type: Number, default: 0 },
    additionalDiscountPercent: { type: Number, default: 0 },

    settledAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number },

    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCredential",
    },

    type: {
      type: String,
      default: "sales invoice",
    },
    status: {
      type: String,
      enum: ["paid", "unpaid", "draft", "partially paid", "cancelled"],
      default: "unpaid",
    },
    cancelledAt: { type: Date },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCredential",
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const SalesInvoice = mongoose.model("SalesInvoice", salesInvoiceSchema);
export default SalesInvoice;
