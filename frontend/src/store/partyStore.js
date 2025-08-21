import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePartyStore = create(
  persist(
    (set) => ({
      parties: null,
      setParties: (data) => set({ parties: data }),
      party: null,
      setParty: (data) => set({ party: data }),
    }),
    {
      name: "party",
    }
  )
);
