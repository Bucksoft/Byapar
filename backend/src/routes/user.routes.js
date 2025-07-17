import express from "express";
import { login, verifyOTP } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/verify-otp").post(verifyOTP);

export default router;
