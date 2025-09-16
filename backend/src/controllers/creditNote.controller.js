import mongoose from "mongoose";
import { salesInvoiceSchema } from "../config/validation.js";
import CreditNote from "../models/creditNote.schema.js";
import Party from "../models/party.schema.js";
import SalesInvoice from "../models/salesInvoiceSchema.js";

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
    const party = await Party.findOne({
      partyName,
    });

    if (!party) {
      return res
        .status(400)
        .json({ success: false, msg: "Party doesn't exists" });
    }

    const existingCreditNote = await CreditNote.findOne({
      salesInvoiceNumber: validatedResult.data?.creditNoteNumber,
    });

    if (existingCreditNote) {
      return res.status(400).json({
        success: false,
        msg: "Credit note already exists with this invoice number",
      });
    }
    

    return res.status(200).json({ msg: "Credit Note created", creditNote });
  } catch (error) {
    console.log("Error in creating credit note", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}
