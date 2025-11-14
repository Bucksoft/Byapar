import mongoose from "mongoose";
import POS from "../models/POS.schema.js";
import { Item } from "../models/item.schema.js";
export async function createPOS(req, res) {
  try {
    if (req.body?.items?.length === 0) {
      return res.status(400).json({ msg: "Please provide the items" });
    }

    // DECREASE THE CURRENT STOCK OF THE ITEM
    for (let item of req.body?.items) {
      const dbItem = await Item.findById(item?._id);

      if (dbItem) {
        dbItem.currentStock =
          (dbItem.currentStock || 0) - Number(item?.quantity || 0);
        await dbItem.save();
      }
    }

    const balanceAmount = req.body?.totalAmount - req.body?.receivedAmount;
    const pos = await POS.create({
      ...req.body,
      businessId: new mongoose.Types.ObjectId(req.query.businessId),
      clientId: new mongoose.Types.ObjectId(req.user?.id),
      balanceAmount,
    });

    return res.status(200).json({ msg: "Created successfully", pos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
