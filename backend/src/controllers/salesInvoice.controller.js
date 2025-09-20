import { salesInvoiceSchema } from "../config/validation.js";
import SalesInvoice from "../models/salesInvoiceSchema.js";
import Party from "../models/party.schema.js";
import { Item } from "../models/item.schema.js";

// CONTROLLER TO CREATE A SALES INVOICE
export async function createSalesInvoice(req, res) {
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

    const existingInvoice = await SalesInvoice.findOne({
      salesInvoiceNumber: validatedResult.data?.salesInvoiceNumber,
      businessId: req?.params?.id,
    });

    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        msg: "Invoice already exists with this invoice number",
      });
    }

    // SALES INVOICE MEIN STOCK KAM HOTA HAI, AGR PRODUCT HAI TO WRNA SERVICE KE CASE MEIN NHI HOTA
    for (const soldItem of data?.items) {
      if (soldItem.itemType === "product") {
        const item = await Item.findById(soldItem?._id);
        if (!item) {
          return res.status(400).json({
            success: false,
            msg: `Item not found : ${item?.itemName}`,
          });
        }
        if (item?.currentStock < soldItem.quantity) {
          return res.status(400).json({
            success: false,
            msg: `Insufficient stock for ${item?.itemName}`,
          });
        }
        await Item.findByIdAndUpdate(soldItem?._id, {
          $inc: { currentStock: -soldItem?.quantity },
        });
      }
    }

    const salesInvoice = await SalesInvoice.create({
      partyId: party?._id,
      businessId: req.params?.id,
      clientId: req.user?.id,
      type: "sales invoice",
      ...data,
    });

    party.currentBalance =
      (party.currentBalance || 0) + salesInvoice.balanceAmount;
    // party.totalSales = (party.totalSales || 0) + salesInvoice.balanceAmount;
    party.totalDebits = (party.totalDebits || 0) + salesInvoice.balanceAmount;
    party.totalInvoices =
      (party.totalInvoices || 0) + salesInvoice.balanceAmount;
    party.totalCredits = (party.totalCredits || 0) - salesInvoice.balanceAmount;
    await party.save();

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

// CONTROLLER TO GET ALL THE SALES INVOICES
export async function getAllInvoices(req, res) {
  try {
    const invoices = await SalesInvoice.find({
      $and: [{ businessId: req.params?.id, clientId: req.user?.id }],
    })
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

// CONTROLLER TO DELETE INVOICE (MARK STATUS AS CANCELLED AND INCREMENT THE STOCK OF THAT ITEM)
export async function deleteInvoice(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide invoice id" });
    }

    const invoice = await SalesInvoice.findById(id).populate("partyId");
    if (!invoice) {
      return res.status(404).json({ success: false, msg: "Invoice not found" });
    }

    if (invoice.status === "cancelled") {
      return res
        .status(400)
        .json({ success: false, msg: "Invoice is already cancelled" });
    }

    const party = invoice.partyId;
    if (!party) {
      return res
        .status(400)
        .json({ success: false, msg: "Linked party not found" });
    }

    const reversalAmount = invoice.balanceAmount || 0;

    invoice.status = "cancelled";
    invoice.cancelledAt = new Date();
    invoice.cancelledBy = userId || null;
    invoice.pendingAmount = 0;
    invoice.settledAmount = 0;

    if (Array.isArray(invoice.items)) {
      for (const soldItem of invoice.items) {
        if (soldItem.itemType === "product") {
          const item = await Item.findById(soldItem?._id);
          if (!item) {
            return res.status(400).json({
              success: false,
              msg: `Item not found: ${soldItem?._id}`,
            });
          }
          await Item.findByIdAndUpdate(soldItem?._id, {
            $inc: { currentStock: soldItem?.quantity },
          });
        }
      }
    }

    party.currentBalance = (party.currentBalance || 0) - reversalAmount;
    party.totalDebits = (party.totalDebits || 0) - reversalAmount;
    party.totalInvoices = (party.totalInvoices || 0) - reversalAmount;
    party.totalCredits = (party.totalCredits || 0) + reversalAmount;

    await party.save();
    await invoice.save();

    return res.status(200).json({
      success: true,
      msg: "Invoice cancelled successfully",
      invoice,
    });
  } catch (error) {
    console.error("ERROR IN CANCELLING SALES INVOICE", error);
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
