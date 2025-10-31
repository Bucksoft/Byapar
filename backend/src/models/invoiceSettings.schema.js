import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  checked: { type: Boolean, default: false },
});

const invoiceSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    theme: { type: String, default: "Default" },
    selectedColor: { type: String, default: "#1D4ED8" },
    textColor: { type: String, default: "#000000" },
    options: [optionSchema],
  },
  { timestamps: true }
);

export const InvoiceSettings = mongoose.model(
  "InvoiceSettings",
  invoiceSettingsSchema
);
