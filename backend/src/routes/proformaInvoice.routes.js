import express from "express";
import {
  createProformaInvoice,
  deleteProformaInvoice,
  getAllProformaInvoices,
  getProformaById,
} from "../controllers/proformaInvoice.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.route("/invoice/:id").get(isAuth, getProformaById);
router.route("/:id").post(isAuth, createProformaInvoice);
router.route("/:id").get(isAuth, getAllProformaInvoices);
router.route("/:id").delete(isAuth, deleteProformaInvoice);

export default router;
