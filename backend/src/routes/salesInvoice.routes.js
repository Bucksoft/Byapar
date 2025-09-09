import express from "express";
import {
  createSalesInvoice,
  deleteInvoice,
  getAllInvoices,
  getInvoiceById,
} from "../controllers/salesInvoice.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

router.route("/:id").post(isAuth, createSalesInvoice);
router.route("/:id").get(isAuth, getAllInvoices);
router.route("/:id").delete(isAuth, deleteInvoice);
router.route("/invoice/:id").get(isAuth, getInvoiceById);

export default router;
