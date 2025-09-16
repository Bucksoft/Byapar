import express from "express";
import {
  createDeliveryChallan,
  deleteDeliveryChallan,
  getAllDeliveryChallan,
  getChallanById,
} from "../controllers/deliveryChallan.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/invoice/:id").get(isAuth, getChallanById);
router.route("/:id").post(isAuth, createDeliveryChallan);
router.route("/:id").get(isAuth, getAllDeliveryChallan);
router.route("/:id").delete(isAuth, deleteDeliveryChallan);

export default router;
