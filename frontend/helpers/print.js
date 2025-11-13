export const handlePrint = (ref) => {
  const html = ref.current.innerHTML;
  // const printWindow = window.open("", "");
  // printWindow.document.write("<html><head><title>Print</title></head><body>");
  // printWindow.document.write(html);
  // printWindow.document.write("</body></html>");
  // printWindow.document.close();
  window.print();
};

export const handlePaymentPrint = (ref) => {
  if (!ref?.current) return;

  const html = ref.current.innerHTML;
  const printWindow = window.open("", "_blank", "width=800,height=600");

  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          @page { size: auto; margin: 10mm; }
          body { font-family: sans-serif; padding: 20px; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  // Wait for the content to load before printing
  printWindow.onload = function () {
    printWindow.print();
    printWindow.close();
  };
};
