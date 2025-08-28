import { loginSchema } from "../config/validation.js";
import crypto from "crypto";
import { sendOTPviaMail } from "../utils/mail.js";
import { OTP } from "../models/otp.schema.js";
import jwt from "jsonwebtoken";
import { UserCredential } from "../models/user.schema.js";
import axios from "axios";

// login user via email and OTP
export async function login(req, res) {
  try {
    // get data
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: "Failed", err: "Email not provided" });
    }

    // validation
    const result = loginSchema.safeParse({
      email,
    });

    if (!result.success) {
      const errors = result.error.format();
      return res
        .status(400)
        .json({ status: "Failed", err: "Invalid email address", errors });
    }

    // check if user already exists

    // login logic
    // 1. generate OTP - 6 digits
    const otp = crypto.randomInt(100000, 1000000).toString();
    await OTP.create({
      email,
      otp,
      expiresIn: Date.now() + 5 * 60 * 1000,
    });
    // 2. Send OTP via email to user.
    await sendOTPviaMail(email, otp);

    return res.status(200).json({
      status: "success",
      message: `Login request received for ${email} and OTP sent`,
    });
  } catch (error) {
    console.error(`Internal Server error : ${error}`);
    return res
      .status(500)
      .json({ status: "Failed", err: "Internal Server Error" });
  }
}

// verify otp and save user in DB.
export async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;
    const result = loginSchema.safeParse({
      email,
    });

    if (!result.success) {
      const errors = result.error.format();
      return res
        .status(400)
        .json({ status: "Failed", err: "Validation failed", errors });
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res
        .status(400)
        .json({ status: "Failed", err: "Invalid or expired OTP" });
    }

    if (otpRecord.expiresIn < Date.now()) {
      await OTP.deleteMany({ email });
      return res.status(400).json({ status: "Failed", err: "OTP expired!" });
    }

    // delete OTP
    await OTP.deleteMany({ email });

    // save user in DB
    let user = await UserCredential.findOne({ email });
    if (!user) {
      user = await UserCredential.create({
        email,
        loginBy: "email",
        userCode: "email",
        last_login: Date.now(),
      });
    } else {
      user.last_login = Date.now();
      await user.save();
    }

    // generate jwt token
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ status: "Success", msg: "Logged in successfully", user });
  } catch (error) {
    console.error(`Internal Server error : ${error}`);
    res.status(500).json({ status: "Failed", err: "Internal Server Error" });
  }
}

// google authentication ********************************************************************

export async function googleOAuthRedirection(req, res) {
  try {
    const googleAuthURL =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: `${process.env.BACKEND_URI}/auth/google/callback`,
        response_type: "code",
        scope: "profile email",
        access_type: "offline",
        prompt: "consent",
      });
    res.redirect(googleAuthURL);
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ msg: "Something went wrong while logging with Google" });
  }
}

export async function loginViaGoogleCallback(req, res) {
  try {
    const code = req.query.code;
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${process.env.BACKEND_URI}/auth/google/callback`,
          grant_type: "authorization_code",
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = tokenRes.data.access_token;
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // save user in DB
    let user = await UserCredential.findOne({ email: userRes.data.email });
    if (!user) {
      user = await UserCredential.create({
        email: userRes.data.email,
        loginBy: "google",
        userCode: "email",
        last_login: Date.now(),
      });
    } else {
      user.last_login = Date.now();
      await user.save();
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.redirect(`${process.env.FRONTEND_URI}/dashboard`);
  } catch (error) {
    console.log("ERROR IN AUTHENTICATING USER VIA GOOGLE CALLBACK : ", error);
    return res.status(500).json({ msg: "Authentication failed" });
  }
}

// google authentication ends *********************************************************************

// get user profile details
export async function getUserCredential(req, res) {
  try {
    const id = req.user?.id;
    const user = await UserCredential.findById(id);
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("ERROR IN FETCHING USER DETAILS : ", error);
    return res.status(500).json({ msg: "Failed to fetch user details" });
  }
}

// logout user
export async function logoutUser(req, res) {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ success: true, msg: "User logged out successfully" });
  } catch (error) {
    console.log("ERROR IN LOGGING OUT USER : ", error);
    return res.status(500).json({ msg: "Failed to logout user" });
  }
}
