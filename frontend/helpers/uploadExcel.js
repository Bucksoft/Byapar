import { cleanKeys } from "./cleanKeys";
import Excel from "exceljs";

export async function uploadExcel(selectedFile) {
  const wb = new Excel.Workbook();
  const reader = new FileReader();

  // Wrap FileReader in a Promise
  const buffer = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(selectedFile);
  });

  // Load workbook
  const workbook = await wb.xlsx.load(buffer);
  const extractedData = [];

  workbook.eachSheet((sheet) => {
    let headers = [];

    sheet.eachRow((row, rowIndex) => {
      const rowValues = row.values;
      if (rowIndex === 1) {
        headers = rowValues.slice(1); // first row = headers
      } else {
        const rowData = {};
        rowValues.slice(1).forEach((cell, i) => {
          rowData[headers[i]] = cell ?? "";
        });
        extractedData.push(rowData);
      }
    });
  });

  const sanitizedData = cleanKeys(extractedData);
  return sanitizedData;
}
