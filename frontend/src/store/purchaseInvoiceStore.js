import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePurchaseInvoiceStore = create(
  persist(
    (set) => ({
      purchaseInvoice: null,
      setPurchaseInvoice: (data) => set({ purchaseInvoice: data }),
      purchaseInvoices: null,
      setPurchaseInvoices: (data) => set({ purchaseInvoices: data }),
    }),
    {
      name: "purchaseInvoice",
    }
  )
);
