import express from "express";
import { createCreditNote } from "../controllers/creditNote.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/:id").post(isAuth, createCreditNote);

export default router;
