import { itemSchema } from "../config/validation.js";
import { Item } from "../models/item.schema.js";

export async function createItem(req, res) {
  try {
    const parsedData = itemSchema.safeParse(req.body.data);
    if (!parsedData.success) {
      return res.status(422).json({
        success: false,
        msg: "Validation failed",
        validationError: parsedData.error.format(),
      });
    }

    const itemData = parsedData.data;

    const existingItem = await Item.findOne({
      itemName: itemData.itemName,
      businessId: req.params?.id,
    });
    if (existingItem) {
      return res
        .status(400)
        .json({ success: false, msg: "Item already exists" });
    }

    if (itemData.purchasePrice) {
      itemData.purchasePrice = Number(itemData.purchasePrice);
    }
    if (itemData.lowStockQuantity) {
      itemData.lowStockQuantity = Number(itemData.lowStockQuantity);
    }

    const newItem = await Item.create({
      ...itemData,
      businessId: req.params?.id,
      clientId: req.user?.id,
      currentStock: itemData.openingStock || 0,
    });

    return res.status(201).json({
      success: true,
      msg: "Item created successfully",
      item: newItem,
    });
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
    const businessId = req.params?.id;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        msg: "Business ID is required",
      });
    }

    const items = await Item.find({
      businessId,
      clientId: req.user?.id,
    });

    if (!items || items.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No items found for this business",
      });
    }

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("❌ Error in fetching items:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
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

export async function updateStock(req, res) {
  try {
    const data = req.body?.data;
    const item = await Item.findOne({ itemName: data?.activeItem?.name });
    if (!item) {
      return res.status(400).json({ success: false, msg: "Item not found" });
    }

    item.currentStock = data?.activeItem?.updatedStock;
    item.stockUpdationDate = data?.stockUpdationDate;
    item.remarks = data?.remarks;
    await item.save();

    return res.status(200).json({ msg: "Stock updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function addBulkItems(req, res) {
  try {
    const data = req.body;
    return res.status(200).json({ success: false, msg: "OK" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}
