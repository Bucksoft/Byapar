import { BsPeopleFill } from "react-icons/bs";
import { BadgeIndianRupee } from "lucide-react";

export const dashboardPartiesCardDetails = [
  {
    id: 1,
    icon: <BsPeopleFill />,
    label: "All Parties",
    value: "1",
    color: "#4FB7B3",
  },
  {
    id: 2,
    icon: <BadgeIndianRupee size={14} />,
    label: "To Collect",
    value: "1",
    color: "error",
  },
  {
    id: 3,
    icon: <BadgeIndianRupee size={14} />,
    label: "To Pay",
    value: "1",
    color: "secondary",
  },
];
