import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCategoryStore = create(
  persist(
    (set) => ({
      categories: null,
      setCategories: (data) => set({ categories: data }),
    }),
    {
      name: "categories",
    }
  )
);
