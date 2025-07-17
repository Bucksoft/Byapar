import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
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
  company_phoneNo: {
    type: Number,
  },
  business_regType: {
    type: String,
    required: true, // private, public
  },
  companyEmail: {
    type: String,
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
    type: Number,
  },
  gstRegistered: {
    type: Boolean,
  },
  gstNumber: {
    type: String,
  },
  panNumber: {
    type: String,
    required: [true, "PAN number is required"],
  },
  TDS: {
    type: Boolean,
  },
  TCS: {
    type: Boolean,
  },
  additionalInfo: {
    type: String,
  },
});

export const Business = mongoose.model("Business", businessSchema);
