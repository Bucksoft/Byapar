import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  createBusiness,
  deleteBusiness,
  getBusiness,
  updateBusiness,
} from "../controllers/business.controller.js";

const router = express.Router();

router.route("/").post(isAuth, createBusiness);
router.route("/:id").patch(isAuth, updateBusiness);
router.route("/:id").get(isAuth, getBusiness);
router.route("/:id").delete(isAuth, deleteBusiness);

export default router;
