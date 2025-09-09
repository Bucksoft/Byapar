import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import { createSalesReturn } from "../controllers/salesReturn.controller.js";

const router = express.Router();

router.route("/:id").post(isAuth, createSalesReturn);

export default router;
