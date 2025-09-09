import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  createQuotation,
  getAllQuotations,
  getQuotationById,
} from "../controllers/quotation.controller.js";

const router = express.Router();

router.route("/:id").post(isAuth, createQuotation);
router.route("/:id").get(isAuth, getQuotationById);
router.route("/all/:id").get(isAuth, getAllQuotations);

export default router;
