import mongoose from "mongoose";

const partySchema = new mongoose.Schema({
  party_name: {
    type: String,
    required: [true, "Party name is required"],
  },
  mobile_number: {
    type: Number,
    required: [true, "Mobile number is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  opening_balance: {
    type: String,
    default: "0",
  },
  opening_balance_type: {
    type: String,
    enum: ["to_collect", "to_pay"],
    default: "to_collect",
  },
  GSTIN: {
    type: String,
    required: true,
    unique: true,
  },
  PAN_no: {
    type: String,
    required: true,
    unique: true,
  },
  party_type: {
    type: String,
    enum: ["customer", "supplier"],
    default: "customer",
  },
  category_name: {
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
  billing_address: {
    type: String,
    required: true,
  },
  shipping_address: {
    type: String,
    required: true,
  },
  credit_period: {
    type: Date,
    default: Date.now,
  },
  credit_limit: {
    type: String,
    required: true,
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCredential",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  flag: {
    type: String,
    default: "",
  },
});

const Party = mongoose.model("Party", partySchema);
export default Party;
