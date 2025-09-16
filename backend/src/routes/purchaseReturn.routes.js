import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import { createPurchaseReturn } from "../controllers/purchaseRetrun.controller.js";

const router = express.Router();

// router.route("/return/:id").get(isAuth, getPurchaseReturnById);
router.route("/:id").post(isAuth, createPurchaseReturn);
// router.route("/:id").get(isAuth, getAllPurchaseReturn);
// router.route("/:id").delete(isAuth, deletePurchaseReturn);

export default router;
