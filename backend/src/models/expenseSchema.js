import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  expenseDate: {
    type: String,
  },
  expenseNumber: {
    type: Number,
  },
  expenseCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExpenseCategory",
    required: [true, "Expense category is required"],
  },
  paymentMode: {
    type: String,
  },
  note: {
    type: String,
  },
  expenseWithGST: {
    type: Boolean,
    default: false,
  },
  items: [
    {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      required: true,
    },
  ],
  totalAmount: {
    type: Number,
    default: 0,
  },
  totalTax: {
    type: Number,
    default: 0,
  },
  totalQuantity: {
    type: Number,
    default: 0,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCredential",
  },
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
