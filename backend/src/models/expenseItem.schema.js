import mongoose from "mongoose";

export const expenseItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
    },
    hsnSac: {
      type: String,
    },
    purchasePrice: {
      type: Number,
    },
    itc: {
      type: String,
      default: "eligible",
    },
    itemType: {
      type: String,
      default: "product",
      enum: ["product", "service"],
    },
    measuringUnit: {
      type: String,
    },
    gstRate: {
      type: String,
    },
    taxType: {
      type: String,
      default: "without_tax",
      enum: ["with_tax", "without_tax"],
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCredential",
    },
  },
  { timestamps: true }
);

const ExpenseItem = mongoose.model("ExpenseItem", expenseItemSchema);
export default ExpenseItem;
