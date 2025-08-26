import { z } from "zod";

export const envSchema = z.object({
  DB_URL: z.url().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
});

export const partySchema = z.object({
  partyName: z
    .string()
    .min(3, "Party name must be at least 3 characters long")
    .max(50, "Party name must be at most 50 characters long")
    .regex(
      /^[a-zA-Z0-9\s\-.&]+$/,
      "Party name can only contain letters, numbers, spaces, and . - &"
    ),

  mobileNumber: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Mobile number must be a valid 10-digit Indian mobile number"
    ),

  email: z.email("Invalid email address"),

  openingBalance: z.number().default(0),

  openingBalanceStatus: z
    .enum(["To Collect", "To Pay"], {
      errorMap: () => ({
        message: "Opening balance status must be either To Collect or To Pay",
      }),
    })
    .default("To Collect"),

  GSTIN: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN format"
    ),

  PANno: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"),

  partyType: z.enum(["Customer", "Supplier"]).default("Customer"),

  categoryName: z
    .string()
    .min(3, "Category name must be at least 3 characters long")
    .max(50, "Category name must be at most 50 characters long"),

  state: z
    .string()
    .min(2, "State name must be at least 2 characters long")
    .regex(/^[a-zA-Z\s]+$/, "State name can only contain letters and spaces"),

  city: z
    .string()
    .min(2, "City name must be at least 2 characters long")
    .regex(/^[a-zA-Z\s]+$/, "City name can only contain letters and spaces"),

  billingAddress: z
    .string()
    .min(10, "Billing address must be at least 10 characters long")
    .max(200, "Billing address must be at most 200 characters long"),

  shippingAddress: z
    .string()
    .min(10, "Shipping address must be at least 10 characters long")
    .max(200, "Shipping address must be at most 200 characters long"),

  creditPeriod: z
    .number("Credit period must be a number")
    .int("Credit period must be an integer")
    .min(0, "Credit period cannot be negative")
    .max(365, "Credit period cannot exceed 365 days"),

  creditLimit: z
    .number("Credit limit must be a number")
    .min(0, "Credit limit cannot be negative")
    .max(10000000, "Credit limit too high"),

  pincode: z
    .string()
    .regex(
      /^[1-9][0-9]{5}$/,
      "Pincode must be a valid 6-digit Indian postal code"
    ),

  status: z.enum(["active", "inactive"]).default("active"),
});

export const businessSchema = z.object({
  logo: z.string().optional(),
  businessName: z
    .string()
    .min(5, "Business name must be atleast 5 characters long")
    .max(30, "Business name must be atmost 30 characters long"),
  businessType: z.enum(
    ["Retailer", "Wholesaler", "Distributor", "Manufacturer", "Services"],
    {
      errorMap: () => ({
        message:
          "Business type cannot be other than Retailer, Wholesaler, Distributor, Manufacturer or Services",
      }),
    }
  ),
  industryType: z.string("Please select an Industry type"),
  businessRegType: z.string("Please select a Business registration type"),
  companyPhoneNo: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Mobile number must be a valid 10-digit Indian mobile number"
    ),
  companyEmail: z.email("Invalid email address"),
  billingAddress: z
    .string()
    .min(10, "Billing address must be at least 10 characters long")
    .max(200, "Billing address must be at most 200 characters long"),
  state: z
    .string()
    .min(2, "State name must be at least 2 characters long")
    .regex(/^[a-zA-Z\s]+$/, "State name can only contain letters and spaces"),

  city: z
    .string()
    .min(2, "City name must be at least 2 characters long")
    .regex(/^[a-zA-Z\s]+$/, "City name can only contain letters and spaces"),

  pincode: z
    .string()
    .regex(
      /^[1-9][0-9]{5}$/,
      "Pincode must be a valid 6-digit Indian postal code"
    ),

  // gstRegistered: z.boolean().default(false).optional(),
  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN format"
    ),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"),
  TDS: z.boolean().default(false),
  TCS: z.boolean().default(false),
  additionalInfo: z.string("Please enter some information").optional(),
  signature: z.string().optional(),
});

export const bankAccountSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),

  openingBalance: z.number().optional(0),

  asOfDate: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
    z.date({
      required_error: "As of date is required",
      invalid_type_error: "Invalid date format",
    })
  ),

  bankAccountNumber: z
    .string()
    .regex(/^\d{9,18}$/, "Bank account number must be 9–18 digits"),

  ifscCode: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),

  bankAndBranchName: z.string().min(1, "Bank name & Branch name are required"),

  accountHolderName: z.string().min(1, "Account holder name is required"),

  upiId: z
    .string()
    .regex(/^[\w.-]{2,256}@[a-zA-Z]{2,64}$/, "Invalid UPI ID format")
    .optional(),

  partyId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Party ID")
    .optional(),

  clientId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Client ID")
    .optional(),
});

export const paymentInSchema = z.object({
  partyName: z
    .string()
    .min(3, "Party name must be at least 3 characters long")
    .max(50, "Party name must be at most 50 characters long")
    .regex(
      /^[a-zA-Z0-9\s\-.&]+$/,
      "Party name can only contain letters, numbers, spaces, and . - &"
    ),

  paymentAmount: z
    .number({ invalid_type_error: "Payment amount must be a number" })
    .min(0, "Payment amount cannot be negative"),

  paymentDate: z.union([
    z.string().nonempty("Payment date is required"),
    z.date(),
  ]),
  paymentMode: z.string().nonempty("Payment mode cannot be left empty"),

  paymentReceivedIn: z.string().nonempty("Select a bank account"),

  paymentInNumber: z
    .number({ invalid_type_error: "Payment number must be a number" })
    .min(1, "Payment in number must be at least 1"),

  notes: z
    .string()
    .min(10, "Notes must be at least 10 characters long")
    .max(100, "Notes must be at most 100 characters long")
    .optional(),
});

export const itemSchema = z.object({
  itemType: z.enum(["product", "service"]).default("product"),

  category: z.string().optional(),

  itemName: z.string().min(1, "Item Name is required"),

  showItemInOnlineStore: z.boolean().default(false).optional(),

  salesPriceType: z.enum(["with tax", "without tax"]).default("with tax"),
  purchasePriceType: z.enum(["with tax", "without tax"]).default("with tax"),

  salesPrice: z
    .number({
      required_error: "Sales price is required",
      invalid_type_error: "Sales price must be a number",
    })
    .nonnegative("Sales price cannot be negative"),

  gstTaxRate: z.string().default("none"),

  measuringUnit: z.string().optional(),

  openingStock: z
    .number({
      required_error: "Opening stock is required",
      invalid_type_error: "Opening stock must be a number",
    })
    .nonnegative("Opening stock cannot be negative"),

  itemCode: z.string().optional(),

  HSNCode: z.string().optional(),

  godown: z.string().optional(),

  asOfDate: z.union([z.string(), z.date()]).default(() => new Date()),

  description: z.string().optional(),

  fileURLs: z.array(z.string()).optional(),
});
