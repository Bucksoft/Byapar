import { salesInvoiceSchema } from "../config/validation.js";
import SalesInvoice from "../models/salesInvoiceSchema.js";
import Party from "../models/party.schema.js";

export async function createSalesInvoice(req, res) {
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
      ...data,
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
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function getAllInvoices(req, res) {
  try {
    const invoices = await SalesInvoice.find()
      .populate("partyId")
      .sort("salesInvoiceDate");
    if (!invoices) {
      return res
        .status(400)
        .json({ success: false, msg: "Invoices not found" });
    }
    return res.status(200).json({ success: true, invoices });
  } catch (error) {
    console.log("ERROR IN GETTING  SALES INVOICE ");
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function deleteInvoice(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide invoice id" });
    }
    const deletedInvoice = await SalesInvoice.findByIdAndDelete(id);
    if (!deletedInvoice) {
      return res
        .status(400)
        .json({ success: false, msg: "Failed to delete sales invoice" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Invoice deleted successfully" });
  } catch (error) {
    console.log("ERROR IN DELETING SALES INVOICE ");
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function getInvoiceById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide a valid invoice id" });
    }

    let invoice = await SalesInvoice.findById(id)
      .populate("partyId")
      .populate("items.itemId");

    if (!invoice) {
      return res.status(404).json({ success: false, msg: "Invoice not found" });
    }

    invoice = invoice.toObject();

    console.log("Fetched Invoice:", JSON.stringify(invoice, null, 2));

    return res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("ERROR IN GETTING SALE INVOICE:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}
