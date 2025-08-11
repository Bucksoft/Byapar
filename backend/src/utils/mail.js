import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export async function sendOTPviaMail(to, otp) {
  await axios.post(
    "https://api.zeptomail.in/v1.1/email",
    {
      bounce_address: process.env.ZOHO_BOUNCE_ADDRESS,
      from: {
        address: process.env.ZOHO_MAIL_FROM,
        name: "Byapar",
      },
      to: [{ email_address: { address: to } }],
      subject: "Your One-Time Password (OTP) for Account Verification",
      htmlbody: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <h2 style="color: #333333;">Hello,</h2>
      <p style="color: #555555; font-size: 16px;">
        Use the following One-Time Password (OTP) to complete your verification:
      </p>
      <div style="font-size: 28px; font-weight: bold; color: #ffffff; background-color: #007BFF; padding: 12px 24px; border-radius: 6px; display: inline-block; letter-spacing: 3px;">
        ${otp}
      </div>
      <p style="color: #555555; font-size: 14px; margin-top: 20px;">
        This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone for your account security.
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      <p style="color: #888888; font-size: 12px;">
        If you did not request this OTP, you can safely ignore this email.
      </p>
    </div>
  </div>
          `,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Zoho-enczapikey ${process.env.ZOHO_API_KEY}`,
      },
    }
  );
}
