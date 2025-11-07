import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  createExpenseItem,
  getAllExpenseItems,
  createExpenseCategory,
  getAllExpenseCategories,
  createExpense,
  getAllExpenses,
} from "../controllers/expenseItem.controller.js";

const router = express.Router();

router.route("/item").post(isAuth, createExpenseItem);
router.route("/category").post(isAuth, createExpenseCategory);
router.route("/").post(isAuth, createExpense);
router.route("/").get(isAuth, getAllExpenses);
router.route("/items").get(isAuth, getAllExpenseItems);
router.route("/category").get(isAuth, getAllExpenseCategories);

export default router;
