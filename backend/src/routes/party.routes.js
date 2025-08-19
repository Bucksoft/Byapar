import express from "express";
import {
  createParty,
  deleteParty,
  getAllParties,
  getSingleParty,
  updatePartyDetails,
} from "../controllers/party.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(isAuth, createParty);
router.route("/all").get(isAuth, getAllParties);
router.route("/:id").get(isAuth, getSingleParty);
router.route("/:id").patch(isAuth, updatePartyDetails);
router.route("/:id").delete(isAuth, deleteParty);

export default router;
