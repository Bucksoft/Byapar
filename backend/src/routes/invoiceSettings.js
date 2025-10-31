import express from "express";
import {
  saveInvoiceSettings,
  getInvoiceSettings,
} from "../controllers/invoiceSettings.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Save or update invoice settings
router.post("/settings", isAuth, saveInvoiceSettings);

// Get invoice settings for a user
router.get("/settings/:theme", isAuth, getInvoiceSettings);

export default router;
