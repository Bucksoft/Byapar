import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useInvoiceStore = create(
  persist(
    (set) => ({
      invoices: null,
      setInvoices: (data) => set({ invoices: data }),
      invoice: null,
      setInvoice: (data) => set({ invoice: data }),
    }),
    {
      name: "invoice",
    }
  )
);
