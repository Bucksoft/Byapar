import express from "express";
import {
  createParty,
  getAllParties,
  getSingleParty,
} from "../controllers/party.controller.js";

const router = express.Router();

router.route("/").post(createParty);
router.route("/all").get(getAllParties);
router.route("/:id").get(getSingleParty);

export default router;
