import express from "express";
import {
  createParty,
  deleteParty,
  getAllParties,
  getSingleParty,
  updatePartyDetails,
} from "../controllers/party.controller.js";

const router = express.Router();

router.route("/").post(createParty);
router.route("/all").get(getAllParties);
router.route("/:id").get(getSingleParty);
router.route("/:id").patch(updatePartyDetails);
router.route("/:id").delete(deleteParty);

export default router;
