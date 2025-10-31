import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import partyRoutes from "./routes/party.routes.js";
import businessRoutes from "./routes/business.routes.js";
import paymentInRoutes from "./routes/paymentIn.routes.js";
import itemRoutes from "./routes/item.route.js";
import salesRoutes from "./routes/salesInvoice.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import quotationRoutes from "./routes/quotation.routes.js";
import salesReturnRoutes from "./routes/salesReturn.routes.js";
import creditNoteRoutes from "./routes/creditNote.routes.js";
import deliveryChallanRoutes from "./routes/delivery-challan.routes.js";
import proformaInvoiceRoutes from "./routes/proformaInvoice.routes.js";
import purchaseInvoiceRoutes from "./routes/purchaseInvoice.routes.js";
import paymentOutRoutes from "./routes/paymentOut.routes.js";
import purchaseReturnRoutes from "./routes/purchaseReturn.routes.js";
import purchaseOrderRoutes from "./routes/purchaseOrder.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import debitNoteRoutes from "./routes/debitNote.route.js";
import bankAccountRoutes from "./routes/bankAccount.js";
import invoiceSettingsRoutes from "./routes/invoiceSettings.js";
import { loginViaGoogleCallback } from "./controllers/user.controller.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: [
      "https://byapar-frontend.onrender.com",
      "http://localhost:5173",
      "https://byapar.bucksoftech.top/",
      "https://byaparsetu.com",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
// app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/health", (req, res) => {
  res.status(200).json({
    msg: "server is healthy",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1/business", businessRoutes);
app.use("/api/v1/user", userRoutes);
app.get("/auth/google/callback", loginViaGoogleCallback);
app.use("/api/v1/parties", partyRoutes);
app.use("/api/v1/item", itemRoutes);
app.use("/api/v1/payment-in", paymentInRoutes);
app.use("/api/v1/sales-invoice", salesRoutes);
app.use("/api/v1/generate-pdf", pdfRoutes);
app.use("/api/v1/quotation", quotationRoutes);
app.use("/api/v1/sales-return", salesReturnRoutes);
app.use("/api/v1/credit-note", creditNoteRoutes);
app.use("/api/v1/delivery-challan", deliveryChallanRoutes);
app.use("/api/v1/proforma-invoice", proformaInvoiceRoutes);
app.use("/api/v1/purchase-invoice", purchaseInvoiceRoutes);
app.use("/api/v1/payment-out", paymentOutRoutes);
app.use("/api/v1/purchase-return", purchaseReturnRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/purchase-order", purchaseOrderRoutes);
app.use("/api/v1/debit-note", debitNoteRoutes);
app.use("/api/v1/bank-account", bankAccountRoutes);
app.use("/api/v1/invoiceTheme", invoiceSettingsRoutes);

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "../frontend/dist")));
// app.get("/*any", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
// });

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port :${PORT} ✅`);
});
