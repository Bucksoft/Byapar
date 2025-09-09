import { businessSchema } from "../config/validation.js";
import { Business } from "../models/business.schema.js";

// CREATE BUSINESS API
export async function createBusiness(req, res) {
  try {
    // GET THE DATA FROM THE FRONTEND
    const data = req.body;
    const logoFile = req.files?.logo?.[0];
    const signatureFile = req.files?.signature?.[0];

    if (data.gstRegistered) {
      data.gstRegistered = Boolean(data.gstRegistered);
    }

    if (logoFile) {
      data.logo = logoFile.path;
    }

    if (signatureFile) {
      data.signature = signatureFile.path;
    }

    // CHECK IF THE SAME BUSINESS IS ALREADY PRESENT OR NOT
    if (data.TDS) {
      data.TDS = Boolean(data.TDS);
    }

    if (data.TCS) {
      data.TCS = Boolean(data.TCS);
    }

    const companyEmail = data?.companyEmail;
    const businessExists = await Business.findOne({ companyEmail });
    if (businessExists) {
      return res.status(400).json({
        success: false,
        msg: "Email is already in use. Please choose another email.",
      });
    }

    // VALIDATE THE DATA
    const validatedResult = businessSchema.safeParse(data);
    if (!validatedResult.success) {
      const validationError = validatedResult.error.format();
      return res
        .status(400)
        .json({ success: true, msg: "Validation failed", validationError });
    }

    // CREATE THE BUSINESS
    const dataToInsert = validatedResult.data;
    const business = await Business.create({
      ...dataToInsert,
      clientId: req?.user?.id,
    });

    if (!business) {
      return res
        .status(400)
        .json({ success: false, msg: "Business could not be created" });
    }

    // RETURN SUCCESS RESPONSE
    return res
      .status(200)
      .json({ success: true, msg: "Business created successfully", business });
  } catch (error) {
    console.log("Error in creating business ", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}

// UPDATE BUSINESS API
export async function updateBusiness(req, res) {
  try {
    // GET THE BUSINESS ID FROM THE PARAMETERS
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide business ID" });
    }

    // FIND THE BUSINESS BASED ON THE ID AND UPDATE
    const updatedBusiness = await Business.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateBusiness) {
      return res
        .status(400)
        .json({ success: false, msg: "Business could not be updated" });
    }

    // RETURN SUCCESS RESPONSE
    return res
      .status(200)
      .json({ success: true, msg: "Business details updated", updateBusiness });
  } catch (error) {
    console.log("Error in updating business details", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}

// GET BUSINESS DETAILS API
export async function getBusiness(req, res) {
  try {
    // GET THE BUSINESS ID FROM THE PARAMETERS
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide user ID" });
    }

    // FIND THE BUSINESS BASED ON THE ID AND UPDATE
    const business = await Business.findById({
      clientId: req.user.id,
    });
    if (!business) {
      return res
        .status(400)
        .json({ success: false, msg: "Business not found" });
    }

    // RETURN SUCCESS RESPONSE
    return res.status(200).json({ success: true, business });
  } catch (error) {
    console.log("Error in updating business details", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}

// DELETE BUSINESS
export async function deleteBusiness(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide business ID" });
    }

    // FIND THE BUSINESS BASED ON THE ID AND DELETE IT
    const business = await Business.findByIdAndDelete(id);
    if (!business) {
      return res
        .status(400)
        .json({ success: false, msg: "Business could not be deleted" });
    }

    // RETURN SUCCESS RESPONSE
    return res
      .status(200)
      .json({ success: true, msg: "Business deleted", business });
  } catch (error) {
    console.log("Error in deleting business details", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}

export async function getAllBusinesses(req, res) {
  try {
    const businesses = await Business.find({
      clientId: req?.user?.id,
    });
    if (!businesses) {
      return res
        .status(400)
        .json({ success: false, msg: "Businesses not found" });
    }
    return res.status(200).json({ success: true, businesses });
  } catch (error) {
    console.log("Error in getting my businesses details", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}

export async function markBusinessAsActive(req, res) {
  try {
    const { id, status } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide business ID" });
    }

    // QUERY TO MARK THE STATUS OF THE BUSINESS AS ACTIVE AND REST AS INACTIVE
    await Business.updateMany({}, { status: "inactive" });
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      {
        status: status || "active",
      },
      { new: true }
    );
    if (!updatedBusiness) {
      return res
        .status(400)
        .json({ success: false, msg: "Failed to mark as active" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Set as active", updatedBusiness });
  } catch (error) {
    console.log("Error in setting active business", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}
