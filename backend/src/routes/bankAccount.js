import express from "express";
import { createBankAccount } from "../controllers/bankAccount.controller.js";

const router = express.Router();
router.route("/").post(createBankAccount);

export default router;
