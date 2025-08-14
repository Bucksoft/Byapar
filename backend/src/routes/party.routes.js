import express from "express";
import { createParty } from "../controllers/party.controller.js";

const router = express.Router();

router.route("/").post(createParty);

export default router;
