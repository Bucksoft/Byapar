import express from "express";
import { createParty } from "../controllers/party.controller";

const router = express.Router();

router.route("/").post(createParty);

export default router;
