import pdf from "html-pdf-node";

export async function generatePdf(req, res) {
  try {
    const { html } = req.body;
    if (!html) {
      return res.status(400).json({ error: "HTML is required" });
    }

    // Wrap HTML in a proper document
    const finalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Invoice</title>
          <style>
            @page { size: A4; margin: 10mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .invoice-container { width: 100%; max-width: 1000px; margin: auto; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${html}
          </div>
        </body>
      </html>
    `;

    const file = { content: finalHtml };

    // Generate PDF
    const pdfBuffer = await pdf.generatePdf(file, {
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

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
