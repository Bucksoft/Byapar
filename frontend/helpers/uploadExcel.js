import { cleanKeys } from "./cleanKeys";
import Excel from "exceljs";
import * as XLSX from "@e965/xlsx";

export async function uploadExcel(selectedFile) {
  // const wb = new Excel.Workbook();
  // const reader = new FileReader();

  // // Wrap FileReader in a Promise
  // const buffer = await new Promise((resolve, reject) => {
  //   reader.onload = () => resolve(reader.result);
  //   reader.onerror = (err) => reject(err);
  //   reader.readAsArrayBuffer(selectedFile);
  // });

  // // Load workbook
  // const workbook = await wb.xlsx.load(buffer);
  // const extractedData = [];

  // workbook.eachSheet((sheet) => {
  //   let headers = [];

  //   sheet.eachRow((row, rowIndex) => {
  //     const rowValues = row.values;
  //     if (rowIndex === 1) {
  //       headers = rowValues.slice(1); // first row = headers
  //     } else {
  //       const rowData = {};
  //       rowValues.slice(1).forEach((cell, i) => {
  //         rowData[headers[i]] = cell ?? "";
  //       });
  //       extractedData.push(rowData);
  //     }
  //   });
  // });

  // const sanitizedData = cleanKeys(extractedData);
  // return sanitizedData;
  const data = await selectedFile.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // defval: "" fills empty cells
  const sanitizedData = cleanKeys(json);
  return sanitizedData;
}
