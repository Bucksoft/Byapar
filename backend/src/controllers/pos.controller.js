import mongoose from "mongoose";
import POS from "../models/POS.schema.js";
import { Item } from "../models/item.schema.js";
import SalesInvoice from "../models/salesInvoiceSchema.js";
export async function createPOS(req, res) {
  try {
    if (req.body?.items?.length === 0) {
      return res.status(400).json({ msg: "Please provide the items" });
    }

    // DECREASE THE CURRENT STOCK OF THE ITEM
    for (let item of req.body?.items) {
      const dbItem = await Item.findById(item?._id);

      if (dbItem) {
        dbItem.currentStock =
          (dbItem.currentStock || 0) - Number(item?.quantity || 0);
        await dbItem.save();
      }
    }

    // FETCH THE LATEST SALES INVOICE OF THE BUSINESS TO CALCULATE THE NEXT POS NUMBER
    const latestSalesInvoice = await SalesInvoice.findOne({
      businessId: new mongoose.Types.ObjectId(req.query.businessId),
      clientId: req.user?.id,
    }).sort({ salesInvoiceNumber: -1 });

    // fetch the last pos number
    const latestPOS = await POS.findOne({
      businessId: new mongoose.Types.ObjectId(req.query.businessId),
      clientId: req.user?.id,
    }).sort({ posNumber: -1 });

    const lastNumber = Math.max(
      latestSalesInvoice?.salesInvoiceNumber || 0,
      latestPOS?.posNumber || 0
    );

    const balanceAmount = req.body?.totalAmount - req.body?.receivedAmount;
    const pos = await POS.create({
      ...req.body,
      businessId: new mongoose.Types.ObjectId(req.query.businessId),
      clientId: new mongoose.Types.ObjectId(req.user?.id),
      balanceAmount,
      posNumber: lastNumber + 1,
      type: "pos invoice",
      status:
        balanceAmount === 0
          ? "paid"
          : req.body?.receivedAmount !== req.body?.totalAmount
          ? "partially paid"
          : "unpaid",
    });

    return res.status(200).json({ msg: "Created successfully", pos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getAllPOS(req, res) {
  try {
    const businessId = req.query?.businessId;
    const pos = await POS.find({ businessId });

    const totalSales = pos.reduce((total, item) => total + item.totalAmount, 0);
    const totalPaid = pos.reduce(
      (total, item) => total + item.receivedAmount,
      0
    );
    const totalUnpaid = pos.reduce(
      (total, item) => total + item.balanceAmount,
      0
    );
    const totalPOS = pos.length;

    return res.status(200).json({
      success: true,
      pos,
      totalSales,
      totalPaid,
      totalUnpaid,
      totalPOS,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getPOSById(req, res) {
  try {
    const id = req.params?.id;
    if (!id) {
      return res.status(400).json({ msg: "Please provide a valid pos id" });
    }
    const pos = await POS.findById(id);
    if (!pos) {
      return res.status(400).json({ msg: "POS could not be found" });
    } else {
      return res.status(200).json({ success: true, pos });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
