import Party from "../models/party.schema.js";
import SalesInvoice from "../models/salesInvoiceSchema.js";
import { PaymentIn } from "../models/paymentIn.schema.js";

export async function createPaymentIn(req, res) {
  try {
    const { partyName, paymentAmount, paymentDate, paymentMode, notes } =
      req.body;
    // 1. Find party
    const party = await Party.findOne({ partyName });
    if (!party) {
      return res.status(404).json({ message: "Party not found" });
    }
    console.log(req.body);

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
