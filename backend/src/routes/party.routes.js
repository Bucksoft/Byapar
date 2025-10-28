import express from "express";
import {
  allParties,
  bulkAddParties,
  createParty,
  deleteParty,
  getAllParties,
  getSingleParty,
  updateFullShippingAddress,
  updatePartyDetails,
  updateShippingAddress,
  deleteShippingAddress,
} from "../controllers/party.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(isAuth, createParty);
router.route("/all-parties/:id").get(isAuth, allParties);
router.route("/bulk/:id").post(isAuth, bulkAddParties);
router.route("/shipping-address/:id").patch(isAuth, updateShippingAddress);
router
  .route("/shipping-address/update/:id")
  .patch(isAuth, updateFullShippingAddress);
  
router.route("/shipping-address/:id").delete(isAuth, deleteShippingAddress);
router.route("/all/:id").get(isAuth, getAllParties);
router.route("/:id").get(isAuth, getSingleParty);
router.route("/:id").patch(isAuth, updatePartyDetails);
router.route("/:id").delete(isAuth, deleteParty);

export default router;
