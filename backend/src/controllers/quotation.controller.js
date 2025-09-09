import Party from "../models/party.schema.js";
import Quotation from "../models/quotation.schema.js";

export async function createQuotation(req, res) {
  try {
    const data = req.body;
    // if (!validatedResult.success) {
    //   const validationError = validatedResult.error.format();
    //   return res
    //     .status(422)
    //     .json({ success: false, msg: "Validation failed", validationError });
    // }

    const partyName = data?.partyName;
    const party = await Party.findOne({
      partyName,
    });

    if (!party) {
      return res
        .status(400)
        .json({ success: false, msg: "Party doesn't exists" });
    }

    const existingQuotation = await Quotation.findOne({
      quotationNumber: data?.salesInvoiceNumber,
    });

    if (existingQuotation) {
      return res.status(400).json({
        success: false,
        msg: "Invoice already exists with this invoice number",
      });
    }

    const quotation = await Quotation.create({
      partyId: party?._id,
      ...data,
      quotationNumber: data?.salesInvoiceNumber,
      quotationDate: data?.salesInvoiceDate,
      businessId: req.params?.id,
      clientId: req.user?.id,
    });

    if (!quotation) {
      return res
        .status(400)
        .json({ success: false, msg: "Quotation could not be created" });
    }

    return res.status(201).json({
      success: true,
      msg: "Quotation created successfully",
      quotation,
    });
  } catch (error) {
    console.log("Error in creating quotation");
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server error" });
  }
}

export async function getQuotationById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide quotation Id" });
    }
    const quotation = await Quotation.findById(id).populate("partyId");
    if (!quotation) {
      return res
        .status(400)
        .json({ success: false, msg: "Quotation not found", quotation });
    }
    return res.status(200).json({ success: true, quotation });
  } catch (error) {
    console.log("Error in getting  quotation");
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server error" });
  }
}

export async function getAllQuotations(req, res) {
  try {
    const quotations = await Quotation.find({
      businessId: req.params?.id,
    }).populate("partyId");
    if (!quotations) {
      return res
        .status(400)
        .json({ success: false, msg: "Quotations not found" });
    }
    return res.status(200).json({ success: true, quotations });
  } catch (error) {
    console.log("Error in getting  quotations", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server error" });
  }
}
