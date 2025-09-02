import express from "express";
import { generatePdf } from "../controllers/pdf.controller.js";

const router = express.Router();

router.post("/", generatePdf);

export default router;
