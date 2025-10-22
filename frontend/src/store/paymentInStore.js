import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePaymentInStore = create(
  persist(
    (set) => ({
      paymentIns: null,
      setPaymentIns: (data) => set({ paymentIns: data }),
      paymentIn: null,
      setPaymentIn: (data) => set({ paymentIn: data }),
      totalPaymentIns: 0,
      setTotalPaymentIns: (data) => set({ totalPaymentIns: data }),
      latestPaymentIn: 0,
      setLatestPaymentIn: (data) => set({ latestPaymentIn: data }),
    }),
    {
      name: "paymentIn",
    }
  )
);
