import { PackageOpen } from "lucide-react";
import { BsPeopleFill, BsPersonFillGear, BsWhatsapp } from "react-icons/bs";
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
import { MdAddBusiness } from "react-icons/md";

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
    // subLinks: [
    //   {
    //     id: 1,
    //     label: "Inventory",
    //     link: "items",
    //   },
    //   // {
    //   //   id: 2,
    //   //   label: "Godown (Warehouse)",
    //   //   link: "godown",
    //   // },
    // ],
  },
  {
    id: 4,
    icon: (
      <>
        <IoPricetagsSharp size={16} />
      </>
    ),
    label: "Sales",
    subLinks: [
      {
        id: 1,
        label: "Sales Invoices",
        link: "sales",
      },
      {
        id: 2,
        label: "Quotation/Estimate",
        link: "quotations",
      },
      {
        id: 3,
        label: "Payment In",
        link: "payment-in",
      },
      {
        id: 4,
        label: "Sales Return",
        link: "sales-return",
      },
      // {
      //   id: 5,
      //   label: "Credit Note",
      //   link: "credit-note",
      // },
      // {
      //   id: 6,
      //   label: "Delivery Challan",
      //   link: "delivery-challan",
      // },
      // {
      //   id: 7,
      //   label: "Proforma Invoice",
      //   link: "proforma",
      // },
    ],
  },
  {
    id: 5,
    icon: (
      <>
        <GiShoppingBag size={16} />
      </>
    ),
    label: "Purchases",
    subLinks: [
      {
        id: 1,
        label: "Purchase Invoices",
        link: "purchases",
      },
      // {
      //   id: 2,
      //   label: "Payment Out",
      //   link: "payment-out",
      // },
      {
        id: 3,
        label: "Purchase Return",
        link: "purchase-return",
      },
      // {
      //   id: 4,
      //   label: "Debit Note",
      //   link: "debit-note",
      // },
      // {
      //   id: 5,
      //   label: "Purchase Orders",
      //   link: "purchase-order",
      // },
      {
        id: 6,
        icon: <FaWallet size={16} />,
        label: "Expenses",
        link: "expenses",
      },
    ],
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
  // {
  //   id: 1,
  //   icon: <BsBank2 size={16} />,
  //   label: "Cash & Bank",
  //   link: "cashandbank",
  // },
  // {
  //   id: 2,
  //   icon: <FaFileInvoice size={16} />,
  //   label: "E-Invoicing",
  //   link: "invoicing",
  // },
  // {
  //   id: 3,
  //   icon: <FaMoneyBills size={16} />,
  //   label: "Automated Bills",
  //   link: "bills",
  // },
  // {
  //   id: 5,
  //   icon: <BsFillLaptopFill />,
  //   label: "POS Billing",
  //   link: "pos",
  // },
];

export const settingLinks = [
  {
    id: 1,
    icon: (
      <>
        <MdAddBusiness size={16} />
      </>
    ),
    label: "My Businesses",
    link: "my-businesses",
  },
  {
    id: 2,
    icon: <BsWhatsapp size={16} />,
    label: "Connect Whatsapp",
    link: "whatsapp",
  },
  // {
  //   id: 3,
  //   icon: <RiAccountCircleFill size={16} />,
  //   label: "Account",
  //   link: "account",
  // },
  // {
  //   id: 4,
  //   icon: <BiSolidBriefcaseAlt2 size={16} />,
  //   label: "Manage Business",
  //   link: "business",
  // },
  {
    id: 5,
    icon: <IoColorPaletteSharp size={16} />,
    label: "Invoice Settings",
    link: "invoice",
  },
  // {
  //   id: 6,
  //   icon: <BiSolidPrinter size={16} />,
  //   label: "Print Settings",
  //   link: "print",
  // },
  // {
  //   id: 7,
  //   icon: <BsPersonFillGear size={16} />,
  //   label: "Manage Users",
  //   link: "users",
  // },
  // {
  //   id: 8,
  //   icon: <RiAlarmFill size={16} />,
  //   label: "Reminders",
  //   link: "reminders",
  // },
  // {
  //   id: 9,
  //   icon: <HiDocumentCurrencyRupee size={16} />,
  //   label: "CA Reports Sharing",
  //   link: "ca-reports",
  // },
  // {
  //   id:10,
  //   icon: <HiCurrencyRupee size={16} />,
  //   label: "Pricing",
  //   link: "pricing",
  // },
  // {
  //   id: 11,
  //   icon: <IoIosGift size={16} />,
  //   label: "Refer & Earn",
  //   link: "refer-and-earn",
  // },
  // {
  //   id: 12,
  //   icon: <FaClipboardQuestion size={16} />,
  //   label: "Help And Support",
  //   link: "help-and-support",
  // },
];

export const businessTools = [
  {
    id: 1,
    icon: <FaPeopleRoof size={16} />,
    label: "Staff Attendance & Payroll",
    link: "staff",
  },
  {
    id: 2,
    icon: <IoMdCart size={16} />,
    label: "Online Store",
    link: "online-store",
  },
  {
    id: 3,
    icon: <TbDeviceMobileMessage size={16} />,
    label: "SMS Marketing",
    link: "sms-marketing",
  },
  {
    id: 4,
    icon: <HiClipboardDocumentList size={16} />,
    label: "Apply for Loan",
    link: "loan",
  },
];
