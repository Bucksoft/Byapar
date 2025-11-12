import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCreditNoteStore = create(
  persist(
    (set) => ({
      creditNotes: null,
      setCreditNotes: (data) => set({ creditNotes: data }),
      creditNote: null,
      setCreditNote: (data) => set({ creditNote: data }),
      totalCreditNotes: 0,
      setTotalCreditNotes: (data) => set({ totalCreditNotes: data }),
      latestCreditNoteNumber: 0,
      setLatestCreditNoteNumber: (data) => set({ latestCreditNoteNumber: data }),
    }),
    {
      name: "creditNote",
    }
  )
);
