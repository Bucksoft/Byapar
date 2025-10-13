export function getTotalTaxRate(gstString) {
  if (!gstString || typeof gstString !== "string") return 0;

  // Extract all numbers (integers or decimals) from the string
  const matches = gstString.match(/(\d+(\.\d+)?)/g);

  if (!matches) return 0;

  // Convert all found numbers to floats and sum them
  const totalTax = matches.reduce((sum, num) => sum + parseFloat(num), 0);

  return totalTax;
}
