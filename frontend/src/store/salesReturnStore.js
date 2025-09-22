import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSalesReturnStore = create(
  persist(
    (set) => ({
      saleReturns: null,
      setSaleReturns: (data) => set({ saleReturns: data }),
      saleReturn: null,
      setSaleReturn: (data) => set({ saleReturn: data }),
      totalSalesReturn: 0,
      setTotalSalesReturn: (data) => set({ totalSalesReturn: data }),
    }),
    {
      name: "salesReturn",
    }
  )
);
