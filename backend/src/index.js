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
import { loginViaGoogleCallback } from "./controllers/user.controller.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: ["https://bb.bucksoftech.top"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/business", businessRoutes);
app.use("/api/v1/user", userRoutes);
app.get("/auth/google/callback", loginViaGoogleCallback);
app.use("/api/v1/parties", partyRoutes);
app.use("/api/v1/item", itemRoutes);
app.use("/api/v1/payment-in", paymentInRoutes);
app.use("/api/v1/sales-invoice", salesRoutes);
app.use("/api/v1/generate-pdf", pdfRoutes);
app.use("/api/v1/quotation", quotationRoutes);

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "../frontend/dist")));
// app.get("/*any", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
// });

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port :${PORT} ✅`);
});
