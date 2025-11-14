import { z } from "zod";

export const envSchema = z.object({
  DB_URL: z.url().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
});

export const partySchema = z.object({
  partyName: z.string().min(1, "Party name is required"),
  mobileNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
      message: "Mobile number must be a valid 10-digit Indian mobile number",
    }),

  email: z
    .string()
    .optional()
    .refine((val) => !val || /\S+@\S+\.\S+/.test(val), {
      message: "Invalid email address",
    }),

  openingBalance: z.number().optional().default(0),

  openingBalanceStatus: z
    .enum(["To Collect", "To Pay"], {
      errorMap: () => ({
        message: "Opening balance status must be either To Collect or To Pay",
      }),
    })
    .optional()
    .default("To Collect"),

  GSTIN: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val),
      { message: "Invalid GSTIN format" }
    ),

  PANno: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .optional()
      .refine((val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val), {
        message: "Invalid PAN number",
      })
  ),

  partyType: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["Customer", "Supplier", "Dealer"]).optional().default("Customer")
  ),

  categoryName: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 3 && val.length <= 50), {
      message:
        "Category name must be between 3 and 50 characters long if provided",
    }),

  state: z
    .string()
    .optional()
    .refine((val) => !val || (/^[a-zA-Z\s]+$/.test(val) && val.length >= 2), {
      message: "State name must be at least 2 characters and letters only",
    }),

  city: z
    .string()
    .optional()
    .refine((val) => !val || (/^[a-zA-Z\s]+$/.test(val) && val.length >= 2), {
      message: "City name must be at least 2 characters and letters only",
    }),

  billingAddress: z.string().min(1, "Billing address is required"),

  shippingAddress: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 10 && val.length <= 200), {
      message: "Shipping address must be 10–200 characters long if provided",
    }),

  creditPeriod: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return Number.isFinite(num) ? num : undefined;
  }, z.number({ invalid_type_error: "Credit period must be a number" }).int("Credit period must be an integer").min(0, "Credit period cannot be negative").max(365, "Credit period cannot exceed 365 days").optional()),

  creditLimit: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return Number.isFinite(num) ? num : undefined;
  }, z.number({ invalid_type_error: "Credit limit must be a number" }).min(0, "Credit limit cannot be negative").max(10000000, "Credit limit too high").optional()),

  pincode: z
    .string()
    .optional()
    .refine((val) => !val || /^[1-9][0-9]{5}$/.test(val), {
      message: "Pincode must be a valid 6-digit Indian postal code",
    }),

  status: z.enum(["active", "inactive"]).default("active"),
});

export const businessSchema = z.object({
  logo: z.string().optional(),
  // bankAccounts: z.array().optional(),
  notes: z.string().optional(),
  termsAndCondition: z.string().optional(),
  businessName: z
    .string()
    .min(5, "Business name must be atleast 5 characters long")
    .max(200, "Business name must be atmost 30 characters long"),

  businessType: z.string().min(1, "Please select a Business registration type"),

  industryType: z.string().min(1, "Please select an Industry type"),

  businessRegType: z
    .string()
    .min(1, "Please select a Business registration type"),

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

  panNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val), {
      message: "Invalid PAN number",
    }),

  TDS: z.boolean().default(false),
  TCS: z.boolean().default(false),

  // additionalInformation: z.array(z.string()).optional(),

  signature: z.string().optional(),

  gstRegistered: z.boolean().default(false).optional(),

  gstNumber: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val),
      { message: "Invalid GSTIN format" }
    ),
});

