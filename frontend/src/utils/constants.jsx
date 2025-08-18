import p1 from "../assets/p1.png";
import p2 from "../assets/p2.png";
import p3 from "../assets/p3.png";
import {
  FileBox,
  PackageCheck,
  ReceiptIndianRupee,
  StretchHorizontal,
} from "lucide-react";
import invoDel from "../assets/InvoiceDelivery.jpg";
import invoP from "../assets/InvoiceP.png";
import payment from "../assets/Payment.png";
import { LiaStarSolid } from "react-icons/lia";
import { CiCreditCard1 } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdMenuBook } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";

export const badges = [
  {
    id: 1,
    label: "Party",
  },
  {
    id: 2,
    label: "Invoice",
  },
  {
    id: 3,
    label: "Category",
  },
  {
    id: 4,
    label: "Payment Collection",
  },
  {
    id: 5,
    label: "Item",
  },
  {
    id: 6,
    label: "Invoice Details",
  },
  {
    id: 7,
    label: "Summary",
  },
];

export const features = [
  {
    title: "Creating repeated bills?",
    img: p1,
    desc: "Automate sending of repeat bills based on a schedule of your choice",
  },
  {
    title: "Automated Billing",
    img: p2,
    desc: "Send SMS reminders to customers daily/weekly/monthly",
  },
  {
    title: "Easy Reminders & Payment",
    img: p3,
    desc: "Automatically receive notifications and collect payments",
  },
];

export const cardDetails = [
  {
    id: 1,
    img: invoP,
    label: "Automatic e-invoice generation",
  },
  {
    id: 2,
    img: invoDel,
    label: "Hassle e-way bill generation using IRN",
  },
  {
    id: 3,
    img: payment,
    label: "Easy GSTR1 reconciliation",
  },
];

export const newItemsSidebarDetails = [
  {
    id: 1,
    icon: <FileBox />,
    title: "Basic Details",
  },
  {
    id: 2,
    icon: <PackageCheck />,
    title: "Stock Details",
  },
  {
    id: 3,
    icon: <ReceiptIndianRupee />,
    title: "Pricing Details",
  },
  {
    id: 4,
    icon: <ReceiptIndianRupee />,
    title: "Party Wise Prices",
  },
  {
    id: 5,
    icon: <StretchHorizontal />,
    title: "Custom Fields",
  },
];

