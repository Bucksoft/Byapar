import Party from "../models/party.schema.js";
import SalesInvoice from "../models/salesInvoiceSchema.js";
import { PaymentIn } from "../models/paymentIn.schema.js";

export async function createPaymentIn(req, res) {
  try {
    const {
      partyName,
      paymentAmount,
      paymentDate,
      paymentMode,
      notes,
      paymentInNumber,
    } = req.body;
    // 1. Find party
    const party = await Party.findOne({ partyName });
    if (!party) {
      return res.status(404).json({ message: "Party not found" });
    }

    const existingPaymentInNumber = await PaymentIn.findOne({
      paymentInNumber,
    });
    if (existingPaymentInNumber) {
      return res
        .status(400)
        .json({ success: false, msg: "Payment In number already exists" });
    }
    console.log(existingPaymentInNumber);

    // 2. Fetch those invoice which are going to be settled, sorted oldest first
    const invoiceIds = Object.keys(req.body.settledInvoices);
    const invoices = await SalesInvoice.find({
      partyId: party._id,
      _id: { $in: invoiceIds }, // filter only those invoice IDs
    }).sort({ salesInvoiceDate: 1 });

    // 2. Fetch invoices which are going to be settled, sorted oldest first

    let updatedSettledInvoices = [];

    for (const invoice of invoices) {
      const settleAmount =
        req.body.settledInvoices[invoice._id.toString()] || 0;

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

      await invoice.save();

      updatedSettledInvoices.push({
        invoiceId: invoice._id,
        totalAmount: invoice.totalAmount,
        settledAmount: invoice.settledAmount,
        pendingAmount: invoice.pendingAmount,
        status:
          appliedSettlement < settleAmount
            ? "Partially Settled (Excess Ignored)"
            : "Settled",
      });
    }

    // 4. Save PaymentIn
    const paymentIn = new PaymentIn({
      partyName,
      paymentAmount,
      paymentDate: paymentDate || new Date(),
      paymentMode,
      clientId: req.user.id,
      partyId: party._id,
      notes,
      paymentInNumber,
      businessId: req.params?.id,
      settledInvoices: req.body.settledInvoices,
    });

    await paymentIn.save();

    // 6. Send response
    res.status(201).json({
      success: true,
      msg: "Payment recorded successfully",
      paymentIn,
      // settledInvoices,
      updatedSettledInvoices,
      paymentIn,
    });
  } catch (error) {
    console.error("ERROR IN CREATING PAYMENT IN:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function getAllPaymentInDetails(req, res) {
  try {
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
    return res.status(200).json({ success: true, paymentIns });
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
    const deletedPaymentIn = await PaymentIn.findByIdAndDelete(id);
    if (!deletedPaymentIn) {
      return res.status(400).json({ success: false, msg: "Failed to delete" });
    }
    return res.status(200).json({ success: true, msg: "Deleted successfully" });
  } catch (error) {
    console.error("ERROR IN DELETING PAYMENT IN DETAILS :", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}