export const bankAccountSchema = z.object({
  accountName: z.string().optional(),

  openingBalance: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().optional().default(0)
  ),

  // asOfDate: z.preprocess(
  //   (arg) =>
  //     !arg || arg === ""
  //       ? undefined
  //       : typeof arg === "string" || arg instanceof Date
  //       ? new Date(arg)
  //       : arg,
  //   z
  //     .date({
  //       required_error: "As of date is required",
  //       invalid_type_error: "Invalid date format",
  //     })
  //     .optional()
  // ),

  bankAccountNumber: z
    .string()
    .refine((val) => !val || /^\d{9,18}$/.test(val), {
      message: "Bank account number must be 9–18 digits",
    }),

  IFSCCode: z
    .string()
    .optional()
    .refine((val) => !val || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val), {
      message: "Invalid IFSC code format",
    }),

  bankAndBranchName: z.string().optional(),
  accountHoldersName: z.string().optional(),
  upiId: z
    .string()
    .optional()
    .refine((val) => !val || /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/.test(val), {
      message: "Invalid UPI ID format",
    }),
});

export const businessBankAccount = z.object({
  accountName: z.string().min(1, "Account Name is required"),

  bankAccountNumber: z
    .string()
    .min(1, "Bank Account Number is required")
    .regex(/^\d{9,18}$/, "Bank account number must be 9–18 digits"),

  asOfDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),

  ifscCode: z
    .string()
    .min(1, "IFSC Code is required")
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),

  bankAndBranchName: z.string().min(1, "Bank and Branch Name is required"),

  accountHoldersName: z.string().min(1, "Account Holder's Name is required"),

  upiId: z
    .string()
    .optional()
    .refine((val) => !val || /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/.test(val), {
      message: "Invalid UPI ID format",
    }),
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
  isPOSItem: z.boolean().default(false).optional(),
  category: z.string().optional(),

  // only required field
  itemName: z.string().min(1, "Item Name is required"),

  SACCode: z.string().optional(),
  serviceCode: z.string().optional(),

  lowStockQuantity: z.number().optional(),

  showItemInOnlineStore: z.boolean().default(false).optional(),

  salesPriceType: z
    .enum(["with tax", "without tax"])
    .default("with tax")
    .optional(),
  purchasePriceType: z
    .enum(["with tax", "without tax"])
    .default("with tax")
    .optional(),

  salesPrice: z
    .number({
      invalid_type_error: "Sales price must be a number",
    })
    .nonnegative("Sales price cannot be negative")
    .optional(),

  salesPriceForDealer: z
    .number({
      invalid_type_error: "Sales price must be a number",
    })
    .nonnegative("Sales price cannot be negative")
    .optional(),

  purchasePrice: z
    .number({
      invalid_type_error: "Purchase price must be a number",
    })
    .nonnegative("Purchase price cannot be negative")
    .optional(),

  gstTaxRate: z.string().default("none").optional(),

  measuringUnit: z.string().optional(),

  openingStock: z
    .number({
      invalid_type_error: "Opening stock must be a number",
    })
    .nonnegative("Opening stock cannot be negative")
    .optional(),

  itemCode: z.string().optional(),

  HSNCode: z.string().optional(),

  godown: z.string().optional(),

  asOfDate: z
    .union([z.string(), z.date()])
    .default(() => new Date())
    .optional(),

  description: z.string().optional(),

  fileURLs: z.array(z.string()).optional(),
});

export const salesInvoiceSchema = z.object({
  salesInvoiceNumber: z.number().min(0, "Invoice number is required"),
  salesInvoiceDate: z.union([z.string(), z.date()]).default(() => new Date()),
  partyName: z.string().optional(),
  paymentTerms: z.number(),
  dueDate: z.union([z.string(), z.date()]).default(() => new Date()),
  taxSubTotal: z.number().optional(),
  amountSubTotal: z.number().min(0, "Amount subtotal is required"),
  discountSubtotal: z.number().optional(),
  notes: z.string().optional(),
  termsAndCondition: z.string().optional(),
  taxableAmount: z.number().optional(),
  sgst: z.number().optional(),
  cgst: z.number().optional(),
  totalAmount: z.number().min(0, "Total amount is required"),
  balanceAmount: z.number().min(0, "Balance amount is required"),
});

export const userAccountSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters long"),
  email: z.email(),
  contact: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Mobile number must be a valid 10-digit Indian mobile number"
    ),
});
