import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  createSalesReturn,
  deleteSaleReturn,
  getAllSalesReturn,
  getSaleReturnById,
} from "../controllers/salesReturn.controller.js";

const router = express.Router();

router.route("/:id").post(isAuth, createSalesReturn);
router.route("/:id").get(isAuth, getAllSalesReturn);
router.route("/:id").delete(isAuth, deleteSaleReturn);
router.route("/return/:id").get(isAuth, getSaleReturnById);

export default router;
