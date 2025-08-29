import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  createBusiness,
  deleteBusiness,
  getBusiness,
  updateBusiness,
} from "../controllers/business.controller.js";
import { upload } from "../lib/multer.js";

const router = express.Router();

router.route("/").post(
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  isAuth,
  createBusiness
);
router.route("/:id").patch(isAuth, updateBusiness);
router.route("/:id").get(isAuth, getBusiness);
router.route("/:id").delete(isAuth, deleteBusiness);

export default router;
