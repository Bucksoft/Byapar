import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChallanStore = create(
  persist(
    (set) => ({
      deliveryChallan: null,
      setDeliveryChallan: (data) => set({ deliveryChallan: data }),
      deliveryChallans: null,
      setDeliveryChallans: (data) => set({ deliveryChallans: data }),
      totalDeliveryChallans: 0,
      setTotalDeliveryChallans: (data) => set({ totalDeliveryChallans: data }),
    }),
    {
      name: "deliveryChallan",
    }
  )
);
