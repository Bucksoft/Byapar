import nodemailer from "nodemailer";
import { HTMLtemplate } from "./constants.js";
import dotenv from "dotenv";
dotenv.config();
export async function sendOTPviaMail(to, otp) {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "bucksoftechpvtltd@gmail.com",
    to: `${to}`,
    subject: "🔐 Your Buck Softech OTP for Secure Sign-In",
    html: HTMLtemplate(otp),
  };  

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(`Error in sending mail : `, err);
    }
    console.log(`Email sent : `, info.response);
    return info.response;
  });
}
