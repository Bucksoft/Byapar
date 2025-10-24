import mongoose from "mongoose";

const businessBankAccountSchema = new mongoose.Schema({
  accountName: {
    type: String,
  },
  openingBalance: {
    type: Number,
    default: 0,
  },
  bankAccountNumber: {
    type: String,
  },
  asOfDate: {
    type: String,
  },
  IFSCCode: {
    type: String,
  },
  bankAndBranchName: {
    type: String,
  },
  accountHoldersName: {
    type: String,
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
  isActive: {
    type: Boolean,
    default: false,
  },
});

export const BusinessBankAccount = mongoose.model(
  "BusinessBankAccount",
  businessBankAccountSchema
);
