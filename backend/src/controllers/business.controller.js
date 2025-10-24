import { businessSchema } from "../config/validation.js";
import { Business } from "../models/business.schema.js";
import { UserCredential } from "../models/user.schema.js";
import { BusinessBankAccount } from "../models/businessBankAccount.js";
import path from "path";

// CREATE BUSINESS API
export async function createBusiness(req, res) {
  try {
    // GET THE DATA FROM THE FRONTEND
    const data = req.body;
    const logoFile = req.files?.logo?.[0];
    const signatureFile = req.files?.signature?.[0];

    console.log(req.body.bankAccounts);

    let parsedAdditionalInfo = [];
    if (req.body?.additionalInformation) {
      try {
        parsedAdditionalInfo = JSON.parse(req.body.additionalInformation);
      } catch (e) {
        console.error("Invalid JSON in additionalInformation");
      }
    }

    let parsedBankAccounts = [];
    if (req.body?.bankAccounts) {
      try {
        parsedBankAccounts = JSON.parse(req.body.bankAccounts);
      } catch (e) {
        console.error("Invalid JSON in bankAccounts");
      }
    }

    if (data.gstRegistered) {
      data.gstRegistered = Boolean(data.gstRegistered);
    }

    if (logoFile) {
      data.logo = `${req.protocol}://${req.get("host")}/uploads/${path.basename(
        req.files.logo[0].path
      )}`;
    }

    if (signatureFile) {
      data.signature = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${path.basename(req.files.signature[0].path)}`;
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

    // // CREATE THE BUSINESS
    const dataToInsert = validatedResult.data;
    const business = await Business.create({
      ...dataToInsert,
      clientId: req?.user?.id,
      additionalInformation: parsedAdditionalInfo,
    });

    if (!business) {
      return res
        .status(400)
        .json({ success: false, msg: "Business could not be created" });
    }

    if (Array.isArray(parsedBankAccounts) && parsedBankAccounts.length > 0) {
      try {
        await BusinessBankAccount.insertMany(
          parsedBankAccounts.map((account) => ({
            accountName: account?.accountName || "",
            bankAccountNumber: account?.bankAccountNumber || "",
            IFSCCode: account?.ifscCode || "",
            bankAndBranchName: account?.bankAndBranchName || "",
            accountHoldersName: account?.accountHoldersName || "",
            upiId: account?.upiId || "",
            openingBalance: account?.openingBalance || 0,
            asOfDate: account?.asOfDate || "",
            businessId: business._id,
            clientId: req?.user?.id,
          }))
        );
      } catch (err) {
        console.error("Bank accounts could not be saved:", err.message);
      }
    }

    // RETURN SUCCESS RESPONSE
    return res
      .status(200)
      .json({ success: true, msg: "Business created successfully" });
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
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide business ID" });
    }

    const logoFile = req.files?.logo?.[0];
    const signatureFile = req.files?.signature?.[0];

    if (logoFile) {
      req.body.logo = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${path.basename(logoFile.path)}`;
    }

    if (signatureFile) {
      req.body.signature = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${path.basename(signatureFile.path)}`;
    }

    let parsedAdditionalInfo = [];
    if (req.body?.additionalInformation) {
      try {
        parsedAdditionalInfo = JSON.parse(req.body.additionalInformation);
      } catch (e) {
        console.error("Invalid JSON in additionalInformation");
      }
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      {
        ...req.body,
        additionalInformation: parsedAdditionalInfo,
        clientId: req.user.id,
      },
      { new: true }
    );

    if (!updatedBusiness) {
      return res
        .status(400)
        .json({ success: false, msg: "Business could not be updated" });
    }

    if (req.body?.bankAccounts) {
      let parsedBankAccounts = [];
      try {
        parsedBankAccounts = JSON.parse(req.body.bankAccounts);
      } catch (e) {
        console.error("Invalid JSON in bankAccounts");
      }

      for (const acc of parsedBankAccounts) {
        if (acc._id) {
          await BusinessBankAccount.findByIdAndUpdate(acc._id, {
            accountName: acc.accountName || "",
            bankAccountNumber: acc.bankAccountNumber || "",
            IFSCCode: acc.ifscCode || "",
            bankAndBranchName: acc.bankAndBranchName || "",
            accountHoldersName: acc.accountHoldersName || "",
            upiId: acc.upiId || "",
            openingBalance: acc.openingBalance || 0,
            asOfDate: acc.asOfDate || "",
          });
        } else {
          await BusinessBankAccount.create({
            accountName: acc.accountName || "",
            bankAccountNumber: acc.bankAccountNumber || "",
            IFSCCode: acc.ifscCode || "",
            bankAndBranchName: acc.bankAndBranchName || "",
            accountHoldersName: acc.accountHoldersName || "",
            upiId: acc.upiId || "",
            openingBalance: acc.openingBalance || 0,
            asOfDate: acc.asOfDate || "",
            clientId: req.user.id,
            businessId: id,
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      msg: "Business details updated successfully",
      updatedBusiness,
    });
  } catch (error) {
    console.error("Error in updating business details", error);
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
      return res.status(400).json({
        success: false,
        msg: "Please provide business ID",
      });
    }

    const business = await Business.findOneAndDelete({
      _id: id,
      clientId: req.user?.id,
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        msg: "Business not found or you don't have permission to delete it",
      });
    }

    // SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      msg: "Business deleted successfully",
      business,
    });
  } catch (error) {
    console.log("Error in deleting business details", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
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
    const updatedUserWithActiveBusinessId =
      await UserCredential.findByIdAndUpdate(
        req.user?.id,
        {
          activeBusinessId: id,
        },
        { new: true }
      );
    if (!updatedUserWithActiveBusinessId) {
      return res
        .status(400)
        .json({ success: false, msg: "Failed to mark as active" });
    }

    await Business.updateMany(
      {
        clientId: req.user.id,
      },
      { $set: { status: "inactive" } }
    );

    const updatedBusiness = await Business.findOneAndUpdate(
      {
        _id: id,
        clientId: req.user?.id,
      },
      { $set: { status: status || "active" } },
      { new: true }
    );

    if (!updatedBusiness) {
      return res.status(404).json({
        success: false,
        msg: "Business not found ",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Set as active",
      updatedBusiness,
      updatedUser: updatedUserWithActiveBusinessId,
    });
  } catch (error) {
    console.log("Error in setting active business", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}

export async function getActiveBusiness(req, res) {
  try {
    const clientId = req.user?.id;
    const activeBusiness = await UserCredential.findById(clientId).populate(
      "activeBusinessId"
    );
    if (!activeBusiness) {
      return res.status(400).json({ success: false, msg: "Not found" });
    }
    return res.status(200).json({ success: true, activeBusiness });
  } catch (error) {
    console.log("Error in getting active business", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}
