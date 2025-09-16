import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProformaInvoiceStore = create(
  persist(
    (set) => ({
      proformaInvoices: null,
      setProformaInvoices: (data) => set({ proformaInvoices: data }),
      proformaInvoice: null,
      setProformaInvoice: (data) => set({ proformaInvoice: data }),
    }),
    {
      name: "proformaInvoice",
    }
  )
);
