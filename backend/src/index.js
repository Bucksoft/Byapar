import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import userRoutes from "./routes//user.routes.js";

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/v1/user", userRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port : ${PORT}`);
});
