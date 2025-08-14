import mongoose from "mongoose";
import dotenv from "dotenv";
import { envSchema } from "../config/validation.js";
dotenv.config();

const MONGO_URL = process.env.DB_URL;
if (!MONGO_URL) {
  throw new Error(`MongoDB URL is not provided ⚠`);
}

const result = envSchema.safeParse({
  DB_URL: MONGO_URL,
});

if (!result.success) {
  throw new Error(`MONGO DB URL is not a valid URL`);
}

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.info(`DB connected ✅`);
  } catch (error) {
    console.error(`Error in connecting to DB ${error} ❌`);
    process.exit(1);
  }
}