export const pricingPlans = [
  {
    id: 1,
    color: "[#E16733]",
    name: "Diamond Plan",
    tagline: "Essential plan for small business owners",
    monthlyPrice: 217,
    yearlyPrice: "Billed Annually ₹2599/year",

    manage: "1 Business",
    access: "1 User + 1 CA",
    Auto: "data across unlimited devices",
    accessOn: ["Android", "iOS", "Web"],
    feature: "Features Exclusive to",
    features: [
      "Custom Invoice Themes",
      "Generate and print barcodes (A4 only)",
      "Create your Online Store",
      "Add your CA",
      "Desktop App for Fast and Convenient Use",
      "E-way Bills",
      "Generate e-Invoices",
      "POS Billing",
      "Staff Attendance & Payroll",
      "Create Unlimited Godowns",
      "User Activity Tracker",
      "Automated Billing",
      "WhatsApp & SMS Marketing",
      "Loyalty and Rewards",
      "Bulk Download & Bulk Print Invoices",
      "Data Export to Tally",
    ],
  },
  {
    id: 2,
    color: "[#485EB0]",
    name: "Platinum Plan",
    tagline: "More users, more flexibility, and a Desktop app",
    monthlyPrice: 250,
    originalMonthlyPrice: 417,
    yearlyPrice: "Billed Annually ₹2999/year",

    manage: "2 Businesses",
    access: "3 Users + 1 CA",
    Auto: "data across unlimited devices",
    accessOn: ["Android", "iOS", "Web", "Desktop"],
    feature: "Features Exclusive to",
    features: [
      "Desktop App for Fast and Convenient Use",
      "Custom Invoice Themes",
      "E-way Bills (50/year)",
      "Staff Attendance & Payroll",
      "Create Unlimited Godowns",
      "Generate and print barcodes (A4 only)",
      "Create your Online Store",
      "WhatsApp & SMS Marketing (500 SMS/Year)",
      "Bulk Download & Bulk Print Invoices",
      "Add your CA",
      "Generate e-Invoices",
      "POS Billing",
      "User Activity Tracker",
      "Automated Billing",
      "Loyalty and Rewards",
      "Data Export to Tally",
    ],
  },
  {
    id: 3,
    color: "[#06B181]",
    name: "Enterprise Plan",
    tagline: "Fully customizable for bigger businesses",
    monthlyPrice: 417,
    originalMonthlyPrice: 667,
    yearlyPrice: "Billed Annually ₹4999/year",
    manage: "2 Businesses (Upgrade to add more)",
    access: "3 Users (Upgrade to add more) + 1 CA",
    Auto: "data across unlimited devices",
    accessOn: ["Android", "iOS", "Web", "Desktop"],
    feature: "Features Exclusive to",
    features: [
      "Desktop App for Fast and Convenient Use",
      "Custom Invoice Themes",
      "E-way Bills (Unlimited)",
      "Generate e-Invoices",
      "POS Billing (Desktop App, Web app)",
      "Staff Attendance & Payroll",
      "Create Unlimited Godowns",
      "Generate and print barcodes (A4 only)",
      "Data Export to Tally (On request)",
      "User Activity Tracker",
      "Automated Billing",
      "Create your Online Store",
      "WhatsApp & SMS Marketing (1000 SMS/Year)",
      "Loyalty and Rewards",
      "Bulk Download & Bulk Print Invoices",
      "Add your CA",
    ],
  },
];
export const pricing_Review = [
  {
    id: 1,
    name: "Vansh",
    review: `We were searching for an affordable app to manage our business operations, and this one delivers far 
        more than expected for the price. The monthly plan fits our budget, and the features are comparable to much more 
        expensive tools. Highly recommended for startups and small teams.`,
    stars: <LiaStarSolid size={18} />,
  },
  {
    id: 2,
    name: "Rohit",
    review: `After using this app for just three months, we've seen an increase in productivity and a noticeable reduction
         in operational costs. The yearly plan offers great savings, and we’re already seeing the return on investment. 
         Definitely one of the smartest purchases we’ve made for the business.`,
    stars: <LiaStarSolid size={18} />,
  },
  {
    id: 3,
    name: "Manish",
    review: `I love how the pricing adapts to different stages of business growth. We started on the entry-level plan and 
        recently upgraded to a premium one without any hassle. It’s great to have an app that grows with you, both in features
        and pricing.`,
    stars: <LiaStarSolid size={18} />,
  },
];

export const LandingPagePricingPlan = [
  {
    id: 1,
    name: "Diamond",
    tagline: "Essential plan for small business owners",
    monthly: "₹300",
    offeredprice: "₹217",
    yearlyprice: "Pay ₹3599 ₹2599/year.Billed annually",
    button1text: "Start Free Trial",

    feature: [
      "Manage 1 Business",

      "Access for 1 User + 1 CA",

      "Auto sync data across unlimited devices",

      "Access on Android, iOS & Web",
    ],
    featuresheading: "Includes Silver, plus:",
    features: [
      "Custom Invoice Themes",
      "Create your Online Store",
      "Generate, print(A4 printer) & scan barcode",
    ],
  },

  {
    id: 2,
    name: "Platinum",
    tagline: "More users, more flexibility, and a Desktop app",
    monthly: "₹500",
    offeredprice: "₹250",
    yearlyprice: "Pay ₹5999 ₹2999/year. Billed annually",
    button1text: "Start Free Trial",
    button2text: "Talk to Sales",
    feature: [
      "Manage 2 Business",

      "Access for 3 Users + 1 CA",

      "Auto sync data across unlimited devices",

      "Access on Android, iOS, Web & Web",
    ],
    featuresheading: "Includes Diamond, plus:",
    features: [
      "Desktop App",
      "SMS + Whatsapp marketing (500 messages/ Year)",
      "E-Way Bills (50/Year)",
      "Staff Attendance & Payroll",
      "Godowns (Unlimited)",
      "Print Barcode (Label printer)",
      "Bulk Download & Bulk Print Invoices",
    ],
  },

  {
    id: 3,
    name: "Enterprise",
    tagline: "Fully customizable for bigger businesses",
    monthly: "₹750",
    offeredprice: "₹417",
    yearlyprice: "Pay ₹8999 ₹4999/year. Billed annually",

    button2text: "Talk to Sales",
    feature: [
      "Manage 2 Businesses (Upgrade to add more)",

      "Access for 3 Users (Upgrade to add more) + 1 CA",

      "Auto sync data across unlimited devices",

      "Access on Android, iOS, Web & Web",
    ],
    featuresheading: "Includes Platinum, plus:",
    features: [
      "E-Way Bills (Unlimited)",
      "Generate e-Invoicing",
      "Loyalty & Rewards",
      "Automate Recurring Billing",
      "POS Billing (Desktop App, Web app)",
      "Data Export to tally (on request)",
      "User Activity Tracker",
    ],
  },
];

