import mongoose from "mongoose";

const paymentInSchema = new mongoose.Schema({
  partyName: {
    type: String,
    required: [true, "Party name is required"],
  },
  paymentInNumber: {
    type: String,
    required: true,
  },
  paymentAmount: {
    type: Number,
    required: [true, "Payment Amount is required"],
  },
  paymentDate: {
    type: String,
  },
  paymentMode: {
    type: String,
    default: "cash",
  },
  bankAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankAccount",
  },
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCredential",
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
  },
  notes: {
    type: String,
  },
  type: {
    type: String,
    default: "payment in",
  },
  status: {
    type: String,
    enum: ["active", "cancelled", "reversed", "pending", "completed"],
    default: "active",
  },
  settledInvoices: [{}],
});

export const PaymentIn = mongoose.model("PaymentIn", paymentInSchema);
