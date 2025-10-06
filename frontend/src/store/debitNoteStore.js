import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useDebitNoteStore = create(
  persist(
    (set) => ({
      debitNotes: null,
      setDebitNotes: (data) => set({ debitNotes: data }),
      debitNote: null,
      setDebitNote: (data) => set({ debitNote: data }),
      totalDebitNotes: 0,
      setTotalDebitNotes: (data) => set({ totalDebitNotes: data }),
    }),
    {
      name: "debitNote",
    }
  )
);
