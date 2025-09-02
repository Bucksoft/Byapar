import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { axiosInstance } from "../src/config/axios";

export const downloadPDF = async (id) => {
  try {
    const input = document.getElementById(id);
    const element = input.outerHTML;
    const response = await axiosInstance.post(
      "/generate-pdf",
      { html: element },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
};
