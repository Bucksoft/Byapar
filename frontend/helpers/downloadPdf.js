import { axiosInstance } from "../src/config/axios";

export const downloadPDF = async (id, title = "invoice", setIsDownloading) => {
  try {
    setIsDownloading(true);
    const input = document.getElementById(id);
    const element = input.outerHTML;

    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <!-- Tailwind CDN (or your built CSS path) -->
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          ${element}
        </body>
      </html>
    `;

    const response = await axiosInstance.post(
      "/generate-pdf",
      { html: fullHTML },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading PDF:", error);
  } finally {
    setIsDownloading(false);
  }
};
