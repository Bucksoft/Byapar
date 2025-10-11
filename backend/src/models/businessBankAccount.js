import mongoose from "mongoose";

const businessBankAccountSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
  },
  openingBalance: {
    type: Number,
    default: 0,
  },
  bankAccountNumber: {
    type: String,
    required: true,
  },
  asOfDate: {
    type: String,
  },
  IFSCCode: {
    type: String,
    required: true,
  },
  bankAndBranchName: {
    type: String,
    required: true,
  },
  accountHoldersName: {
    type: String,
    required: true,
  },
  upiId: {
    type: String,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCredential",
  },
});

export const BusinessBankAccount = mongoose.model(
  "BusinessBankAccount",
  businessBankAccountSchema
);
