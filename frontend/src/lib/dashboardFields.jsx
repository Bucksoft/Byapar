import { PackageOpen } from "lucide-react";
import { BsPeopleFill, BsPersonFillGear } from "react-icons/bs";
import { IoColorPaletteSharp, IoPricetagsSharp } from "react-icons/io5";
import { TbDeviceMobileMessage, TbLayoutDashboardFilled } from "react-icons/tb";
import { GiShoppingBag } from "react-icons/gi";
import { TbReportSearch } from "react-icons/tb";
import { BsBank2 } from "react-icons/bs";
import { FaFileInvoice } from "react-icons/fa";
import {
  FaClipboardQuestion,
  FaMoneyBills,
  FaPeopleRoof,
} from "react-icons/fa6";
import { FaWallet } from "react-icons/fa6";
import { BsFillLaptopFill } from "react-icons/bs";
import { RiAccountCircleFill, RiAlarmFill } from "react-icons/ri";
import { BiSolidBriefcaseAlt2, BiSolidPrinter } from "react-icons/bi";
import {
  HiClipboardDocumentList,
  HiCurrencyRupee,
  HiDocumentCurrencyRupee,
} from "react-icons/hi2";
import { IoIosGift, IoMdCart } from "react-icons/io";

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

export const settingLinks = [
  {
    id: 1,
    icon: <RiAccountCircleFill />,
    label: "Account",
    link: "account",
  },
  {
    id: 2,
    icon: <BiSolidBriefcaseAlt2 />,
    label: "Manage Business",
    link: "business",
  },
  {
    id: 3,
    icon: <IoColorPaletteSharp />,
    label: "Invoice Settings",
    link: "invoice",
  },
  {
    id: 4,
    icon: <BiSolidPrinter />,
    label: "Print Settings",
    link: "print",
  },
  {
    id: 5,
    icon: <BsPersonFillGear />,
    label: "Manage Users",
    link: "users",
  },
  {
    id: 6,
    icon: <RiAlarmFill />,
    label: "Reminders",
    link: "reminders",
  },
  {
    id: 7,
    icon: <HiDocumentCurrencyRupee />,
    label: "CA Reports Sharing",
    link: "ca-reports",
  },
  {
    id: 8,
    icon: <HiCurrencyRupee />,
    label: "Pricing",
    link: "pricing",
  },
  {
    id: 9,
    icon: <IoIosGift />,
    label: "Refer & Earn",
    link: "refer-and-earn",
  },
  {
    id: 10,
    icon: <FaClipboardQuestion />,
    label: "Help And Support",
    link: "help-and-support",
  },
];

export const businessTools = [
  {
    id: 1,
    icon: <FaPeopleRoof />,
    label: "Staff Attendance & Payroll",
    link: "staff",
  },
  {
    id: 2,
    icon: <IoMdCart />,
    label: "Online Store",
    link: "online-store",
  },
  {
    id: 3,
    icon: <TbDeviceMobileMessage />,
    label: "SMS Marketing",
    link: "sms-marketing",
  },
  {
    id: 4,
    icon: <HiClipboardDocumentList />,
    label: "Apply for Loan",
    link: "loan",
  },
];
