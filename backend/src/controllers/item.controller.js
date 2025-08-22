import { itemSchema } from "../config/validation.js";
import { Item } from "../models/item.schema.js";

export async function createItem(req, res) {
  try {
    // get and parse the data
    const parsedData = itemSchema.safeParse(req.body);

    // check for existing item
    const existingItem = await Item.findOne({
      $or: [
        { itemCode: parsedData.itemCode },
        { itemName: parsedData.itemName },
      ],
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ success: false, msg: "Item already exist" });
    }

    // create a new item
    const newItem = await Item.create(parsedData.data);

    // return success response
    return res
      .status(201)
      .json({ success: true, msg: "Item created", newItem });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(422).json({
        success: false,
        msg: "Validation failed",
        errors: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    console.error("Error in creating item", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: true, msg: "Please provide the item id" });
    }
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res
        .status(400)
        .json({ success: true, msg: "Item could not be deleted" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Item deleted successfully" });
  } catch (error) {
    console.error("Error in creating item", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function getItem(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: true, msg: "Please provide the item id" });
    }
    const item = await Item.findById(id);
    if (!item) {
      return res
        .status(400)
        .json({ success: true, msg: "Item could not be found" });
    }
    return res.status(200).json({ success: true, item });
  } catch (error) {
    console.error("Error in creating item", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function getAllItems(req, res) {
  try {
    const items = await Item.find();
    if (!items) {
      return res.status(400).json({ success: true, msg: "Item not found" });
    }
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("Error in creating item", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function updateItem(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: true, msg: "Please provide the item id" });
    }

    const parsedData = itemSchema.safeParse(req.body);

    const updatedItem = await Item.findByIdAndUpdate(id, parsedData.data);
    if (!updatedItem) {
      return res
        .status(400)
        .json({ success: true, msg: "Item could not be updated" });
    }
    return res.status(200).json({ success: true, updatedItem });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(422).json({
        success: false,
        msg: "Validation failed",
        errors: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    console.error("Error in creating item", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}