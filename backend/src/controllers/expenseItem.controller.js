import mongoose from "mongoose";
import ExpenseItem from "../models/expenseItem.schema.js";
import ExpenseCategory from "../models/expenseCategory.schema.js";
import Expense from "../models/expenseSchema.js";

export async function createExpenseItem(req, res) {
  try {
    const businessId = req.query.businessId;
    const {
      itemName,
      purchasePrice,
      hsnSac,
      gstRate,
      measuringUnit,
      itemType,
      itc,
      taxType,
    } = req.body;

    if (!itemName) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide the item name" });
    }

    const existingItem = await ExpenseItem.findOne({
      itemName: { $regex: `^${itemName}$`, $options: "i" },
      businessId,
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ success: false, msg: "Item already exists" });
    }

    const expenseItem = await ExpenseItem.create({
      itemName: itemName.trim(),
      purchasePrice: Number(purchasePrice) || 0,
      hsnSac: hsnSac.trim(),
      gstRate: gstRate,
      measuringUnit: measuringUnit.trim(),
      itemType: itemType.trim(),
      itc: itc.trim(),
      taxType: taxType.trim(),
      businessId: new mongoose.Types.ObjectId(businessId),
      clientId: new mongoose.Types.ObjectId(req.user.id),
    });

    if (!expenseItem) {
      return res
        .status(400)
        .json({ success: false, msg: "Item could not be created" });
    }

    return res.status(200).json({
      success: true,
      msg: "Expense item created successfully",
      expenseItem,
    });
  } catch (error) {
    console.log("Error in creating expense item", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getAllExpenseItems(req, res) {
  try {
    const businessId = req.query?.businessId;
    const expenseItems = await ExpenseItem.find({
      businessId,
      clientId: req.user.id,
    });
    return res.status(200).json({ success: true, expenseItems });
  } catch (error) {
    console.log("Error in getting expense item", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function createExpenseCategory(req, res) {
  try {
    const { categoryName, expenseType } = req.body;
    if (!categoryName) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide the category name" });
    }

    const existingCategory = await ExpenseCategory.findOne({
      categoryName: { $regex: `^${categoryName}$`, $options: "i" },
      businessId: new mongoose.Types.ObjectId(req.query.businessId),
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, msg: "Category already exists" });
    }

    const expenseCategory = await ExpenseCategory.create({
      categoryName: categoryName.trim(),
      expenseType: expenseType.trim(),
      businessId: new mongoose.Types.ObjectId(req.query.businessId),
      clientId: new mongoose.Types.ObjectId(req.user.id),
    });

    if (!expenseCategory) {
      return res
        .status(400)
        .json({ success: false, msg: "Category could not be created" });
    }

    return res.status(200).json({
      success: true,
      msg: "Expense category created successfully",
      expenseCategory,
    });
  } catch (error) {
    console.log("Error in creating expense category", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getAllExpenseCategories(req, res) {
  try {
    const businessId = req.query?.businessId;
    const expenseCategories = await ExpenseCategory.find({
      businessId,
      clientId: req.user.id,
    });
    return res.status(200).json({ success: true, expenseCategories });
  } catch (error) {
    console.log("Error in getting all expense categories", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function createExpense(req, res) {
  try {
    if (!Array.isArray(req.body?.items) || req.body?.items?.length === 0) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide the items" });
    }

    const expense = await Expense.create({
      ...req.body,
      businessId: new mongoose.Types.ObjectId(req.query.businessId),
      clientId: new mongoose.Types.ObjectId(req.user?.id),
    });

    if (!expense) {
      return res
        .status(400)
        .json({ success: false, msg: "Expense could not be created" });
    }

    return res
      .status(201)
      .json({ success: true, msg: "Expense created successfully" });
  } catch (error) {
    console.log("Error in creating expense", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getAllExpenses(req, res) {
  try {
    const businessId = req.query?.businessId;
    const latestExpense = await Expense.findOne({
      businessId,
    })
      .sort("-expenseNumber")
      .limit(1);

    const expenses = await Expense.find({
      $and: [{ businessId: businessId, clientId: req?.user?.id }],
    }).populate("items expenseCategory");

    return res.status(200).json({
      success: true,
      expenses,
      totalExpenses: expenses.length,
      latestExpenseNumber: latestExpense?.expenseNumber || 0,
    });
  } catch (error) {
    console.log("Error in getting all expenses", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function deleteExpenseItem(req, res) {
  try {
    const { id } = req.params;
    const businessId = req.query?.businessId;

    // delete item which matches id and business id both
    const expenseItem = await ExpenseItem.deleteOne({
      _id: id,
      businessId,
    });

    if (!expenseItem) {
      return res
        .status(400)
        .json({ success: false, msg: "Expense item could not be deleted" });
    }

    return res
      .status(200)
      .json({ success: true, msg: "Expense item deleted successfully" });
  } catch (error) {
    console.log("Error in deleting all expenses", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
