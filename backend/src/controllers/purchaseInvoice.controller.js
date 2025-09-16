import { salesInvoiceSchema } from "../config/validation.js";
import { Item } from "../models/item.schema.js";
import Party from "../models/party.schema.js";
import PurchaseInvoice from "../models/purchaseInvoice.schema.js";

export async function createPurchaseInvoice(req, res) {
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

    const existingPurchaseInvoice = await PurchaseInvoice.findOne({
      purchaseInvoiceNumber: validatedResult.data?.purchaseInvoiceNumber,
    });

    if (existingPurchaseInvoice) {
      return res.status(400).json({
        success: false,
        msg: "Invoice already exists with this invoice number",
      });
    }

    for (const purchaseItem of data?.items) {
      const item = await Item.findById(purchaseItem?._id);
      if (!item) {
        return res.status(400).json({ success: false, msg: "Item not found" });
      }

      if (purchaseItem?.quantity <= 0) {
        return res.status(400).json({
          success: false,
          msg: `Invalid quantity for item ${item?.itemName}`,
        });
      }

      await Item.findByIdAndUpdate(purchaseItem?._id, {
        $inc: { currentStock: purchaseItem?.quantity },
      });
    }

    const {
      salesInvoiceNumber,
      salesInvoiceDate,
      validFor,
      validityDate,
      ...cleanedData
    } = req.body;

    const purchaseInvoice = await PurchaseInvoice.create({
      purchaseInvoiceNumber: validatedResult?.data?.salesInvoiceNumber,
      purchaseInvoiceDate: validatedResult?.data?.salesInvoiceDate,
      partyId: party?._id,
      businessId: req.params.id,
      clientId: req.user?.id,
      ...cleanedData,
    });

    if (!purchaseInvoice) {
      return res
        .status(400)
        .json({ success: false, msg: "Failed to create purchase invoice" });
    }

    return res.status(200).json({
      success: true,
      msg: "Purchase Invoice created successfully",
      purchaseInvoice,
    });
  } catch (error) {
    console.log(`Error in creating purchase invoice : ${error}`);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server error" });
  }
}

export async function getAllPurchaseInvoice(req, res) {
  try {
    const purchaseInvoices = await PurchaseInvoice.find({
      $and: [{ businessId: req.params?.id, clientId: req.user?.id }],
    })
      .populate("partyId")
      .sort("purchaseInvoiceDate");
    if (!purchaseInvoices) {
      return res
        .status(400)
        .json({ success: false, msg: "Invoices not found" });
    }
    return res.status(200).json({ success: true, purchaseInvoices });
  } catch (error) {
    console.log("ERROR IN GETTING  PURCHASE INVOICE ");
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function deletePurchaseInvoice(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide invoice id" });
    }
    const deletedInvoice = await PurchaseInvoice.findByIdAndDelete({
      _id: id,
      clientId: req.user?.id,
    });
    if (!deletedInvoice) {
      return res
        .status(400)
        .json({ success: false, msg: "Failed to delete purchase invoice" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Invoice deleted successfully" });
  } catch (error) {
    console.log("ERROR IN DELETING PURCHASE INVOICE ");
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function getPurchaseInvoiceById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide a valid invoice id" });
    }

    let invoice = await PurchaseInvoice.findById(id)
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
    console.error("ERROR IN GETTING PURCHASE INVOICE:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}
