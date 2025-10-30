import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePartyBankAccountStore = create(
  persist(
    (set) => ({
      partyBankAccount: null,
      setPartyBankAccount: (data) => set({ partyBankAccount: data }),
      //   partyBankAccounts: null,
      //   setPartyBankAccounts: (data) => set({ bankAccounts: data }),
      activeAccount: null,
      setActiveAccount: (data) => set({ activeAccount: data }),
    }),
    {
      name: "partyBankAccount",
    }
  )
);
