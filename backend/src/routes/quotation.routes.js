import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  createQuotation,
  getQuotationById,
} from "../controllers/quotation.controller.js";

const router = express.Router();

router.route("/").post(isAuth, createQuotation);
router.route("/:id").get(isAuth, getQuotationById);

export default router;
