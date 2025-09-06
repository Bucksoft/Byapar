import express from "express";
import {
  createPaymentIn,
  deletePaymentIn,
  getAllPaymentInDetails,
  getSinglePaymentInDetail,
} from "../controllers/paymentIn.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/", isAuth, createPaymentIn);
router.get("/", isAuth, getAllPaymentInDetails);
router.get("/:id", isAuth, getSinglePaymentInDetail);
router.delete("/:id", isAuth, deletePaymentIn);

export default router;
