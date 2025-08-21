import mongoose from "mongoose";

const paymentInSchema = new mongoose.Schema({
  partyName: {
    type: String,
    required: [true, "Party name is required"],
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
  notes: {
    type: String,
  },
});

export const PaymentIn = mongoose.model("PaymentIn", paymentInSchema);
