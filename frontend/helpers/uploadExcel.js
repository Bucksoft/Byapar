import { cleanKeys } from "./cleanKeys";
import * as XLSX from "@e965/xlsx";

export async function uploadExcel(selectedFile) {
  const data = await selectedFile.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const allRows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  });

  const headerRowIndex = allRows.findIndex((row) =>
    row.some((cell) => cell.toString().trim() !== "")
  );
  if (headerRowIndex === -1) return [];

  const headers = allRows[headerRowIndex].map(
    (h, i) => h.toString().trim() || `COL${i}`
  );

  let json = XLSX.utils.sheet_to_json(worksheet, {
    header: headers,
    defval: "",
    range: headerRowIndex + 1,
  });

  const meaningfulKeys = headers.filter((h) =>
    json.some((row) => row[h].toString().trim() !== "")
  );
  json = json.map((row) => {
    const filteredRow = {};
    meaningfulKeys.forEach((k) => (filteredRow[k] = row[k]));
    return filteredRow;
  });

  return cleanKeys(json);
}
