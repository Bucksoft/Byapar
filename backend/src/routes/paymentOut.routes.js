import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  createPaymentOut,
  deletePaymentOut,
  getAllPaymentOutDetails,
  getSinglePaymentOutDetail,
} from "../controllers/paymentOutController.js";

const router = express.Router();
router.route("/all/:id").get(isAuth, getAllPaymentOutDetails);
router.route("/:id").post(isAuth, createPaymentOut);
router.route("/:id").get(isAuth, getSinglePaymentOutDetail);
router.route("/:id").delete(isAuth, deletePaymentOut);

export default router;
