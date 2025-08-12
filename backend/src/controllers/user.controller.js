import { loginSchema } from "../config/validation.js";
import crypto from "crypto";
import { sendOTPviaMail } from "../utils/mail.js";
import { OTP } from "../models/otp.schema.js";
import jwt from "jsonwebtoken";
import { UserCredential } from "../models/user.schema.js";

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
    res.status(500).json({ status: "Failed", err: "Internal Server Error" });
    console.error(`Internal Server error : ${error}`);
  }
}
