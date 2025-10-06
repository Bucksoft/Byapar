import mongoose from "mongoose";
import { salesInvoiceSchema } from "../config/validation.js";
import { Item } from "../models/item.schema.js";
import Party from "../models/party.schema.js";
import PurchaseInvoice from "../models/purchaseInvoice.schema.js";

// Route    POST   /api/v1/purchase-invoice/:businessId
// Desc     CREATE PURCHASE INVOICE
// access   PRIVATE
export async function createPurchaseInvoice(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = req.body;

    const validatedResult = salesInvoiceSchema.safeParse(data);
    if (!validatedResult.success) {
      const validationError = validatedResult.error.format();
      return res.status(422).json({
        success: false,
        msg: "Validation failed",
        validationError,
      });
    }

    const {
      salesInvoiceNumber,
      salesInvoiceDate,
      partyName,
      totalAmount,
      ...rest
    } = validatedResult.data;
    const items = req.body?.items;
    const party = await Party.findOne({ partyName }).session(session);
    if (!party) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        msg: "Party doesn't exist",
      });
    }

    const existingPurchaseInvoice = await PurchaseInvoice.findOne({
      salesInvoiceNumber,
    }).session(session);

    if (existingPurchaseInvoice) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        msg: "Invoice already exists with this number",
      });
    }

    for (const purchaseItem of items) {
      const item = await Item.findById(purchaseItem?._id).session(session);
      if (!item) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          msg: `Item not found: ${purchaseItem?._id}`,
        });
      }

      if (purchaseItem?.quantity <= 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          msg: `Invalid quantity for item ${item?.itemName}`,
        });
      }

      await Item.findByIdAndUpdate(
        purchaseItem._id,
        { $inc: { currentStock: purchaseItem.quantity } },
        { session }
      );
    }

    const purchaseInvoice = await PurchaseInvoice.create(
      [
        {
          purchaseInvoiceNumber: salesInvoiceNumber,
          purchaseInvoiceDate: salesInvoiceDate,
          partyId: party._id,
          partyName: party.partyName,
          businessId: req.params.id,
          clientId: req.user?.id,
          type: "purchase invoice",
          items,
          totalAmount,
          ...rest,
        },
      ],
      { session }
    );

    if (!purchaseInvoice || purchaseInvoice.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        msg: "Failed to create purchase invoice",
      });
    }

    await Party.findByIdAndUpdate(
      party._id,
      { $inc: { currentBalance: -totalAmount || 0 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      msg: "Purchase Invoice created successfully",
      purchaseInvoice: purchaseInvoice[0],
    });
  } catch (error) {
    console.error(`Error in creating purchase invoice: ${error}`);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
      error: error.message,
    });
  }
}

// Route    GET   /api/v1/purchase-invoice/:businessId
// Desc     GET ALL PURCHASE INVOICES
// access   PRIVATE
export async function getAllPurchaseInvoice(req, res) {
  try {
    const purchaseInvoices = await PurchaseInvoice.find({
      $and: [{ businessId: req.params?.id, clientId: req.user?.id }],
    })
      .populate("partyId")
      .sort("purchaseInvoiceDate");
    const totalPurchaseInvoices = await PurchaseInvoice.countDocuments({});
    if (!purchaseInvoices) {
      return res
        .status(400)
        .json({ success: false, msg: "Invoices not found" });
    }
    return res
      .status(200)
      .json({ success: true, purchaseInvoices, totalPurchaseInvoices });
  } catch (error) {
    console.log("ERROR IN GETTING  PURCHASE INVOICE ");
    return res.status(500).json({ err: "Internal server error", error });
  }
}

// Route    DELETE   /api/v1/purchase-invoice/:id
// Desc     DELETE PURCHASE INVOICE
// access   PRIVATE
export async function deletePurchaseInvoice(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    if (!id) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, msg: "Please provide invoice id" });
    }

    const deletedInvoice = await PurchaseInvoice.findById(id)
      .populate("partyId")
      .session(session);

    if (!deletedInvoice) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, msg: "Failed to delete purchase invoice" });
    }

    // Decrement party's currentBalance
    await Party.findByIdAndUpdate(
      deletedInvoice.partyId._id,
      { $inc: { currentBalance: -deletedInvoice.totalAmount } },
      { session }
    );

    // Decrement each item's currentStock
    for (const item of deletedInvoice.items) {
      await Item.findByIdAndUpdate(
        item._id || item.itemId, // support both _id and itemId
        { $inc: { currentStock: -item.quantity } },
        { session }
      );
    }

    // Mark the invoice as cancelled
    deletedInvoice.status = "cancelled";
    await deletedInvoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({ success: true, msg: "Invoice deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("ERROR IN DELETING PURCHASE INVOICE ");
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

// Route    GET   /api/v1/purchase-invoice/invoice/:id
// Desc     GET PURCHASE INVOICE BY ID
// access   PRIVATE
export async function getPurchaseInvoiceById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide a valid invoice id" });
    }

    let invoice = await PurchaseInvoice.findById(id)
      .populate("partyId")
      .populate("items.itemId");

    if (!invoice) {
      return res.status(404).json({ success: false, msg: "Invoice not found" });
    }

    invoice = invoice.toObject();

    return res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("ERROR IN GETTING PURCHASE INVOICE:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}
