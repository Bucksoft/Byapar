import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePaymentInStore = create(
  persist(
    (set) => ({
      paymentIns: null,
      setPaymentIns: (data) => set({ paymentIns: data }),
      paymentIn: null,
      setPaymentIn: (data) => set({ paymentIn: data }),
    }),
    {
      name: "paymentIn",
    }
  )
);
