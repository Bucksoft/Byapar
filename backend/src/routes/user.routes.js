import express from "express";
import {
  getUserCredential,
  googleOAuthRedirection,
  login,
  logoutUser,
  refreshToken,
  updateUserAccount,
  verifyOTP,
} from "../controllers/user.controller.js";
import dotenv from "dotenv";
import { isAuth } from "../middleware/auth.middleware.js";
dotenv.config();

const router = express.Router();

router.route("/login").post(login);
router.route("/verify-otp").post(verifyOTP);
router.route("/").get(googleOAuthRedirection);
router.route("/me").get(isAuth, getUserCredential);
router.route("/logout").post(isAuth, logoutUser);
router.route("/").patch(isAuth, updateUserAccount);
router.route("/refresh").get(refreshToken);

export default router;
