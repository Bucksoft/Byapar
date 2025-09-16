import mongoose from "mongoose";
import Party from "../models/party.schema.js";
import { PaymentOut } from "../models/paymentOutSchema.js";
import PurchaseInvoice from "../models/purchaseInvoice.schema.js";

export async function createPaymentOut(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      partyName,
      paymentAmount,
      paymentDate,
      paymentMode,
      notes,
      paymentOutNumber,
      settledInvoices,
    } = req.body;

    // 1. Find party
    const party = await Party.findOne({ partyName }).session(session);
    if (!party) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, msg: "Party not found" });
    }

    // 2. Check duplicate Payment Out number
    const existingPaymentOut = await PaymentOut.findOne({
      paymentOutNumber,
    }).session(session);
    if (existingPaymentOut) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, msg: "Payment Out number already exists" });
    }

    // 3. Fetch invoices
    const invoiceIds = Object.keys(settledInvoices || {});
    const invoices = await PurchaseInvoice.find({
      partyId: party._id,
      _id: { $in: invoiceIds },
    })
      .sort({ purchaseInvoiceDate: 1 })
      .session(session);

    let updatedSettledInvoices = [];

    for (const invoice of invoices) {
      const settleAmount = settledInvoices[invoice._id.toString()] || 0;
      const currentSettled = invoice.settledAmount || 0;
      const pending =
        invoice.pendingAmount ?? invoice.totalAmount - currentSettled;

      if (pending <= 0) {
        updatedSettledInvoices.push({
          invoiceId: invoice._id,
          totalAmount: invoice.totalAmount,
          settledAmount: currentSettled,
          pendingAmount: 0,
          status: "Already Settled",
        });
        continue;
      }

      if (settleAmount <= 0) {
        updatedSettledInvoices.push({
          invoiceId: invoice._id,
          totalAmount: invoice.totalAmount,
          settledAmount: currentSettled,
          pendingAmount: pending,
          status: "No Settlement Applied",
        });
        continue;
      }

      const appliedSettlement = Math.min(settleAmount, pending);

      invoice.settledAmount = currentSettled + appliedSettlement;
      invoice.pendingAmount = invoice.totalAmount - invoice.settledAmount;
      invoice.paymentStatus = invoice.pendingAmount <= 0 ? "Paid" : "Partial";

      await invoice.save({ session });

      updatedSettledInvoices.push({
        invoiceId: invoice._id,
        totalAmount: invoice.totalAmount,
        settledAmount: invoice.settledAmount,
        pendingAmount: invoice.pendingAmount,
        status:
          appliedSettlement < settleAmount ? "Partially Settled" : "Settled",
      });
    }

    // 4. Save PaymentOut entry
    const paymentOut = await PaymentOut.create(
      [
        {
          partyName,
          paymentAmount,
          paymentDate: paymentDate || new Date(),
          paymentMode,
          clientId: req.user.id,
          partyId: party._id,
          notes,
          paymentOutNumber,
          businessId: req.params?.id,
          settledInvoices,
        },
      ],
      { session }
    );

    // 5. Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      msg: "Payment Out recorded successfully",
      paymentOut: paymentOut[0],
      updatedSettledInvoices,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("ERROR IN CREATING PAYMENT OUT:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function getAllPaymentOutDetails(req, res) {
  try {
    const paymentOuts = await PaymentOut.find({
      $and: [
        {
          businessId: req.params?.id,
        },
        {
          clientId: req.user?.id,
        },
      ],
    });
    if (!paymentOuts) {
      return res
        .status(400)
        .json({ success: false, msg: "Payment Out details not found" });
    }
    return res.status(200).json({ success: true, paymentOuts });
  } catch (error) {
    console.error("ERROR IN GETTING PAYMENT OUT DETAILS :", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function getSinglePaymentOutDetail(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide the payment out id" });
    }
    const paymentOut = await PaymentOut.findById(id).populate("partyId");
    if (!paymentOut) {
      return res
        .status(400)
        .json({ success: false, msg: "Payment Out not found" });
    }
    // console.log(paymentIn.settledInvoices[0]);
    const invoiceIds = Object.keys(paymentOut.settledInvoices[0]);
    const invoices = await PurchaseInvoice.find({
      _id: { $in: invoiceIds },
    });
    const data = {
      paymentOut,
      invoices,
    };
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("ERROR IN GETTING SINGLE PAYMENT OUT DETAILS :", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function deletePaymentOut(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide the payment out id" });
    }
    const deletedPaymentOut = await PaymentOut.findByIdAndDelete(id);
    if (!deletedPaymentOut) {
      return res.status(400).json({ success: false, msg: "Failed to delete" });
    }
    return res.status(200).json({ success: true, msg: "Deleted successfully" });
  } catch (error) {
    console.error("ERROR IN DELETING PAYMENT OUT DETAILS :", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}
