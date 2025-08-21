import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (data) => set({ user: data }),
    }),
    {
      name: "auth",
    }
  )
);
