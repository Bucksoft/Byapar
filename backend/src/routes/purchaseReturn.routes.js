import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  createPurchaseReturn,
  deletePurchaseReturn,
  getAllPurchaseReturn,
  getPurchaseReturnById,
  getAllPurchaseReturnOfAParty,
} from "../controllers/purchaseRetrun.controller.js";

const router = express.Router();

router.route("/:id").post(isAuth, createPurchaseReturn);
router.route("/return/:id").get(isAuth, getPurchaseReturnById);
router.route("/:id").get(isAuth, getAllPurchaseReturn);
router.route("/:id").delete(isAuth, deletePurchaseReturn);
router.route("/party/:id").get(isAuth, getAllPurchaseReturnOfAParty);

export default router;
