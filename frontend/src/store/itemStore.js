import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useItemStore = create(
  persist(
    (set) => ({
      items: null,
      setItems: (data) => set({ items: data }),
      item: null,
      setItem: (data) => set({ item: data }),
    }),
    {
      name: "item",
    }
  )
);
