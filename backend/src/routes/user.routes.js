import express from "express";
import {
  getUserCredential,
  googleOAuthRedirection,
  login,
  logoutUser,
  updateUserAccount,
  verifyOTP,
} from "../controllers/user.controller.js";
import dotenv from "dotenv";
import { isAuth } from "../middleware/auth.middleware.js";
dotenv.config();

const router = express.Router();

router.route("/login").post(login);
router.route("/verify-otp").post(verifyOTP);
router.route("/oauth").get(googleOAuthRedirection);
router.route("/me").get(isAuth, getUserCredential);
router.route("/logout").post(isAuth, logoutUser);
router.route("/account").patch(isAuth, updateUserAccount);

export default router;
