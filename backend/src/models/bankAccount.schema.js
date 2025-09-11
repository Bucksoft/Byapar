import mongoose from "mongoose";

export const bankAccountSchema = new mongoose.Schema({
  accountName: {
    type: String,
  },
  openingBalance: {
    type: Number,
    default: 0,
  },
  paymentAsOfDate: {
    type: Date,
  },
  bankAccountNumber: {
    type: String,
    required: [true, "Bank account number is required"],
  },
  IFSCCode: {
    type: String,
    required: [true, "IFSC code is required"],
  },
  bankAndBranchName: {
    type: String,
    required: [true, "Bank name & Branch name are required"],
  },
  accountHoldersName: {
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
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
  },
});

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);
export default BankAccount;
