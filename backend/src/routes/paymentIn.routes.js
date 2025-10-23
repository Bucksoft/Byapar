import express from "express";
import {
  createPaymentIn,
  deletePaymentIn,
  getAllPaymentInDetails,
  getSinglePaymentInDetail,
  updatePaymentIn,
  getAllPaymentInsForAParty,
} from "../controllers/paymentIn.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/all/:id", isAuth, getAllPaymentInDetails);
router.patch("/:businessId/:id", isAuth, updatePaymentIn);
router.route("/party/:id").get(isAuth, getAllPaymentInsForAParty);
router.post("/:id", isAuth, createPaymentIn);
router.get("/:id", isAuth, getSinglePaymentInDetail);
router.delete("/:id", isAuth, deletePaymentIn);

export default router;
