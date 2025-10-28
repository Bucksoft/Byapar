import express from "express";
import {
  createBankAccount,
  createBankAccountForBusiness,
  deleteBusinessBankAccount,
  getBusinessBankAccounts,
  getSinglePartyBankDetails,
  deletePartyBankAccount,
  markBusinessBankAccountAsActive,
  updateBankAccountDetails,
} from "../controllers/bankAccount.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").patch(isAuth, createBankAccount);
router
  .route("/mark-as-active/:id")
  .patch(isAuth, markBusinessBankAccountAsActive);

router.route("/account").patch(isAuth, updateBankAccountDetails);
router.route("/party/:id").get(isAuth, getSinglePartyBankDetails);
router.route("/:id").post(isAuth, createBankAccountForBusiness);
router.route("/:id").get(isAuth, getBusinessBankAccounts);
router.route("/:id").delete(isAuth, deleteBusinessBankAccount);
router.route("/party/:id").delete(isAuth, deletePartyBankAccount);

export default router;
