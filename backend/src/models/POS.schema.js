import mongoose from "mongoose";

const posSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCredential",
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    items: [
      {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        required: true,
      },
    ],
    posNumber: {
      type: Number,
      default: 0,
    },
    posDate: {
      type: Date,
      default: Date.now,
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    discountType: {
      type: String,
      default: "after_tax",
      enum: ["after_tax", "before_tax"],
    },
    computedDiscount: {
      type: Number,
      default: 0,
    },
    additionalCharges: [
      {
        charge: {
          type: String,
          default: "",
        },
        amount: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalAdditionalCharges: {
      type: Number,
      default: 0,
    },
    customerDetails: {
      mobile: String,
      customerName: String,
    },
    subTotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    receivedAmount: {
      type: Number,
      default: 0,
    },
    balanceAmount: {
      type: Number,
      default: 0,
    },
    paymentMode: {
      type: String,
      default: "cash",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      default: "pos invoice",
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
      default: "paid",
    },
  },
  { timestamps: true }
);

const POS = mongoose.model("POS", posSchema);
export default POS;
