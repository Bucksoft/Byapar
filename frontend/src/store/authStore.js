import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (data) => set({ user: data }),
}));
