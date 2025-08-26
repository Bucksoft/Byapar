import express from "express";
import {
  createItem,
  deleteItem,
  deleteSingleItem,
  getAllItems,
} from "../controllers/item.controller.js";

const router = express.Router();

router.route("/").post(createItem);
router.route("/all").get(getAllItems);
router.route("/").delete(deleteItem);
router.route("/:id").delete(deleteSingleItem);

export default router;
