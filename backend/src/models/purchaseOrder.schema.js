import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema(
  {
    partyName: { type: String, default: "" },
    purchaseOrderNumber: { type: Number, required: true },
    purchaseOrderDate: { type: Date, default: Date.now },
    // paymentTerms: { type: Number },
    // dueDate: { type: Date, default: Date.now },
    validFor: { type: Number },
    validityDate: { type: Date, default: Date.now },
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
      enum: ["draft", "open", "accepted", "rejected", "converted", "expired"],
      default: "open",
    },
    type: {
      type: String,
      default: "purchase order",
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);
export default PurchaseOrder;
