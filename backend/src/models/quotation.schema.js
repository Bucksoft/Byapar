import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    partyName: { type: String, default: "" },
    quotationNumber: { type: Number, required: true },
    quotationDate: { type: Date, default: Date.now },
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
    validFor: { type: Number },
    validityDate: { type: Date, default: Date.now },
    sgst: String,
    cgst: String,
    totalAmount: { type: Number, required: true },
    balanceAmount: { type: Number, required: true },
    partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    notes: { type: String, default: "" },
    termsAndCondition: { type: String, default: "" },
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
      default: "quotation",
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

const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;
