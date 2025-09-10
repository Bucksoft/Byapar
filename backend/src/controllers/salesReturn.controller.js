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
    const party = await Party.findOne({
      partyName,
    });

    if (!party) {
      return res
        .status(400)
        .json({ success: false, msg: "Party doesn't exists" });
    }

    const existingSalesReturn = await SalesReturn.findOne({
      salesReturnNumber: validatedResult.data?.salesInvoiceNumber,
    });

    if (existingSalesReturn) {
      return res.status(400).json({
        success: false,
        msg: "Sales Return already exists with this invoice number",
      });
    }

    const originalInvoice = await SalesInvoice.findById(req.body?.invoiceId);
    if (!originalInvoice) {
      return res.status(400).json()
    }




    for (const returnedItem of data?.items) {
      const item = await Item.findById(returnedItem?._id);
      if (!item) {
        return res.status(404).json({
          success: false,
          msg: `Item not found: ${returnedItem?.itemName}`,
        });
      }

      await Item.findByIdAndUpdate(returnedItem?._id, {
        $inc: { currentStock: returnedItem?.quantity },
      });
    }

    const { _id, salesInvoiceNumber, salesInvoiceDate, ...cleanData } = data;
    const salesReturn = await SalesReturn.create({
      partyId: party?._id,
      salesReturnNumber: validatedResult.data?.salesInvoiceNumber,
      businessId: req.params?.id,
      clientId: req.user?.id,
      ...cleanData,
    });

    if (!salesReturn) {
      return res
        .status(400)
        .json({ success: false, msg: "Sales return could not be created" });
    }

    return res.status(201).json({
      success: true,
      msg: "Sales Return created successfully",
      salesReturn,
    });
  } catch (error) {
    console.log("ERROR IN CREATING SALES RETURN");
    console.log(error);
    return res.status(500).json({ err: "Internal server error", error });
  }
}

export async function getAllSalesReturn(req, res) {
  try {
    const businessId = req.params.id;
    const salesReturn = await SalesReturn.find({
      $and: [{ businessId: businessId, clientId: req?.user?.id }],
    }).populate("invoiceId");
    if (!salesReturn) {
      return res
        .status(400)
        .json({ success: false, msg: "Sales return not found" });
    }
    return res.status(200).json({ success: true, salesReturn });
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
    const deletedSalesReturn = await SalesReturn.findByIdAndDelete(id);
    if (!deletedSalesReturn) {
      return res
        .status(400)
        .json({ status: false, msg: "Failed to delete sales return" });
    }
    return res.status(200).json({ success: true, msg: "Deleted Sales Return" });
  } catch (error) {
    console.log("ERROR IN DELETING SALES RETURN");
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
