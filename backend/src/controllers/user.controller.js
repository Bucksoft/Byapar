import { loginSchema, userAccountSchema } from "../config/validation.js";
import crypto from "crypto";
import { sendOTPviaMail } from "../utils/mail.js";
import { OTP } from "../models/otp.schema.js";
import jwt from "jsonwebtoken";
import { UserCredential } from "../models/user.schema.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URI = process.env.FRONTEND_URI;
const BACKEND_URI = process.env.BACKEND_URI;

// login user via email and OTP
export async function login(req, res) {
  try {
    // get data
    let { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: "Failed", err: "Email not provided" });
    }

    // Always normalize to lowercase
    email = email.trim().toLowerCase();

    // validation
    const result = loginSchema.safeParse({ email });
    if (!result.success) {
      const errors = result.error.format();
      return res
        .status(400)
        .json({ status: "Failed", err: "Invalid email address", errors });
    }

    // delete any old OTPs for this email to prevent clutter
    await OTP.deleteMany({ email });

    // generate 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    await OTP.create({
      email,
      otp,
      expiresIn: Date.now() + 10 * 60 * 1000, // 10 min validity
    });

    // send OTP via email
    await sendOTPviaMail(email, otp);

    console.log("Generated OTP:", otp);

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

export async function verifyOTP(req, res) {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ status: "Failed", err: "Email or OTP missing" });
    }

    // Always normalize to lowercase
    email = email.trim().toLowerCase();

    const result = loginSchema.safeParse({ email });
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

    // Find or create user (always use lowercase email)
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

    // generate JWT tokens
    const accessToken = jwt.sign(
      { id: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // send cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "Success",
      msg: "Logged in successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    console.error(`Internal Server error : ${error}`);
    res.status(500).json({ status: "Failed", err: "Internal Server Error" });
  }
}

// google authentication ********************************************************************
export async function googleOAuthRedirection(req, res) {
  try {
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${BACKEND_URI}/api/v1/user/google/callback&response_type=code&scope=openid%20email%20profile`;

    res.redirect(redirectUrl);
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
    if (!code) return res.status(400).send("Missing code parameter");

    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `https://backend.byaparsetu.com/api/v1/user/google/callback`,
      grant_type: "authorization_code",
    });

    const { id_token, access_token } = tokenRes.data;

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
    );
    const userData = userRes.data;

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

    // generate jwt token
    const accessToken = jwt.sign(
      { id: user._id, email: userRes.data.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: userRes.data.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${FRONTEND_URI}/dashboard`);
  } catch (error) {
    console.log("ERROR IN AUTHENTICATING USER VIA GOOGLE CALLBACK : ", error);
    return res.status(500).json({ msg: "Authentication failed", error });
  }
}

// google authentication ends *********************************************************************

// refresh token endpoint
export async function refreshToken(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ msg: "Refresh token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid refresh token" });

    // generate new access token
    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000,
    });
    return res.json({ status: "Success", msg: "Access token refreshed" });
  });
}

// get user profile details
export async function getUserCredential(req, res) {
  try {
    const id = req.user?.id;
    const user = await UserCredential.findById(id).populate("activeBusinessId");
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
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ success: true, msg: "User logged out successfully" });
  } catch (error) {
    console.log("ERROR IN LOGGING OUT USER : ", error);
    return res.status(500).json({ msg: "Failed to logout user" });
  }
}

// update user account
export async function updateUserAccount(req, res) {
  try {
    const validationResult = userAccountSchema.safeParse(req.body.data);
    if (!validationResult.success) {
      const errors = validationResult.error.format();
      return res.status(400).json({ success: false, errors });
    }

    const user = await UserCredential.findById(req?.user?.id);
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }
    user.name = validationResult.data.name;
    user.email = validationResult.data.email;
    user.contact = validationResult.data.contact;

    await user.save();

    return res
      .status(200)
      .json({ success: true, msg: "Account updated successfully", user });
  } catch (error) {
    console.log("ERROR IN UPDATING USER : ", error);
    return res.status(500).json({ msg: "Failed to update user" });
  }
}

export async function masterLogin(req, res) {
  try {
    const { email, secretKey } = req.body;
    if (secretKey.toLowerCase() !== "byaparmastersetu") {
      return res.status(400).json({ msg: "Invalid secret key" });
    }
    const user = await UserCredential.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    return res.status(200).json({ msg: "Master login successful", user });
  } catch (error) {
    return res.status(500).json({ msg: "Error in logging to master" });
  }
}

export async function resendOTP(req, res) {
  try {
    const { email } = req.body;
    console.log(req.body);
    // generate 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    await OTP.create({
      email,
      otp,
      expiresIn: Date.now() + 60 * 1000, // 1 min validity
    });
    await sendOTPviaMail(email, otp);
    console.log(otp);

    return res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error in logging to master" });
  }
}
