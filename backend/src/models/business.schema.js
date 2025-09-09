import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  logo: {
    type: String,
  },
  businessName: {
    type: String,
    required: [true, "Business name is required"],
  },
  businessType: {
    type: String,
    required: [true, "Business type is required"],
  },
  industryType: {
    type: String,
    required: [true, "Industry type is required"],
  },
  companyPhoneNo: {
    type: String,
  },
  businessRegType: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true,
  },
  billingAddress: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  pincode: {
    type: String,
  },
  gstRegistered: {
    type: Boolean,
    default: false,
  },
  gstNumber: {
    type: String,
  },
  panNumber: {
    type: String,
  },
  TDS: {
    type: Boolean,
    default: false,
  },
  TCS: {
    type: Boolean,
    default: false,
  },
  additionalInfo: {
    type: String,
  },
  signature: {
    type: String,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCredential",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
});

export const Business = mongoose.model("Business", businessSchema);
