import { z } from "zod";

export const envSchema = z.object({
  DB_URL: z.url().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
});

export const partySchema = z.object({
  party_name: z
    .string()
    .min(3, "Party name must be atleast 3 characters long")
    .max(30, "Party name must be atmost 30 characters long"),
  mobile_number: z.number().length(10, "Mobile number must be 10 digits long"),
  email: z.email(),
  opening_balance: z.string().min(0),
  opening_balance_type: z.string(),
  GSTIN: z.string().length(15, "GSTIN must be 15 characters long"),
  PAN_no: z.string().length(10, "PAN number must be 10 characters long"),
  party_type: z.string(),
  category_name: z
    .string()
    .min(3, "Category name must atleast 3 characters long")
    .max(30, "Category name must atmost 30 characters long"),
  state: z.string(),
  city: z.string(),
  billing_address: z
    .string()
    .min(10, "Billing address must be atleast 10 characters long")
    .max(100, "Billing address must be atmost 100 characters long"),
  shipping_address: z
    .string()
    .min(10, "shipping address must be atleast 10 characters long")
    .max(100, "shipping address must be atmost 100 characters long"),
  credit_period: z.date(),
  credit_limit: z.string(),
  status: z.enum(["active", "inactive"]).default("active"),
  flag: z.string(),
});
