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
