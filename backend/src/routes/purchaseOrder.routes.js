import express from "express";
import {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
} from "../controllers/purchaseOrder.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.route("/invoice/:id").get(isAuth, getPurchaseOrderById);
router.route("/:id").post(isAuth, createPurchaseOrder);
router.route("/:id").get(isAuth, getAllPurchaseOrders);

export default router;
