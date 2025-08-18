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
    .enum(["to_collect", ""], {
      errorMap: () => ({
        message: "Opening balance status must be either to_collect or to_debit",
      }),
    })
    .default("to_collect"),

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
