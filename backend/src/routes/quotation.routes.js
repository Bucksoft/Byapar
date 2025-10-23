import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  createQuotation,
  deleteQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  getAllQuotationsOfAParty,
} from "../controllers/quotation.controller.js";

const router = express.Router();

router.route("/all/:id").get(isAuth, getAllQuotations);
router.route("/:businessId/:id").patch(isAuth, updateQuotation);
router.route("/party/:id").get(isAuth, getAllQuotationsOfAParty);
router.route("/:id").post(isAuth, createQuotation);
router.route("/:id").get(isAuth, getQuotationById);
router.route("/:id").delete(isAuth, deleteQuotation);

export default router;
