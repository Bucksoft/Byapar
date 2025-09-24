import mongoose from "mongoose";
import Party from "../models/party.schema.js";
import SalesInvoice from "../models/salesInvoiceSchema.js";
import { PaymentIn } from "../models/paymentIn.schema.js";

export async function createPaymentIn(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      partyName,
      paymentAmount,
      paymentDate,
      paymentMode,
      notes,
      paymentInNumber,
      settledInvoices,
    } = req.body;

    const party = await Party.findOne({ partyName }).session(session);
    if (!party) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, msg: "Party not found" });
    }

    const existingPaymentIn = await PaymentIn.findOne({
      paymentInNumber,
    }).session(session);
    if (existingPaymentIn) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, msg: "Payment In number already exists" });
    }

    const invoiceIds = Object.keys(settledInvoices || {});
    const invoices = await SalesInvoice.find({
      partyId: party._id,
      _id: { $in: invoiceIds },
    })
      .sort({ salesInvoiceDate: 1 })
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
      invoice.status = invoice.pendingAmount <= 0 ? "paid" : "partially paid";

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

    const paymentIn = await PaymentIn.create(
      [
        {
          partyName,
          paymentAmount,
          paymentDate: paymentDate || new Date(),
          paymentMode,
          clientId: req.user.id,
          partyId: party._id,
          notes,
          paymentInNumber,
          businessId: req.params?.id,
          settledInvoices,
        },
      ],
      { session }
    );

    party.currentBalance = (party.currentBalance || 0) - paymentAmount;
    party.totalCredits = (party.totalCredits || 0) + paymentAmount;

    await party.save({ session });
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      msg: "Payment In recorded successfully",
      paymentIn: paymentIn[0],
      updatedSettledInvoices,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("ERROR IN CREATING PAYMENT IN:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function getAllPaymentInDetails(req, res) {
  try {
    const totalPaymentIns = await PaymentIn.countDocuments({});
    const paymentIns = await PaymentIn.find({
      $and: [
        {
          businessId: req.params?.id,
        },
        {
          clientId: req.user?.id,
        },
      ],
    });
    if (!paymentIns) {
      return res
        .status(400)
        .json({ success: false, msg: "Payment In details not found" });
    }
    return res.status(200).json({ success: true, paymentIns, totalPaymentIns });
  } catch (error) {
    console.error("ERROR IN GETTING PAYMENT IN DETAILS :", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function getSinglePaymentInDetail(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide the payment in id" });
    }
    const paymentIn = await PaymentIn.findById(id).populate("partyId");
    if (!paymentIn) {
      return res
        .status(400)
        .json({ success: false, msg: "Payment Id not found" });
    }
    // console.log(paymentIn.settledInvoices[0]);
    const invoiceIds = Object.keys(paymentIn.settledInvoices[0]);
    const invoices = await SalesInvoice.find({
      _id: { $in: invoiceIds },
    });
    const data = {
      paymentIn,
      invoices,
    };
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("ERROR IN GETTING SINGLE PAYMENT IN DETAILS :", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function deletePaymentIn(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide the payment in id" });
    }

    const paymentIn = await PaymentIn.findById(id).populate("partyId");
    if (!paymentIn) {
      return res.status(400).json({ success: false, msg: "Payment not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (paymentIn.paymentAmount > 0 && paymentIn.partyId) {
        paymentIn.partyId.currentBalance += paymentIn.paymentAmount;
        await paymentIn.partyId.save({ session });
      }

      for (const settled of paymentIn.settledInvoices) {
        const [[invoiceId, amountSettled]] = Object.entries(settled);
        const id = new mongoose.Types.ObjectId(invoiceId);
        const invoice = await SalesInvoice.findById(id).session(session);
        if (invoice) {
          invoice.settledAmount -= amountSettled;
          invoice.pendingAmount += amountSettled;
          if (invoice.settledAmount < 0) invoice.settledAmount = 0;
          invoice.status = "unpaid";
          await invoice.save({ session });
        }
      }
      paymentIn.status = "cancelled";
      await paymentIn.save();
      await session.commitTransaction();
      session.endSession();

      return res
        .status(200)
        .json({ success: true, msg: "Payment deleted successfully" });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (error) {
    console.error("ERROR IN DELETING PAYMENT IN DETAILS :", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function updatePaymentIn(req, res) {
  try {
    const businessId = new mongoose.Types.ObjectId(req.params.businessId);
    const paymentInId = new mongoose.Types.ObjectId(req.params.id);
    const existingPaymentIn = await PaymentIn.findOne({
      businessId: businessId,
      _id: paymentInId,
    });
    if (!existingPaymentIn) {
      return res.status(400).json({ msg: "Payment In doesn't exists" });
    }
    const data = req.body;
    const updatedPaymentIn = await PaymentIn.findByIdAndUpdate(
      { _id: paymentInId },
      data,
      { new: true }
    );
    return res
      .status(200)
      .json({ msg: "Updated successfully", updatedPaymentIn });
  } catch (error) {
    console.error("ERROR IN UPDATING PAYMENT IN DETAILS :", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}
