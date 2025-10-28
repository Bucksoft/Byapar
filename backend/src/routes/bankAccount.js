import express from "express";
import {
  createBankAccount,
  createBankAccountForBusiness,
  deleteBusinessBankAccount,
  getBusinessBankAccounts,
  getSinglePartyBankDetails,
  deletePartyBankAccount,
  markBusinessBankAccountAsActive,
} from "../controllers/bankAccount.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();


router.route("/").post(isAuth, createBankAccount);

router
  .route("/mark-as-active/:id")
  .patch(isAuth, markBusinessBankAccountAsActive);

router.route("/party/:id").get(isAuth, getSinglePartyBankDetails);
router.route("/:id").post(isAuth, createBankAccountForBusiness);
router.route("/:id").get(isAuth, getBusinessBankAccounts);
router.route("/:id").delete(isAuth, deleteBusinessBankAccount);
router.route("/party/:id").delete(isAuth, deletePartyBankAccount);

export default router;
