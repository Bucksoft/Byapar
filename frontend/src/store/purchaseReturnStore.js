import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePurchaseReturnStore = create(
  persist(
    (set) => ({
      purchaseReturns: null,
      setPurchaseReturns: (data) => set({ purchaseReturns: data }),
      purchaseReturn: null,
      setPurchaseReturn: (data) => set({ purchaseReturn: data }),
      totalPurchaseReturn: 0,
      setTotalPurchaseReturn: (data) => set({ totalPurchaseReturn: data }),
      latestPurchaseReturnNumber: 0,
      setLatestPurchaseReturnNumber: (data) =>
        set({ latestPurchaseReturnNumber: data }),
    }),
    {
      name: "purchaseReturn",
    }
  )
);
