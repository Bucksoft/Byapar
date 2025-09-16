import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePaymentOutStore = create(
  persist(
    (set) => ({
      paymentOuts: null,
      setPaymentOuts: (data) => set({ paymentOuts: data }),
      paymentOut: null,
      setPaymentOuts: (data) => set({ paymentOut: data }),
    }),
    {
      name: "paymentOut",
    }
  )
);
