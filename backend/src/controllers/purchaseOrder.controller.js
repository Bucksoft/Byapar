import Party from "../models/party.schema.js";
import PurchaseOrder from "../models/purchaseOrder.schema.js";

export async function createPurchaseOrder(req, res) {
  try {
    const data = req.body;
    const partyName = data?.partyName;
    const party = await Party.findOne({
      partyName,
    });

    if (!party) {
      return res
        .status(400)
        .json({ success: false, msg: "Party doesn't exists" });
    }

    const existingPurchaseOrder = await PurchaseOrder.findOne({
      purchaseOrderNumber: data?.salesInvoiceNumber,
    });

    if (existingPurchaseOrder) {
      return res.status(400).json({
        success: false,
        msg: "Purchase order already exists with this invoice number",
      });
    }
    const { salesInvoiceNumber, salesInvoiceDate, ...cleanData } = data;
    const purchaseOrder = await PurchaseOrder.create({
      partyId: party?._id,
      ...cleanData,
      purchaseOrderNumber: data?.salesInvoiceNumber,
      purchaseOrderDate: data?.salesInvoiceDate,
      businessId: req.params?.id,
      clientId: req.user?.id,
    });

    if (!purchaseOrder) {
      return res
        .status(400)
        .json({ success: false, msg: "Purchase order could not be created" });
    }

    return res.status(201).json({
      success: true,
      msg: "Purchase order created successfully",
      purchaseOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
}

export async function getAllPurchaseOrders(req, res) {
  try {
    const businessId = req.params.id;
    if (!businessId) {
      return res.status(400).json({ msg: "Business ID is required" });
    }
    const totalPurchaseOrders = await PurchaseOrder.countDocuments({
      businessId: businessId,
    });
    const purchaseOrders = await PurchaseOrder.find({
      businessId: businessId,
    })
      .sort({ createdAt: -1 })
      .populate("partyId");
    return res.status(200).json({ purchaseOrders, totalPurchaseOrders });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
}

export async function getPurchaseOrderById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "Please provide a valid purchase order id",
      });
    }

    let purchaseOrder = await PurchaseOrder.findById(id)
      .populate("partyId")
      .populate("items.itemId");

    if (!purchaseOrder) {
      return res.status(404).json({ success: false, msg: "Invoice not found" });
    }

    purchaseOrder = purchaseOrder.toObject();

    return res.status(200).json({
      success: true,
      purchaseOrder,
    });
  } catch (error) {
    console.error("ERROR IN GETTING PURCHASE ORDER:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}
