import mongoose from "mongoose";
import { salesInvoiceSchema } from "../config/validation.js";
import { Item } from "../models/item.schema.js";
import Party from "../models/party.schema.js";
import PurchaseInvoice from "../models/purchaseInvoice.schema.js";
import PurchaseReturn from "../models/purchaseReturn.schema.js";

export async function createPurchaseReturn(req, res) {
  try {
    const data = req.body;

    const party = await Party.findOne({
      _id: data?.partyId,
      partyName: data?.partyName,
    });

    if (!party) {
      return res.status(400).json({
        success: false,
        msg: "Party doesn't exist",
      });
    }

    const existingPurchaseReturn = await PurchaseReturn.findOne({
      purchaseReturnNumber: data?.purchaseInvoiceNumber,
    });

    let originalInvoice = null;
    if (data?.invoiceId && data?.invoiceId !== "") {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(data.invoiceId);
      if (!isValidObjectId) {
        return res.status(400).json({
          success: false,
          msg: "Invalid invoiceId format",
        });
      }

      originalInvoice = await PurchaseInvoice.findById(data.invoiceId);
      if (!originalInvoice) {
        return res.status(404).json({
          success: false,
          msg: "Original purchase invoice not found",
        });
      }
    }

    if (!data?.items || !Array.isArray(data.items) || data.items.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "No items provided for purchase return",
      });
    }

    for (const returnedItem of data.items) {
      const item = await Item.findById(returnedItem?._id);
      if (!item) {
        return res.status(404).json({
          success: false,
          msg: `Item not found: ${returnedItem?.itemName}`,
        });
      }

      await Item.findByIdAndUpdate(returnedItem._id, {
        $inc: { currentStock: -Number(returnedItem?.quantity || 0) },
      });
    }

    const { _id, purchaseInvoiceNumber, purchaseInvoiceDate, ...cleanData } =
      data;

    if (!cleanData.invoiceId || cleanData.invoiceId === "") {
      delete cleanData.invoiceId;
    }

    const purchaseReturnNumber =
      Number(existingPurchaseReturn?.purchaseReturnNumber) + 1 ||
      Number(data?.salesInvoiceNumber);

    const purchaseReturn = await PurchaseReturn.create({
      partyId: party._id,
      purchaseReturnNumber,
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
    console.error("ERROR IN CREATING PURCHASE RETURN:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
}

export async function getAllPurchaseReturn(req, res) {
  try {
    const businessId = req.params.id;
    const latestPurchaseReturn = await PurchaseReturn.findOne({ businessId })
      .sort("-purchaseReturnNumber")
      .limit(1);

    const purchaseReturn = await PurchaseReturn.find({
      $and: [{ businessId: businessId, clientId: req?.user?.id }],
    }).populate("invoiceId");

    if (!purchaseReturn) {
      return res
        .status(400)
        .json({ success: false, msg: "Purchase return not found" });
    }

    return res.status(200).json({
      success: true,
      purchaseReturn,
      totalPurchaseReturn: purchaseReturn.length,
      latestPurchaseReturnNumber: latestPurchaseReturn?.purchaseReturnNumber,
    });
  } catch (error) {
    console.log("ERROR IN CREATING PURCHASE RETURN");
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function getPurchaseReturnById(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide purchase return id" });
    }
    const purchaseReturn = await PurchaseReturn.findById(id).populate(
      "partyId"
    );
    if (!purchaseReturn) {
      return res
        .status(400)
        .json({ status: false, msg: "Failed to find purchase return" });
    }
    return res.status(200).json({ success: true, purchaseReturn });
  } catch (error) {
    console.log("ERROR IN GETTING PURCHASE RETURN");
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function deletePurchaseReturn(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide purchase return id" });
    }
    const deletedSalesReturn = await PurchaseReturn.findById(id);
    if (!deletedSalesReturn) {
      return res
        .status(400)
        .json({ status: false, msg: "Purchase return not found" });
    }
    deletedSalesReturn.status = "cancelled";
    await deletePurchaseReturn.save();
    return res.status(200).json({ success: true, msg: "Deleted Sales Return" });
  } catch (error) {
    console.log("ERROR IN DELETING SALES RETURN");
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function getAllPurchaseReturnOfAParty(req, res) {
  try {
    const businessId = req.query?.businessId;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ msg: "Please provide a valid party id" });
    }
    const purchaseReturns = await PurchaseReturn.find({
      partyId: id,
      businessId,
    });
    return res.status(200).json({ success: true, purchaseReturns });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
