import express from "express";
import {
  createPurchaseInvoice,
  deletePurchaseInvoice,
  getAllPurchaseInvoice,
  getPurchaseInvoiceById,
  getAllPurchaseInvoiceForAParty,
} from "../controllers/purchaseInvoice.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.route("/invoice/:id").get(isAuth, getPurchaseInvoiceById);
router.route("/party/:id").get(isAuth, getAllPurchaseInvoiceForAParty);
router.route("/:id").post(isAuth, createPurchaseInvoice);
router.route("/:id").get(isAuth, getAllPurchaseInvoice);
router.route("/:id").delete(isAuth, deletePurchaseInvoice);

export default router;
