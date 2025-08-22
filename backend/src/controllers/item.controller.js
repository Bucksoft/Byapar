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
    const newItem = await Item.create(parsedData);

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
