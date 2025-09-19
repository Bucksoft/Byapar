export const handlePrint = (ref) => {
  const html = ref.current.innerHTML;
  const printWindow = window.open("", "", "height=1000, width=1000");
  printWindow.document.write("<html><head><title>Print</title></head><body>");
  printWindow.document.write(html);
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
};
