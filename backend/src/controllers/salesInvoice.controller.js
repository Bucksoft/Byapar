import { salesInvoiceSchema } from "../config/validation.js";
import SalesInvoice from "../models/salesInvoiceSchema.js";
import Party from "../models/party.schema.js";

export async function createSalesInvoice(req, res) {
  try {
    const validatedResult = salesInvoiceSchema.safeParse(req.body);
    const partyName = validatedResult.data?.partyName;
    const party = await Party.findOne({
      partyName,
    });
    
    if (!party) {
      res.status(400).json({ success: false, msg: "Party doesn't exists" });
    }

    if (!validatedResult.success) {
      const validationError = validatedResult.error.format();
      return res
        .status(422)
        .json({ success: false, msg: "Validation failed", validationError });
    }

    const existingInvoice = await SalesInvoice.findOne({
      salesInvoiceNumber: validatedResult.data?.salesInvoiceNumber,
    });

    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        msg: "Invoice already exists with this invoice number",
      });
    }

    const salesInvoice = await SalesInvoice.create({
      partyId: party?._id,
      ...validatedResult.data,
    });

    if (!salesInvoice) {
      return res
        .status(400)
        .json({ success: false, msg: "Sales invoice could not be created" });
    }

    return res.status(201).json({
      success: true,
      msg: "Invoice created successfully",
      salesInvoice,
    });
  } catch (error) {
    console.log("ERROR IN CREATING SALES INVOICE ");
    return res.status(500).json({ err: "Internal server error", error });
  }
}
