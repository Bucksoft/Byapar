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
    type: Date,
    default: Date.now,
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
});

const BusinessBankAccount = mongoose.model(
  "BusinessBankAccount",
  businessBankAccountSchema
);
export default BusinessBankAccount;