export const states = [
  "Enter state",
  "Andaman & Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhasttisgarh",
  "Dadra & Nagar Haveli & Daman & Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalay",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Foreign Country",
  "Other Territory",
];

export const statesAndCities = [
  {
    state: "Andhra Pradesh",
    cities: ["Hyderabad", "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
  },
  {
    state: "Arunachal Pradesh",
    cities: ["Itanagar", "Tawang", "Pasighat", "Ziro"],
  },
  {
    state: "Assam",
    cities: ["Guwahati", "Dibrugarh", "Jorhat", "Silchar", "Tezpur"],
  },
  {
    state: "Bihar",
    cities: ["Patna", "Gaya", "Darbhanga", "Bhagalpur", "Muzaffarpur"],
  },
  {
    state: "Chhattisgarh",
    cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
  },
  {
    state: "Goa",
    cities: ["Panaji", "Margao", "Mapusa", "Vasco da Gama"],
  },
  {
    state: "Gujarat",
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  },
  {
    state: "Haryana",
    cities: ["Chandigarh", "Gurugram", "Faridabad", "Panipat", "Karnal"],
  },
  {
    state: "Himachal Pradesh",
    cities: ["Shimla", "Dharamshala", "Mandi", "Solan", "Bilaspur"],
  },
  {
    state: "Jharkhand",
    cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
  },
  {
    state: "Karnataka",
    cities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  },
  {
    state: "Kerala",
    cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  },
  {
    state: "Madhya Pradesh",
    cities: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  },
  {
    state: "Maharashtra",
    cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  },
  {
    state: "Manipur",
    cities: ["Imphal", "Thoubal", "Churachandpur", "Ukhrul"],
  },
  {
    state: "Meghalaya",
    cities: ["Shillong", "Tura", "Jowai", "Baghmara"],
  },
  {
    state: "Mizoram",
    cities: ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
  },
  {
    state: "Nagaland",
    cities: ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
  },
  {
    state: "Odisha",
    cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur"],
  },
  {
    state: "Punjab",
    cities: ["Chandigarh", "Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  },
  {
    state: "Rajasthan",
    cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  },
  {
    state: "Sikkim",
    cities: ["Gangtok", "Namchi", "Gyalshing"],
  },
  {
    state: "Tamil Nadu",
    cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  },
  {
    state: "Telangana",
    cities: ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad"],
  },
  {
    state: "Tripura",
    cities: ["Agartala", "Udaipur", "Kailasahar"],
  },
  {
    state: "Uttar Pradesh",
    cities: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"],
  },
  {
    state: "Uttarakhand",
    cities: ["Dehradun", "Haridwar", "Rishikesh", "Nainital"],
  },
  {
    state: "West Bengal",
    cities: ["Kolkata", "Siliguri", "Howrah", "Asansol"],
  },
  // Union Territories
  {
    state: "Andaman and Nicobar Islands",
    cities: ["Port Blair"],
  },
  {
    state: "Chandigarh",
    cities: ["Chandigarh"],
  },
  {
    state: "Dadra and Nagar Haveli and Daman and Diu",
    cities: ["Daman", "Diu", "Silvassa"],
  },
  {
    state: "Delhi",
    cities: ["New Delhi", "Delhi"],
  },
  {
    state: "Jammu and Kashmir",
    cities: ["Srinagar", "Jammu"],
  },
  {
    state: "Ladakh",
    cities: ["Leh", "Kargil"],
  },
  {
    state: "Lakshadweep",
    cities: ["Kavaratti"],
  },
  {
    state: "Puducherry",
    cities: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  },
];

export const dashboardSinglePartyMenus = [
  {
    id: 1,
    title: "Transactions",
    icon: <CiCreditCard1 />,
  },
  {
    id: 2,
    title: "Profile",
    icon: <FaRegCircleUser />,
  },
  {
    id: 3,
    title: "Ledger (Statement)",
    icon: <MdMenuBook />,
  },
  {
    id: 4,
    title: "Item Wise Report",
    icon: <TbReportAnalytics />,
  },
];
