import express from "express";
import {
  createCreditNote,
  getAllCreditNotes,
  getCreditNote,
} from "../controllers/creditNote.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/invoice/:id").get(isAuth, getCreditNote);
router.route("/:id").post(isAuth, createCreditNote);
router.route("/:id").get(isAuth, getAllCreditNotes);

export default router;
