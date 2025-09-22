import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useQuotationStore = create(
  persist(
    (set) => ({
      quotations: null,
      setQuotations: (data) => set({ quotations: data }),
      quotation: null,
      setQuotation: (data) => set({ quotation: data }),
      totalQuotations: 0,
      setTotalQuotations: (data) => set({ totalQuotations: data }),
    }),
    {
      name: "quotations",
    }
  )
);
