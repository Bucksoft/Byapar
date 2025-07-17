import { PackageOpen } from "lucide-react";
import { BsPeopleFill } from "react-icons/bs";
import { IoPricetagsSharp } from "react-icons/io5";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { GiShoppingBag } from "react-icons/gi";
import { TbReportSearch } from "react-icons/tb";
import { BsBank2 } from "react-icons/bs";
import { FaFileInvoice } from "react-icons/fa";
import { FaMoneyBills } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa6";
import { BsFillLaptopFill } from "react-icons/bs";

export const dashboardFields = [
  {
    id: 1,
    icon: (
      <>
        <TbLayoutDashboardFilled size={16} />
      </>
    ),
    label: "Dashboard",
  },
  {
    id: 2,
    icon: (
      <>
        <BsPeopleFill size={16} />
      </>
    ),
    label: "Parties",
  },
  {
    id: 3,
    icon: (
      <>
        <PackageOpen size={16} />
      </>
    ),
    label: "Items",
  },
  {
    id: 4,
    icon: (
      <>
        <IoPricetagsSharp size={16} />
      </>
    ),
    label: "Sales",
  },
  {
    id: 5,
    icon: (
      <>
        <GiShoppingBag size={16} />
      </>
    ),
    label: "Purchases",
  },
  {
    id: 6,
    icon: (
      <>
        <TbReportSearch size={16} />
      </>
    ),
    label: "Reports",
  },
];

export const dashboardAccountingFields = [
  {
    id: 1,
    icon: <BsBank2 />,
    label: "Cash & Bank",
    link: "cashandbank",
  },
  {
    id: 2,
    icon: <FaFileInvoice />,
    label: "E-Invoicing",
    link: "invoicing",
  },
  {
    id: 3,
    icon: <FaMoneyBills />,
    label: "Automated Bills",
    link: "bills",
  },
  {
    id: 4,
    icon: <FaWallet />,
    label: "Expenses",
    link: "expenses",
  },
  {
    id: 5,
    icon: <BsFillLaptopFill />,
    label: "POS Billing",
    link: "pos",
  },
];
