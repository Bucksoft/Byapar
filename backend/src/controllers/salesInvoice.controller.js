import { salesInvoiceSchema } from "../config/validation.js";
import SalesInvoice from "../models/salesInvoiceSchema.js";
import Party from "../models/party.schema.js";
import { Item } from "../models/item.schema.js";
import mongoose from "mongoose";
import { parseDate } from "../../src/utils/date.js";
import { getFinancialYearRange } from "../utils/financialYear.js";

// CONTROLLER TO CREATE A SALES INVOICE
export async function createSalesInvoice(req, res) {
  try {
    const data = req.body;
    const partyId = new mongoose.Types.ObjectId(data?.partyId);
    const party = await Party.findOne({
      _id: partyId,
      businessId: req.params?.id,
    });

    if (!party) {
      return res
        .status(400)
        .json({ success: false, msg: "Party doesn't exists" });
    }

    // Find the invoice for this business if it exists
    const existingInvoice = await SalesInvoice.findOne({
      businessId: req.params.id,
      salesInvoiceNumber: Number(data?.salesInvoiceNumber),
    });

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
        // if (item?.currentStock < soldItem.quantity) {
        //   return res.status(400).json({
        //     success: false,
        //     msg: `Insufficient stock for ${item?.itemName}`,
        //   });
        // }
        await Item.findByIdAndUpdate(soldItem?._id, {
          $inc: { currentStock: -soldItem?.quantity },
        });
      }
    }

    // calculate additional discount amount based on the percent
    if (data?.additionalDiscountPercent) {
      const additionalDiscountAmount =
        (data?.additionalDiscountPercent * data?.totalAmount) / 100;
      data.additionalDiscountAmount = additionalDiscountAmount;
    }

    const salesInvoice = await SalesInvoice.create({
      partyId: party?._id,
      businessId: req.params?.id,
      clientId: req.user?.id,
      type: "sales invoice",
      pendingAmount: data?.totalAmount,
      salesInvoiceNumber: existingInvoice
        ? existingInvoice.salesInvoiceNumber + 1
        : data?.salesInvoiceNumber,
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
    const businessId = req.params?.id;
    if (!businessId) {
      return res.status(400).json({
        success: false,
        msg: "Business ID is required",
      });
    }

    const invoices = await SalesInvoice.find({
      businessId: new mongoose.Types.ObjectId(businessId),
      clientId: req.user?.id,
    })
      .sort({ salesInvoiceDate: -1 })
      .populate("partyId");

    if (!invoices || invoices.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "Invoices not found",
        invoices: [],
        totalInvoices: 0,
        latestInvoiceNumber: 0,
        totalSales: 0,
        totalPaid: 0,
        totalUnpaid: 0,
      });
    }

    const latestInvoice = await SalesInvoice.findOne({
      businessId: req.params.id,
      clientId: req.user?.id,
    })
      .sort({ salesInvoiceNumber: -1 })
      .limit(1);

    // CALCULATE THE TOTALS OF ONLY THOSE INVOICES WHICH ARE NOT CANCELLED.
    const validInvoices =
      invoices?.filter(
        (invoice) => invoice?.status?.toLowerCase() !== "cancelled"
      ) || [];

    const { start, end } = getFinancialYearRange();

    const invoicesInFY = validInvoices.filter((invoice) => {
      const validDate = new Date(invoice?.salesInvoiceDate);
      return validDate >= start && validDate <= end;
    });

    const totalSales = Number(
      invoicesInFY
        .reduce((acc, invoice) => acc + Number(invoice?.totalAmount || 0), 0)
        .toFixed(2)
    ).toLocaleString("en-IN");

    const totalPaid = Number(
      invoicesInFY.reduce(
        (sum, invoice) => sum + (invoice.settledAmount || 0),
        0
      )
    ).toLocaleString("en-IN");

    const totalUnpaid = Number(
      invoicesInFY.reduce(
        (sum, invoice) =>
          sum + (invoice.totalAmount - (invoice.settledAmount || 0)),
        0
      )
    ).toLocaleString("en-IN");

    return res.status(200).json({
      success: true,
      invoices,
      totalInvoices: invoices.length,
      latestInvoiceNumber: latestInvoice?.salesInvoiceNumber || 0,
      totalSales,
      totalPaid,
      totalUnpaid,
    });
  } catch (error) {
    console.error("❌ ERROR IN GETTING SALES INVOICE:", error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

// CONTROLLER TO DELETE INVOICE (MARK STATUS AS CANCELLED AND INCREMENT THE STOCK OF THAT ITEM)

export async function deleteInvoice(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let { id } = req.params;
    const userId = req.user?.id;
    if (!id) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, msg: "Please provide invoice id" });
    }

    // Convert id into mongoose ObjectId
    id = new mongoose.Types.ObjectId(id);

    // Fetch invoice with party populated
    const invoice = await SalesInvoice.findById(id)
      .populate("partyId")
      .session(session);
    if (!invoice) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, msg: "Invoice not found" });
    }

    if (invoice.status === "cancelled") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, msg: "Invoice is already cancelled" });
    }

    const party = invoice.partyId;
    if (!party) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, msg: "Linked party not found" });
    }

    const reversalAmount = invoice.balanceAmount || 0;

    // Cancel invoice
    invoice.status = "cancelled";
    invoice.cancelledAt = new Date();
    invoice.cancelledBy = userId || null;
    invoice.pendingAmount = 0;
    invoice.settledAmount = 0;

    // Increment stock for items in invoice (skip deleted items)
    if (Array.isArray(invoice.items)) {
      for (const soldItem of invoice.items) {
        if (soldItem.itemType === "product") {
          const item = await Item.findById(soldItem?._id).session(session);
          if (!item) {
            // console.warn(`Item not found ${soldItem?.itemName}`);
            continue;
          }
          await Item.updateOne(
            { _id: soldItem._id },
            { $inc: { currentStock: soldItem?.quantity ?? 0 } }
          ).session(session);
        }
      }
    }

    // Update party balances
    party.currentBalance = (party.currentBalance || 0) - reversalAmount;
    party.totalDebits = (party.totalDebits || 0) - reversalAmount;
    party.totalInvoices = (party.totalInvoices || 0) - reversalAmount;
    party.totalCredits = (party.totalCredits || 0) + reversalAmount;

    // Save changes inside transaction
    await party.save({ session });
    await invoice.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      msg: "Invoice cancelled successfully",
      invoice,
    });
  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    session.endSession();
    console.error("ERROR IN CANCELLING SALES INVOICE", error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

// CONTROLLER TO GET A SINGLE INVOICE BY ID
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

// CONTROLLER TO UPDATE A SALES INVOICE
export async function updatedSalesInvoice(req, res) {
  try {
    const data = req.body;
    const invoiceId = req.params.id;
    if (!invoiceId) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide a valid invoice id" });
    }
    const invoice = await SalesInvoice.findByIdAndUpdate(invoiceId, data, {
      new: true,
    });
    if (!invoice) {
      return res.status(404).json({ success: false, msg: "Invoice not found" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Invoice updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

// CONRTOLLER TO BULK UPLOAD SALES INVOICES
export async function bulkUploadSalesInvoices(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const businessId = req.params?.businessId;
    if (!businessId) {
      return res
        .status(400)
        .json({ success: false, msg: "Business id is required" });
    }

    const bulkInvoices = req.body || [];
    if (!Array.isArray(bulkInvoices) || bulkInvoices.length === 0) {
      return res
        .status(400)
        .json({ success: false, msg: "No invoices provided" });
    }
    const invoicesToInsert = [];
    let duplicateCount = 0;

    for (const invoiceData of bulkInvoices) {
      const existingInvoice = await SalesInvoice.findOne(
        {
          salesInvoiceNumber: invoiceData?.InvoiceNo,
          businessId,
        },
        null,
        { session }
      );
      if (existingInvoice) {
        duplicateCount++;
        continue;
      }

      const items = await Item.find(
        {
          invoiceNo: invoiceData?.InvoiceNo,
          businessId,
        },
        null,
        { session }
      );

      const party = await Party.findOne(
        { partyName: invoiceData?.PartyName, businessId },
        null,
        { session }
      );

      console.log(invoice);

      const newInovice = {
        businessId,
        clientId: req.user?.id,
        salesInvoiceDate: parseDate(invoiceData?.Date),
        salesInvoiceNumber: Number(invoiceData?.InvoiceNo),
        partyName: invoiceData?.PartyName,
        type: "sales invoice",
        items,
        partyId: party?._id || null,
        totalAmount: invoiceData?.TotalAmount || 0,
        balanceAmount: invoiceData?.BalanceDue || invoiceData?.TotalAmount || 0,
        pendingAmount: invoiceData?.TotalAmount || 0,
        amountSubTotal: invoiceData?.TotalAmount || 0,
      };
      invoicesToInsert.push(newInovice);
    }

    // BULK INSERT THE INVOICES
    let inserted = [];
    if (invoicesToInsert.length > 0) {
      inserted = await SalesInvoice.insertMany(invoicesToInsert, {
        session,
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      msg: "Inserted successfully",
      insertedCount: invoicesToInsert.length,
      duplicateCount,
      inserted,
    });
  } catch (error) {
    console.log("ERROR IN BULK UPLOADING SALES INVOICES", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

// CONTROLLER TO GET INVOICES OF A PARTY
export async function getAllInvoicesForAParty(req, res) {
  try {
    const businessId = req.query?.businessId;
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ msg: "Please provide a valid party id" });
    }
    const invoices = await SalesInvoice.find({ partyId: id, businessId });
    return res.status(200).json({ success: true, invoices });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

// CONTROLLER TO GET SALES DATA FOR CHART
export async function getSalesDataForChart(req, res) {
  try {
    const businessId = req.params?.id;
    const days = parseInt(req.query?.days) || 15;
    const clientId = req.user?.id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));

    const salesData = await SalesInvoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({ success: true, salesData });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}
