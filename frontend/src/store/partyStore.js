import { create } from "zustand";

export const usePartyStore = create((set) => ({
  parties: null,
  setParties: (data) => set({ parties: data }),
  party: null,
  setParty: (data) => set({ party: data }),
}));
