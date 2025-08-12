import express from "express";
import {
  googleOAuthRedirection,
  login,
  loginViaGoogleCallback,
  verifyOTP,
} from "../controllers/user.controller.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.route("/login").post(login);
router.route("/verify-otp").post(verifyOTP);
router.route("/").get(googleOAuthRedirection);

export default router;
