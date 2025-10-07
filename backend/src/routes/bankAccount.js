import express from "express";
import {
  createBankAccount,
  createBankAccountForBusiness,
  deleteBusinessBankAccount,
  getBusinessBankAccounts,
} from "../controllers/bankAccount.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.route("/").post(isAuth, createBankAccount);
router.route("/:id").post(isAuth, createBankAccountForBusiness);
router.route("/:id").get(isAuth, getBusinessBankAccounts);
router.route("/:id").delete(isAuth, deleteBusinessBankAccount);

export default router;
