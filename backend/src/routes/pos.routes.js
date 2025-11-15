import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  createPOS,
  getAllPOS,
  getPOSById,
} from "../controllers/pos.controller.js";

const router = express.Router();

router.route("/").post(isAuth, createPOS);
router.route("/").get(isAuth, getAllPOS);
router.route("/invoice/:id").get(isAuth, getPOSById);

export default router;
