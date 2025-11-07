import mongoose from "mongoose";

const expenseCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
  },
  expenseType: {
    type: String,
    default: "direct_expense",
    enum: ["direct_expense", "indirect_expense"],
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

const ExpenseCategory = mongoose.model(
  "ExpenseCategory",
  expenseCategorySchema
);
export default ExpenseCategory;
