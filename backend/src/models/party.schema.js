import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
  {
    partyName: {
      type: String,
      required: [true, "Party name is required"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
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
      required: true,
      unique: true,
    },
    PANno: {
      type: String,
      required: true,
      unique: true,
    },
    partyType: {
      type: String,
      enum: ["Customer", "Supplier"],
      default: "Customer",
    },
    categoryName: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    billingAddress: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    creditPeriod: {
      type: Number,
      required: true,
    },
    creditLimit: {
      type: Number,
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCredential",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    pincode: {
      type: String,
      required: true,
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
