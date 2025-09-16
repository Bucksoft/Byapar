import Party from "../models/party.schema.js";
import DeliveryChallan from "../models/deliveryChallan.schema.js";
import { salesInvoiceSchema } from "../config/validation.js";

export async function createDeliveryChallan(req, res) {
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

    const existingDeliveryChallan = await DeliveryChallan.findOne({
      deliveryChallanNumber: validatedResult?.data?.salesInvoiceNumber,
    });

    if (existingDeliveryChallan) {
      return res.status(400).json({
        success: false,
        msg: "Delivery Challan already exists.",
      });
    }

    const {
      salesInvoiceNumber,
      salesInvoiceDate,
      validFor,
      validityDate,
      ...cleanData
    } = data;

    const deliveryChallan = await DeliveryChallan.create({
      partyId: party?._id,
      deliveryChallanNumber: validatedResult?.data?.salesInvoiceNumber,
      deliveryChallanDate: validatedResult?.data?.salesInvoiceDate,
      businessId: req.params?.id,
      clientId: req.user?.id,
      ...cleanData,
    });

    if (!deliveryChallan) {
      return res
        .status(400)
        .json({ success: false, msg: "Delivery challan could not be created" });
    }

    return res.status(201).json({
      success: true,
      msg: "Delivery Challan created successfully",
      deliveryChallan,
    });
  } catch (error) {
    console.log("Error in creating delivery challan", error);
    return res
      .status(400)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function getAllDeliveryChallan(req, res) {
  try {
    const businessId = req.params?.id;
    if (!businessId) {
      return res
        .status(400)
        .json({ success: false, msg: "Business Id not provided" });
    }
    const deliveryChallans = await DeliveryChallan.find({
      $and: [{ businessId }, { clientId: req.user?.id }],
    });
    if (!deliveryChallans) {
      return res
        .status(400)
        .json({ status: false, msg: "Delivery Challans not found" });
    }
    return res.status(200).json({ success: true, deliveryChallans });
  } catch (error) {
    console.log("Error in getting delivery challans", error);
    return res
      .status(400)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function getChallanById(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide the challan id" });
    }
    const deliveryChallan = await DeliveryChallan.findById(id).populate(
      "partyId"
    );
    if (!deliveryChallan) {
      return res.status(400).json({ success: false, msg: "Challan not found" });
    }
    return res.status(200).json({ success: true, deliveryChallan });
  } catch (error) {
    console.log("Error in getting single delivery challan", error);
    return res
      .status(400)
      .json({ success: false, msg: "Internal Server Error" });
  }
}

export async function deleteDeliveryChallan(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide the challan id" });
    }
    const deletedChallan = await DeliveryChallan.findByIdAndDelete(id);
    if (!deletedChallan) {
      return res.status(400).json({ success: false, msg: "Challan not found" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Challan deleted successfully" });
  } catch (error) {
    console.log("Error in deleting delivery challan", error);
    return res
      .status(400)
      .json({ success: false, msg: "Internal Server Error" });
  }
}
