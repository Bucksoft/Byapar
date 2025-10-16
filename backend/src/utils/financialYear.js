export const getFinancialYearRange = () => {
  const today = new Date();
  const year =
    today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;

  const start = new Date(`${year}-04-01`);
  const end = new Date(`${year + 1}-03-31`);

  return { start, end };
};
