import { salesInvoiceSchema } from "../config/validation.js";
import CreditNote from "../models/creditNote.schema.js";
import Party from "../models/party.schema.js";
import SalesInvoice from "../models/salesInvoiceSchema.js";
import mongoose from "mongoose";
import { Item } from "../models/item.schema.js";

export async function createCreditNote(req, res) {
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

    const existingCreditNote = await CreditNote.findOne({
      creditNoteNumber: validatedResult.data?.salesInvoiceNumber,
      businessId: req?.params?.id,
    });
    if (existingCreditNote) {
      return res.status(400).json({
        success: false,
        msg: "Credit Note already exists with this invoice number",
      });
    }

    let itemsToProcess = [];

    const hasInvoiceId =
      req.body?.invoiceId &&
      req.body.invoiceId.trim() !== "" &&
      mongoose.isValidObjectId(req.body.invoiceId);

    if (hasInvoiceId) {
      const invoiceId = new mongoose.Types.ObjectId(req.body.invoiceId);
      const originalInvoice = await SalesInvoice.findById(invoiceId);

      // if (originalInvoice) {
      //   originalInvoice.pendingAmount =
      //     (originalInvoice.pendingAmount || originalInvoice.totalAmount) -
      //     creditNote.totalAmount;

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
          msg: "No items provided for manual Credit Note",
        });
      }
      itemsToProcess = data.items;
    }

    for (const creditNoteItem of itemsToProcess) {
      const item = await Item.findById(creditNoteItem?._id);
      if (!item) {
        return res.status(404).json({
          success: false,
          msg: `Item not found: ${creditNoteItem?.itemName}`,
        });
      }

      await Item.findByIdAndUpdate(creditNoteItem._id, {
        $inc: { currentStock: creditNoteItem.quantity },
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
      creditNoteNumber: req.body?.salesInvoiceNumber,
      creditNoteDate: req.body?.salesInvoiceDate,
      clientId: req.user?.id,
      businessId: req.params?.id,
      partyId: party?._id,
      status: "unpaid",
      ...cleanData,
    };

    if (hasInvoiceId) {
      payload.invoiceId = new mongoose.Types.ObjectId(req.body.invoiceId);
    }

    const creditNote = await CreditNote.create({
      ...payload,
    });

    if (!creditNote) {
      return res
        .status(400)
        .json({ success: false, msg: "Failed to create credit note" });
    }

    // ADJUSTING PARTY BALANCE
    if (party && creditNote.totalAmount > 0) {
      party.currentBalance = party.currentBalance - creditNote.totalAmount;
      await party.save();
    }
  } catch (error) {
    console.log("Error in creating credit note", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function getAllCreditNotes(req, res) {
  try {
    try {
      const businessId = req.params.id;
      const latestCreditNote = await CreditNote.findOne({ businessId })
        .sort("-creditNoteNumber")
        .limit(1);

      const creditNotes = await CreditNote.find({
        $and: [{ businessId: businessId, clientId: req?.user?.id }],
      }).populate("invoiceId");
      if (!creditNotes) {
        return res
          .status(400)
          .json({ success: false, msg: "Credit Notes not found" });
      }
      return res
        .status(200)
        .json({
          success: true,
          creditNotes,
          totalCreditNotes: latestCreditNote?.creditNoteNumber,
        });
    } catch (error) {
      console.log("ERROR IN GETTING CREDIT NOTES");
      return res.status(500).json({ err: "Internal server error", error });
    }
  } catch (error) {
    console.log("Error in creating credit note", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function getCreditNote(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide a valid credit note id" });
    }

    let creditNote = await CreditNote.findById(id)
      .populate("partyId")
      .populate("items.itemId");

    if (!creditNote) {
      return res
        .status(404)
        .json({ success: false, msg: "Credit Note not found" });
    }

    creditNote = creditNote.toObject();

    return res.status(200).json({
      success: true,
      creditNote,
    });
  } catch (error) {
    console.error("ERROR IN GETTING CREDIT NOTE :", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}
