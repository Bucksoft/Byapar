import express from "express";
import {
  createSalesInvoice,
  deleteInvoice,
  getAllInvoices,
  getInvoiceById,
} from "../controllers/salesInvoice.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

router.route("/").post(isAuth, createSalesInvoice);
router.route("/").get(isAuth, getAllInvoices);
router.route("/:id").delete(isAuth, deleteInvoice);
router.route("/:id").get(isAuth, getInvoiceById);

export default router;
