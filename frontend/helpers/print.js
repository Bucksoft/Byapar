export const handlePrint = (ref) => {
  const html = ref.current.innerHTML;
  // const printWindow = window.open("", "");
  // printWindow.document.write("<html><head><title>Print</title></head><body>");
  // printWindow.document.write(html);
  // printWindow.document.write("</body></html>");
  // printWindow.document.close();
  window.print();
};
