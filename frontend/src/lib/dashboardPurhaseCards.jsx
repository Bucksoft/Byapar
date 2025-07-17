import { IoBagHandle } from "react-icons/io5";
import { LuBadgeIndianRupee } from "react-icons/lu";
import { TbCoinRupee } from "react-icons/tb";

export const dashboardPurchaseDetails = [
  {
    id: 1,
    icon: <IoBagHandle />,
    label: "Total Purchases",
    color: "primary",
    value: "₹ 0",
  },
  {
    id: 2,
    icon: <LuBadgeIndianRupee />,
    label: "Paid",
    color: "primary",
    value: "₹ 0",
  },
  {
    id: 3,
    icon: <TbCoinRupee />,
    label: "Unpaid",
    color: "primary",
    value: "₹ 0",
  },
];
