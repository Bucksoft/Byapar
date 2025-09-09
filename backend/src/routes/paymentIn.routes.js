import express from "express";
import {
  createPaymentIn,
  deletePaymentIn,
  getAllPaymentInDetails,
  getSinglePaymentInDetail,
} from "../controllers/paymentIn.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/all/:id", isAuth, getAllPaymentInDetails);
router.post("/:id", isAuth, createPaymentIn);
router.get("/:id", isAuth, getSinglePaymentInDetail);
router.delete("/:id", isAuth, deletePaymentIn);

export default router;
