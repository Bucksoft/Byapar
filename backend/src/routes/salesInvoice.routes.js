import express from "express";
import {
  bulkUploadSalesInvoices,
  createSalesInvoice,
  deleteInvoice,
  getAllInvoices,
  getInvoiceById,
  updatedSalesInvoice,
  getAllInvoicesForAParty,
  getSalesDataForChart,
  sendInvoiceViaEmail,
  sendInvoiceViaWhatsapp,
  generateQrCode,
  getWhatsappStatus,
} from "../controllers/salesInvoice.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

router.route("/invoice/:id").get(isAuth, getInvoiceById);
router.route("/chart/:id").get(isAuth, getSalesDataForChart);
router.route("/bulk/:businessId").post(isAuth, bulkUploadSalesInvoices);
router.route("/qr").post(isAuth, generateQrCode);
router.route("/send-email").post(isAuth, sendInvoiceViaEmail);
router.route("/send-whatsapp").post(isAuth, sendInvoiceViaWhatsapp);
router.route("/whatsapp-status").get(isAuth, getWhatsappStatus);
router.route("/:businessId/:id").patch(isAuth, updatedSalesInvoice);
router.route("/:id").post(isAuth, createSalesInvoice);
router.route("/:id").get(isAuth, getAllInvoices);
router.route("/:id").delete(isAuth, deleteInvoice);
router.route("/party/:id").get(isAuth, getAllInvoicesForAParty);

export default router;
