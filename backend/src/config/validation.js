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
    .min(3, "Party name must be atleast 3 characters long")
    .max(30, "Party name must be atmost 30 characters long"),
  mobileNumber: z.string(),
  email: z.email(),
  openingBalance: z.string().min(0),
  openingBalanceType: z.string(),
  GSTIN: z.string().length(15, "GSTIN must be 15 characters long"),
  PANno: z.string().length(10, "PAN number must be 10 characters long"),
  partyType: z.string(),
  categoryName: z
    .string()
    .min(3, "Category name must atleast 3 characters long")
    .max(30, "Category name must atmost 30 characters long"),
  state: z.string(),
  city: z.string(),
  billingAddress: z
    .string()
    .min(10, "Billing address must be atleast 10 characters long")
    .max(100, "Billing address must be atmost 100 characters long"),
  shippingAddress: z
    .string()
    .min(10, "shipping address must be atleast 10 characters long")
    .max(100, "shipping address must be atmost 100 characters long"),
  creditPeriod: z.string(),
  creditLimit: z.string(),
  status: z.enum(["active", "inactive"]).default("active"),
});
