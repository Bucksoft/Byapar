import mongoose from "mongoose";

export const bankAccountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: [true, "Account name is required"],
  },
  openingBalance: {
    type: Number,
    default: 0,
  },
  paymentAsOfDate: {
    type: Date,
    required: true,
  },
  bankAccountNumber: {
    type: Number,
    required: [true, "Bank account number is required"],
  },
  ifscCode: {
    type: String,
    required: [true, "IFSC code is required"],
  },
  bankAndBranchName: {
    type: String,
    required: [true, "Bank name & Branch name are required"],
  },
  accountHolderName: {
    type: String,
    required: [true, "Account holder name is required"],
  },
  upiId: {
    type: String,
  },
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCredential",
  },
});

export const BankAccount = mongoose.model("BankAccount", bankAccountSchema);
