import { itemSchema } from "../config/validation.js";
import { Item } from "../models/item.schema.js";

export async function createItem(req, res) {
  try {
    console.log("REQUEST BODY ", req.body.data);
    // get and parse the data
    const parsedData = itemSchema.safeParse(req.body.data);
    if (!parsedData.success) {
      const validationError = parsedData.error.format();
      return res
        .status(422)
        .json({ success: false, msg: "Validation failed", validationError });
    }

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
    console.log("PARSED DATA ", parsedData);
    const newItem = await Item.create(parsedData.data);

    // return success response
    return res
      .status(201)
      .json({ success: true, msg: "Item created", newItem });
  } catch (error) {
    console.error("Error in creating item", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function deleteItem(req, res) {
  try {
    const idsToBeDeleted = req.body;

    if (!Array.isArray(idsToBeDeleted) || idsToBeDeleted.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Invalid request. Provide an array of item IDs.",
      });
    }

    const itemsToBeDeleted = await Item.find({ _id: { $in: idsToBeDeleted } });

    if (itemsToBeDeleted.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No items found with the provided IDs.",
      });
    }

    await Item.deleteMany({ _id: { $in: idsToBeDeleted } });

    return res.status(200).json({
      success: true,
      msg: "Items deleted successfully.",
      deletedCount: itemsToBeDeleted.length,
    });
  } catch (error) {
    console.error("Error in deleting items:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function deleteSingleItem(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Provide a valid item id" });
    }
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res
        .status(400)
        .json({ success: false, msg: "Item not found with that id" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Item deleted successfully" });
  } catch (error) {
    console.error("Error in deleting item:", error);
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
    const parsedData = itemSchema.safeParse(req.body.data);

    const updatedItem = await Item.findByIdAndUpdate(id, parsedData.data);
    if (!updatedItem) {
      return res
        .status(400)
        .json({ success: true, msg: "Item could not be updated" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Item updated successfully", updatedItem });
  } catch (error) {
    console.error("Error in creating item", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}
