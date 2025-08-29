import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBusinessStore = create(
  persist(
    (set) => ({
      businesses: null,
      setBusinesses: (data) => set({ businesses: data }),
      business: null,
      setBusiness: (data) => set({ business: data }),
    }),
    {
      name: "business",
    }
  )
);
