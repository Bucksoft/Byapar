export const HTMLtemplate = (otp) => {
  return `
<div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
      <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; text-align: center;">Welcome to Buck Softech</h2>
        <p style="font-size: 16px; color: #555;">
          Use the following One-Time Password (OTP) to sign in to your account. This OTP is valid for the next 10 minutes. Please do not share it with anyone.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background: #fca400; color: white; padding: 15px 30px; font-size: 24px; border-radius: 6px; letter-spacing: 4px;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #888;">
          If you did not request this OTP, please ignore this email or contact our support team.
        </p>
        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 40px;">
          — Buck Softech Pvt. Ltd.
        </p>
      </div>
    </div>
`;
};
