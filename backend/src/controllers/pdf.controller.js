import puppeteer from "puppeteer";
export async function generatePdf(req, res) {
  try {
    const { html } = req.body;
    if (!html) {
      return res.status(400).json({ error: "HTML is required" });
    }

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=invoice.pdf",
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}
