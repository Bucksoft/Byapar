import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import partyRoutes from "./routes/party.routes.js";
import businessRoutes from "./routes/business.routes.js";
import paymentInRoutes from "./routes/paymentIn.routes.js";
import { loginViaGoogleCallback } from "./controllers/user.controller.js";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/business", businessRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/auth/google/callback", loginViaGoogleCallback);
app.use("/api/v1/parties", partyRoutes);
app.use("/api/v1/payment-in", paymentInRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(
    `Server is running on port : https://srv624601.hstgr.cloud/Bharat-Chatbot-backend:${PORT}`
  );
});
