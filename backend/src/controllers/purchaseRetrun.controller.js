import mongoose from "mongoose";
import { salesInvoiceSchema } from "../config/validation.js";
import { Item } from "../models/item.schema.js";
import Party from "../models/party.schema.js";
import PurchaseInvoice from "../models/purchaseInvoice.schema.js";
import PurchaseReturn from "../models/purchaseReturn.schema.js";

import SalesReturn from "../models/salesReturn.schema.js";

export async function createPurchaseReturn(req, res) {
  try {
    const data = req.body;

    // if (!validatedResult.success) {
    //   const validationError = validatedResult.error.format();
    //   return res
    //     .status(422)
    //     .json({ success: false, msg: "Validation failed", validationError });
    // }

    const party = await Party.findOne({ partyName: data?.partyName });

    if (!party) {
      return res
        .status(400)
        .json({ success: false, msg: "Party doesn't exist" });
    }

    const existingPurchaseReturn = await PurchaseReturn.findOne({
      purchaseReturnNumber: data?.purchaseInvoiceNumber,
    });

    if (existingPurchaseReturn) {
      return res.status(400).json({
        success: false,
        msg: "Purchase Return already exists with this invoice number",
      });
    }
    let originalInvoice = null;
    if (data?.invoiceId && data?.invoiceId !== "") {
      const invoiceId = new mongoose.Types.ObjectId(data?.invoiceId);
      originalInvoice = await PurchaseInvoice.findById(invoiceId);

      if (!originalInvoice) {
        return res.status(400).json({
          success: false,
          msg: "Original purchase invoice not found",
        });
      }
    }

    console.log(req.body);

    for (const returnedItem of data?.items) {
      const item = await Item.findById(returnedItem?._id);
      if (!item) {
        return res.status(404).json({
          success: false,
          msg: `Item not found: ${returnedItem?.itemName}`,
        });
      }

      await Item.findByIdAndUpdate(returnedItem?._id, {
        $inc: { currentStock: -returnedItem?.quantity },
      });
    }

    const { _id, purchaseInvoiceNumber, purchaseInvoiceDate, ...cleanData } =
      data;

    const purchaseReturn = await PurchaseReturn.create({
      partyId: party?._id,
      purchaseReturnNumber: req.body?.purchaseInvoiceNumber,
      businessId: req.params?.id,
      clientId: req.user?.id,
      ...cleanData,
    });

    if (!purchaseReturn) {
      return res.status(400).json({
        success: false,
        msg: "Purchase return could not be created",
      });
    }

    return res.status(201).json({
      success: true,
      msg: "Purchase Return created successfully",
      purchaseReturn,
    });
  } catch (error) {
    console.log("ERROR IN CREATING PURCHASE RETURN");
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}
