import { salesInvoiceSchema } from "../config/validation.js";
import Party from "../models/party.schema.js";
import ProformaInvoice from "../models/proformaInvoice.schema.js";

// CREATING PROFORMA INVOICE
export async function createProformaInvoice(req, res) {
  try {
    const data = req.body;
    const validatedResult = salesInvoiceSchema.safeParse(req.body);
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

    const existingProformaInvoice = await ProformaInvoice.findOne({
      proformaInvoiceNumber: validatedResult?.data?.salesInvoiceNumber,
    });

    if (existingProformaInvoice) {
      return res.status(400).json({
        success: false,
        msg: "Proforma Invoice already exists.",
      });
    }

    const {
      salesInvoiceNumber,
      salesInvoiceDate,
      validFor,
      validityDate,
      ...cleanData
    } = data;

    const proformaInvoice = await ProformaInvoice.create({
      partyId: party?._id,
      proformaInvoiceNumber: validatedResult?.data?.salesInvoiceNumber,
      proformaInvoiceDate: validatedResult?.data?.salesInvoiceDate,
      businessId: req.params?.id,
      clientId: req.user?.id,
      status: "open",
      ...cleanData,
    });

    if (!proformaInvoice) {
      return res
        .status(400)
        .json({ success: false, msg: "Proforma Invoice could not be created" });
    }

    return res.status(201).json({
      success: true,
      msg: "Proforma Invoice created successfully",
      proformaInvoice,
    });
  } catch (error) {
    console.log("Error in creating proforma invoice", error);
    return res
      .status(400)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

// GETTING ALL PROFORMA INVOICES
export async function getAllProformaInvoices(req, res) {
  try {
    const businessId = req.params?.id;
    const totalProformaInvoices = await ProformaInvoice.countDocuments({});
    if (!businessId) {
      return res
        .status(400)
        .json({ success: false, msg: "Business Id not provided" });
    }

    const proformaInvoices = await ProformaInvoice.find({
      $and: [{ businessId }, { clientId: req.user?.id }],
    }).populate("partyId");

    if (!proformaInvoices) {
      return res
        .status(400)
        .json({ status: false, msg: "Proforma Invoices not found" });
    }
    return res
      .status(200)
      .json({ success: true, proformaInvoices, totalProformaInvoices });
  } catch (error) {
    console.log("Error in getting proforma invoices", error);
    return res
      .status(400)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

// GETTING PROFORMA BY ID
export async function getProformaById(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide the challan id" });
    }
    const proformaInvoice = await ProformaInvoice.findById(id).populate(
      "partyId"
    );
    if (!proformaInvoice) {
      return res
        .status(400)
        .json({ success: false, msg: "Proforma Invoice not found" });
    }
    return res.status(200).json({ success: true, proformaInvoice });
  } catch (error) {
    console.log("Error in getting single proforma invoice", error);
    return res
      .status(400)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

// DELETING PROFORMA INVOICE
export async function deleteProformaInvoice(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "Please provide the proforma invoice id",
      });
    }
    const proformaInvoice = await ProformaInvoice.findById(id);
    if (!proformaInvoice) {
      return res
        .status(400)
        .json({ success: false, msg: "Proforma invoice not found" });
    }
    proformaInvoice.status = "expired";
    await proformaInvoice.save();
    return res
      .status(200)
      .json({ success: true, msg: "Proforma invoice deleted successfully" });
  } catch (error) {
    console.log("Error in deleting proforma invoice", error);
    return res
      .status(400)
      .json({ success: false, msg: "Internal Server Error" });
  }
}
