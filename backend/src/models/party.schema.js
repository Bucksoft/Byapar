import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
  {
    partyName: {
      type: String,
      required: [true, "Party name is required"],
    },
    mobileNumber: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    openingBalanceStatus: {
      type: String,
      enum: ["To Collect", "To Pay"],
      default: "To Collect",
    },
    GSTIN: {
      type: String,
    },
    PANno: {
      type: String,
    },
    partyType: {
      type: String,
      enum: ["Customer", "Supplier"],
      default: "Customer",
    },
    categoryName: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    billingAddress: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
    },
    creditPeriod: {
      type: Number,
      default: 0,
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCredential",
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    pincode: {
      type: String,
    },
    flag: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Party = mongoose.model("Party", partySchema);
export default Party;
