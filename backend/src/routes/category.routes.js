import express from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/category.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:id", isAuth, createCategory);
router.get("/", getCategories);

export default router;
