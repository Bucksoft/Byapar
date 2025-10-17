import { BsPeopleFill } from "react-icons/bs";
import { BadgeIndianRupee } from "lucide-react";

export const dashboardPartiesCardDetails = [
  {
    id: 1,
    icon: <BsPeopleFill />,
    label: "All Parties",
    value: "1",
    color: "#DC3C22",
    rgb: "rgba(220, 60, 34, 0.1)",
  },
  {
    id: 2,
    icon: <BadgeIndianRupee size={14} />,
    label: "To Collect",
    value: "1",
    color: "#03A6A1",
    rgb: "rgba(3, 166, 161, 0.1)",
  },
  {
    id: 3,
    icon: <BadgeIndianRupee size={14} />,
    label: "To Pay",
    value: "1",
    color: "#A4DD00",
    rgb: "rgba(164, 221, 0, 0.1)",
  },
];
