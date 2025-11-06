import toast from "react-hot-toast";
import { axiosInstance } from "../src/config/axios";

export async function sendWhatsapp(
  invoiceId,
  phoneNumbers,
  setIsSending,
  businessName,
  partyName,
  invoiceAmount,
  modalId
) {
  try {
    const input = document.getElementById(invoiceId);
    const element = input.outerHTML;
    setIsSending(true);
    const fullHTML = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                body {
                font-family: 'Inter', sans-serif;
                font-size: 10px;
                line-height: 1.3;
                margin: 0;
                padding: 0;
                background-color: #fff;
                }
                table {
                border-collapse: collapse;
                width: 100%;
                }
                th, td {
                padding: 4px 6px;
                text-align: left;
                }
                h1, h2, h3, h4, h5, h6, p {
                margin: 2px 0;
                }
                img {
                max-width: 100%;
                height: auto;
                }
            .nowrap {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            </style>
            </head>
            <body>
            ${element}
            </body>
        </html>
    `;

    const response = await axiosInstance.post(
      "/sales-invoice/send-whatsapp",
      {
        html: fullHTML,
        phoneNumbers: phoneNumbers,
        businessName,
        partyName,
        invoiceAmount,
      },
      { responseType: "blob" }
    );
    toast.success("Invoice sent successfully");
  } catch (error) {
    console.log("Error in sending whatsapp", error);
  } finally {
    setIsSending(false);
    document.getElementById(modalId)?.close();
  }
}
