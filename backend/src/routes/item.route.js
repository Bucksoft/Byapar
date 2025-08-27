import express from "express";
import {
  createItem,
  deleteItem,
  deleteSingleItem,
  getAllItems,
  updateItem,
} from "../controllers/item.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(isAuth, createItem);
router.route("/all").get(isAuth, getAllItems);
router.route("/").delete(isAuth, deleteItem);
router.route("/:id").delete(isAuth, deleteSingleItem);
router.route("/:id").patch(isAuth, updateItem);

export default router;
