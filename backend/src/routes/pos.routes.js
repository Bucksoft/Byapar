import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import { createPOS } from "../controllers/pos.controller.js";

const router = express.Router();

router.route("/").post(isAuth, createPOS);

export default router;
