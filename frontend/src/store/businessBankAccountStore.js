import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBusinessBankAccountStore = create(
  persist(
    (set) => ({
      bankAccount: null,
      setBankAccount: (data) => set({ bankAccount: data }),
      bankAccounts: null,
      setBankAccounts: (data) => set({ bankAccounts: data }),
      activeAccount: null,
      setActiveAccount: (data) => set({ activeAccount: data }),
    }),
    {
      name: "businessBankAccount",
    }
  )
);
