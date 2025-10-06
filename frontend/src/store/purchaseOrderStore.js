import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePurchaseOrderStore = create(
  persist(
    (set) => ({
      purchaseOrder: null,
      setPurchaseOrder: (data) => set({ purchaseOrder: data }),
      purchaseOrders: null,
      setPurchaseOrders: (data) => set({ purchaseOrders: data }),
      totalPurchaseOrders: 0,
      setTotalPurchaseOrders: (data) => set({ totalPurchaseOrders: data }),
    }),
    {
      name: "purchaseOrder",
    }
  )
);
