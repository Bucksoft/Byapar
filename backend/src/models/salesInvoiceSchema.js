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
    sgst: {
      type: String,
      default: "0",
    },
    cgst: {
      type: String,
      default: "0",
    },
    igst: {
      type: String,
      default: "0",
    },
    totalAmount: { type: Number, required: true },
    balanceAmount: {
      type: Number,
      default: function () {
        return this.totalAmount;
      },
    },

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
    pendingAmount: {
      type: Number,
      default: function () {
        return this.totalAmount;
      },
    },

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
    fullyPaid: {
      type: Boolean,
      default: false,
    },
    roundedOff: {
      type: Boolean,
      default: false,
    },
    receivedAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

salesInvoiceSchema.pre("save", function (next) {
  this.pendingAmount = Math.max(this.totalAmount - this.settledAmount, 0);
  this.balanceAmount = this.pendingAmount;
  this.fullyPaid = this.pendingAmount === 0;
  this.status = this.fullyPaid
    ? "paid"
    : this.settledAmount > 0
    ? "partially paid"
    : "unpaid";
  next();
});

const SalesInvoice = mongoose.model("SalesInvoice", salesInvoiceSchema);
export default SalesInvoice;
