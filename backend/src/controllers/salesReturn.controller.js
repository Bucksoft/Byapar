import mongoose from "mongoose";
import { salesInvoiceSchema } from "../config/validation.js";
import { Item } from "../models/item.schema.js";
import Party from "../models/party.schema.js";
import SalesInvoice from "../models/salesInvoiceSchema.js";
import SalesReturn from "../models/salesReturn.schema.js";

export async function createSalesReturn(req, res) {
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

    const existingSalesReturn = await SalesReturn.findOne({
      salesReturnNumber: validatedResult.data?.salesInvoiceNumber,
      businessId: req?.params?.id,
    });

    let itemsToProcess = [];

    const hasInvoiceId =
      req.body?.invoiceId &&
      req.body.invoiceId.trim() !== "" &&
      mongoose.isValidObjectId(req.body.invoiceId);

    let originalInvoice = null;
    if (hasInvoiceId) {
      const invoiceId = new mongoose.Types.ObjectId(req.body.invoiceId);
      originalInvoice = await SalesInvoice.findById(invoiceId);

      if (!originalInvoice) {
        return res
          .status(400)
          .json({ success: false, msg: "Original Invoice not found" });
      }

      itemsToProcess = data?.items || [];
    } else {
      if (!data?.items?.length) {
        return res.status(400).json({
          success: false,
          msg: "No items provided for manual sales return",
        });
      }
      itemsToProcess = data.items;
    }

    // updating stock
    for (const returnedItem of itemsToProcess) {
      const item = await Item.findById(returnedItem?._id);
      if (!item) {
        return res.status(404).json({
          success: false,
          msg: `Item not found: ${returnedItem?.itemName}`,
        });
      }

      await Item.findByIdAndUpdate(returnedItem._id, {
        $inc: { currentStock: returnedItem.quantity },
      });
    }

    // // updating sales invoice
    const returnTotals = itemsToProcess.reduce((acc, item) => {
      return acc + item?.quantity * item?.salesPrice;
    }, 0);

    if (hasInvoiceId && originalInvoice) {
      const updatedBalance = originalInvoice?.balanceAmount - returnTotals;

      await SalesInvoice.findByIdAndUpdate(originalInvoice._id, {
        $set: {
          balanceAmount: Math.max(0, updatedBalance),
          status: updatedBalance <= 0 ? "paid" : "unpaid",
        },
      });
    }

    const {
      _id,
      salesInvoiceNumber,
      salesInvoiceDate,
      invoiceId,
      ...cleanData
    } = data;

    const totalAmount = Number(req.body?.totalAmount || 0);
    const amountPaid = Number(req.body?.receivedAmount || 0);
    const balanceAmount = totalAmount - amountPaid;
    const pendingAmount = totalAmount - amountPaid;
    const settledAmount = amountPaid;

    const salesReturnPayload = {
      partyId: party._id,
      salesReturnNumber:
        (existingSalesReturn && existingSalesReturn?.salesInvoiceNumber + 1) ||
        validatedResult.data?.salesInvoiceNumber,
      businessId: req.params?.id,
      clientId: req.user?.id,
      amountPaid,
      balanceAmount,
      pendingAmount,
      settledAmount,
      ...cleanData,
    };

    if (hasInvoiceId) {
      salesReturnPayload.invoiceId = req.body.invoiceId;
    }

    const salesReturn = await SalesReturn.create(salesReturnPayload);
    if (!salesReturn) {
      return res.status(400).json({
        success: false,
        msg: "Sales return could not be created",
      });
    }

    const returnTotal = salesReturn?.balanceAmount || 0;

    party.currentBalance = (party.currentBalance || 0) - returnTotal;

    party.totalDebits = Math.max(0, (party.totalDebits || 0) - returnTotal);
    party.totalInvoices = Math.max(0, (party.totalInvoices || 0) - returnTotal);

    party.totalCredits = (party.totalCredits || 0) + returnTotal;

    await party.save();

    return res.status(201).json({
      success: true,
      msg: "Sales Return created successfully",
      salesReturn,
    });
  } catch (error) {
    console.log("ERROR IN CREATING SALES RETURN", error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function getAllSalesReturn(req, res) {
  try {
    const businessId = req.params.id;
    const latestSalesReturn = await SalesReturn.findOne({ businessId })
      .sort("-salesReturnNumber")
      .limit(1);

    const salesReturn = await SalesReturn.find({
      $and: [{ businessId: businessId, clientId: req?.user?.id }],
    }).populate("invoiceId");

    if (!salesReturn) {
      return res
        .status(400)
        .json({ success: false, msg: "Sales return not found" });
    }

    return res.status(200).json({
      success: true,
      salesReturn,
      totalSalesReturn: salesReturn.length,
      latestSalesReturnNumber: latestSalesReturn?.salesReturnNumber,
    });
  } catch (error) {
    console.log("ERROR IN CREATING SALES RETURN");
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function deleteSaleReturn(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide sales return id" });
    }

    const salesReturn = await SalesReturn.findById(id);
    if (!salesReturn) {
      return res
        .status(404)
        .json({ success: false, msg: "Sales return not found" });
    }

    if (salesReturn.status === "cancelled") {
      return res.status(400).json({
        success: false,
        msg: "Sales return already cancelled",
      });
    }

    // Revert stock
    if (Array.isArray(salesReturn?.items)) {
      for (const item of salesReturn.items) {
        const dbItem = await Item.findById(item?._id);
        if (dbItem) {
          // Decrease stock since returned goods are now being "unreturned"
          dbItem.currentStock =
            (dbItem.currentStock || 0) - Number(item.quantity || 0);
          await dbItem.save();
        }
      }
    }

    // Reverse party balance adjustments
    const party = await Party.findById(salesReturn?.partyId?._id);
    if (party) {
      const reversalAmount = Number(salesReturn.balanceAmount || 0);
      party.currentBalance = (party.currentBalance || 0) + reversalAmount;
      party.totalDebits = (party.totalDebits || 0) + reversalAmount;
      party.totalInvoices = (party.totalInvoices || 0) + reversalAmount;
      party.totalCredits = (party.totalCredits || 0) - reversalAmount;

      await party.save();
    }

    // Mark sales return as cancelled
    salesReturn.status = "cancelled";
    await salesReturn.save();

    return res.status(200).json({
      success: true,
      msg: "Sales return cancelled successfully",
    });
  } catch (error) {
    console.log("ERROR IN DELETING SALES RETURN", error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function getSaleReturnById(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide sales return id" });
    }
    const saleReturn = await SalesReturn.findById(id).populate("partyId");
    if (!saleReturn) {
      return res
        .status(400)
        .json({ status: false, msg: "Failed to find sale return" });
    }
    return res.status(200).json({ success: true, saleReturn });
  } catch (error) {
    console.log("ERROR IN GETTING SALE RETURN");
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function getAllSalesReturnsOfAParty(req, res) {
  try {
    const businessId = req.query?.businessId;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ msg: "Please provide a valid party id" });
    }
    const salesReturns = await SalesReturn.find({
      partyId: id,
      businessId,
    });
    return res.status(200).json({ success: true, salesReturns });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
