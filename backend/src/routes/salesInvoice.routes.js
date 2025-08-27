import express from "express";
import { createSalesInvoice } from "../controllers/salesInvoice.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

router.route("/").post(isAuth, createSalesInvoice);

export default router;
