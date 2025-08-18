import express from "express";
import { createParty, getAllParties } from "../controllers/party.controller.js";

const router = express.Router();

router.route("/").post(createParty);
router.route("/all").get(getAllParties);

export default router;
