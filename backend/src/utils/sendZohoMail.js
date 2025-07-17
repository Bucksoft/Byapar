import axios from "axios";
export const sendZohoMail = async ({ to, subject, body, from }) => {
  try {
    const response = await axios.post(
      `https://mail.zoho.in/api/accounts/${account_id}/messages`,
      {
        fromAddress: from,
        toAddress: to,
        subject: subject,
        content: body,
        mailFormat: "html",
      },
      {
        headers: {
          Authorization: `Zoho-enczapikey ${process.env.ZOHO_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Email sent successfully`, response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to send mail", error);
    throw error;
  }
};
