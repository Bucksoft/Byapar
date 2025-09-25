import express from "express";
import {
  addBulkItems,
  createItem,
  deleteItem,
  deleteSingleItem,
  getAllItems,
  updateItem,
  updateStock,
} from "../controllers/item.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/stock").patch(isAuth, updateStock);
router.route("/bulk/:id").post(isAuth, addBulkItems);
router.route("/:id").post(isAuth, createItem);
router.route("/all/:id").get(isAuth, getAllItems);
router.route("/").delete(isAuth, deleteItem);
router.route("/:id").delete(isAuth, deleteSingleItem);
router.route("/:id").patch(isAuth, updateItem);

export default router;
