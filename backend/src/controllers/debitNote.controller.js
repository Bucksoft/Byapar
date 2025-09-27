import { salesInvoiceSchema } from "../config/validation.js";
import { Item } from "../models/item.schema.js";
import Party from "../models/party.schema.js";
import DebitNote from "../models/debitNote.schema.js";
import PurchaseInvoice from "../models/purchaseInvoice.schema.js";

export async function createDebitNote(req, res) {
  try {
    const validatedResult = salesInvoiceSchema.safeParse(req.body);
    const data = req.body;

    if (!validatedResult.success) {
      const validationError = validatedResult.error.format();
      return res
        .status(422)
        .json({ success: false, msg: "Validation failed", validationError });
    }

    const partyName = validatedResult.data?.partyName;
    const party = await Party.findOne({ partyName });
    if (!party) {
      return res
        .status(400)
        .json({ success: false, msg: "Party doesn't exist" });
    }

    const existingdebitNote = await DebitNote.findOne({
      debitNoteNumber: validatedResult.data?.salesInvoiceNumber,
      businessId: req?.params?.id,
    });
    if (existingdebitNote) {
      return res.status(400).json({
        success: false,
        msg: "Debit Note already exists with this invoice number",
      });
    }

    let itemsToProcess = [];

    const hasInvoiceId =
      req.body?.invoiceId &&
      req.body.invoiceId.trim() !== "" &&
      mongoose.isValidObjectId(req.body.invoiceId);

    if (hasInvoiceId) {
      const invoiceId = new mongoose.Types.ObjectId(req.body.invoiceId);
      const originalInvoice = await PurchaseInvoice.findById(invoiceId);

      // if (originalInvoice) {
      //   originalInvoice.pendingAmount =
      //     (originalInvoice.pendingAmount || originalInvoice.totalAmount) -
      //     debitNote.totalAmount;

      //   if (originalInvoice.pendingAmount <= 0) {
      //     originalInvoice.pendingAmount = 0;
      //     originalInvoice.status = "paid";
      //   } else {
      //     originalInvoice.status = "partially_paid";
      //   }

      //   await originalInvoice.save();
      // }

      itemsToProcess = data?.items || [];
    } else {
      if (!data?.items?.length) {
        return res.status(400).json({
          success: false,
          msg: "No items provided for manual debit Note",
        });
      }
      itemsToProcess = data.items;
    }

    for (const debitNoteItem of itemsToProcess) {
      const item = await Item.findById(debitNoteItem?._id);
      if (!item) {
        return res.status(404).json({
          success: false,
          msg: `Item not found: ${debitNoteItem?.itemName}`,
        });
      }

      await Item.findByIdAndUpdate(debitNoteItem._id, {
        $inc: { currentStock: -debitNoteItem.quantity },
      });
    }

    const {
      salesInvoiceNumber,
      salesInvoiceDate,
      invoiceId,
      _id,
      ...cleanData
    } = req.body;

    const payload = {
      debitNoteNumber: req.body?.salesInvoiceNumber,
      debitNoteDate: req.body?.salesInvoiceDate,
      clientId: req.user?.id,
      businessId: req.params?.id,
      partyId: party?._id,
      status: "unpaid",
      ...cleanData,
    };

    if (hasInvoiceId) {
      payload.invoiceId = new mongoose.Types.ObjectId(req.body.invoiceId);
    }

    const debitNote = await DebitNote.create({
      ...payload,
    });

    if (!debitNote) {
      return res
        .status(400)
        .json({ success: false, msg: "Failed to create debit note" });
    }

    // ADJUSTING PARTY BALANCE
    if (party && debitNote.totalAmount > 0) {
      party.currentBalance = party.currentBalance - debitNote.totalAmount;
      await party.save();
    }
  } catch (error) {
    console.log("Error in creating debit note", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function getAllDebitNotes(req, res) {
  try {
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server error" });
  }
}

export async function getDebitNoteById(req, res) {
  try {
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server error" });
  }
}
