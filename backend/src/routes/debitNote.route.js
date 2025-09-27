import express from "express";
import {
  createDebitNote,
  getAllDebitNotes,
  getDebitNoteById,
} from "../controllers/debitNote.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/invoice/:id").get(isAuth, getDebitNoteById);
router.route("/:id").post(isAuth, createDebitNote);
router.route("/:id").get(isAuth, getAllDebitNotes);

export default router;
