import mongoose from "mongoose";
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
      businessId: req.params.id,
    });

    const { salesInvoiceNumber, salesInvoiceDate, ...cleanData } = data;
    const quotation = await Quotation.create({
      partyId: party?._id,
      ...cleanData,
      quotationNumber: existingQuotation
        ? existingQuotation?.quotationNumber + 1
        : data?.salesInvoiceNumber,
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
    const latestQuotation = await Quotation.findOne({
      businessId: req.params?.id,
    })
      .sort("-quotationNumber")
      .limit(1);
    const quotations = await Quotation.find({
      $and: [
        {
          businessId: req.params?.id,
        },
        {
          clientId: req.user?.id,
        },
      ],
    }).populate("partyId");
    if (!quotations) {
      return res
        .status(400)
        .json({ success: false, msg: "Quotations not found" });
    }
    return res.status(200).json({
      success: true,
      quotations,
      totalQuotations: latestQuotation?.quotationNumber || 0,
    });
  } catch (error) {
    console.log("Error in getting  quotations", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server error" });
  }
}

export async function deleteQuotation(req, res) {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    if (!id) {
      return res.status(400).json({ msg: "Please provide invoice id" });
    }
    const deletedQuotation = await Quotation.findById(id);
    if (!deletedQuotation) {
      return res.status(400).json({ msg: "Quotation not found" });
    }
    console.log(deleteQuotation);
    deletedQuotation.status = "expired";
    await deletedQuotation.save();
    return res.status(200).json({ msg: "Quotation deleted successfully" });
  } catch (error) {
    console.log("Error in deleting quotation", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server error" });
  }
}

export async function updateQuotation(req, res) {
  try {
    console.log(req.body);
    console.log(req.params);
    return res.json({ msg: "OK" });
  } catch (error) {
    console.log("Error in updating quotation", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server error" });
  }
}

export async function getAllQuotationsOfAParty(req, res) {
  try {
    const businessId = req.query?.businessId;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ msg: "Please provide a valid party id" });
    }
    const quotations = await Quotation.find({
      partyId: id,
      businessId,
    });
    return res.status(200).json({ success: true, quotations });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
