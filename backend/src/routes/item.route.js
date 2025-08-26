import express from "express";
import {
  createItem,
  deleteItem,
  deleteSingleItem,
  getAllItems,
  updateItem,
} from "../controllers/item.controller.js";

const router = express.Router();

router.route("/").post(createItem);
router.route("/all").get(getAllItems);
router.route("/").delete(deleteItem);
router.route("/:id").delete(deleteSingleItem);
router.route("/:id").patch(updateItem);

export default router;
