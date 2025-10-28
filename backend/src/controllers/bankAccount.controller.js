import mongoose from "mongoose";
import {
  bankAccountSchema,
  businessBankAccount,
} from "../config/validation.js";
import BankAccount from "../models/bankAccount.schema.js";
import { BusinessBankAccount } from "../models/businessBankAccount.js";

export async function createBankAccount(req, res) {
  try {
    const { businessId, partyId } = req.query;
    const businessObjectId = new mongoose.Types.ObjectId(businessId);
    const partyObjectId = partyId ? new mongoose.Types.ObjectId(partyId) : null;
    const clientId = req.user?.id;
    const data = req.body;

    if (
      !data ||
      !Array.isArray(data.bankAccounts) ||
      data.bankAccounts.length === 0
    ) {
      return res.status(400).json({
        success: false,
        msg: "Please provide valid bank account data",
      });
    }

    // Validate each bank account in the array
    const validatedAccounts = [];
    for (const account of data?.bankAccounts) {
      const validatedResult = bankAccountSchema.safeParse({
        accountName: account?.accountHoldersName,
        bankAccountNumber: account?.bankAccountNumber,
        IFSCCode: account?.IFSCCode,
        bankAndBranchName: account?.bankAndBranchName,
        upiId: account?.upiId,
      });

      if (!validatedResult.success) {
        const errors = validatedResult.error.format();
        return res.status(400).json({
          success: false,
          msg: "Validation failed",
          validationError: errors,
        });
      }

      // Check if the same bank account already exists
      const existingAccount = await BankAccount.findOne({
        bankAccountNumber: account?.bankAccountNumber,
        IFSCCode: account?.IFSCCode,
        businessId: businessObjectId,
      });

      if (existingAccount) {
        return res.status(400).json({
          success: false,
          msg: `Bank account ${account.bankAccountNumber} already exists`,
        });
      }

      // Push validated data to array for bulk insert
      validatedAccounts.push({
        accountHoldersName: account?.accountHoldersName,
        bankAccountNumber: account?.bankAccountNumber,
        IFSCCode: account?.IFSCCode,
        bankAndBranchName: account?.bankAndBranchName,
        upiId: account?.upiId,
        businessId: businessObjectId,
        partyId: partyObjectId || null, // might be null during party creation
        clientId,
      });
    }

    // Create multiple bank accounts
    const createdAccounts = await BankAccount.insertMany(validatedAccounts);

    return res.status(200).json({
      success: true,
      msg: "Bank accounts created successfully",
      data: createdAccounts,
    });
  } catch (error) {
    console.log("Error in creating bank accounts:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}

// DELETE BANK ACCOUNT
export async function deleteBankAccount(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please Provide Bank Account ID" });
    }

    // FIND THE BANK ACCOUNT BASED ON THE ID AND DELETE IT
    const bankAccount = await BankAccount.findByIdAndDelete(id);
    if (!bankAccount) {
      return res.status(400).json({
        success: false,
        msg: "Bank account details could not be deleted",
      });
    }

    // RETURN SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      msg: "Bank account details deleted",
      bankAccount,
    });
  } catch (error) {
    console.log("Error in deleting bank account details", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}

// UPDATE BANK ACCOUNT DETAILS
export async function updateBankAccountDetails(req, res) {
  try {
    const businessId = new mongoose.Types.ObjectId(req.query?.businessId);
    const partyId = new mongoose.Types.ObjectId(req.query?.partyId);
    const accountId = new mongoose.Types.ObjectId(req.query?.accountId);

    if (!accountId) {
      return res
        .status(400)
        .json({ success: false, msg: "Please Provide Bank Account ID" });
    }

    // FIND THE BANK ACCOUNT BASED ON THE ID AND UPDATE
    const updateBankAccountDetails = await BankAccount.findByIdAndUpdate(
      { _id: accountId },
      req.body,
      { new: true }
    );
    if (!updateBankAccountDetails) {
      return res.status(400).json({
        success: false,
        msg: "Bank account details could not be updated",
      });
    }

    // RETURN SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      msg: "Bank account details updated",
      updateBankAccountDetails,
    });
  } catch (error) {
    console.log("Error in updating Bank account details", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}

// GET BANK ACCOUNT DETAILS API
export async function getBankAccountDetails(req, res) {
  try {
    // GET THE BANK ACCOUNT ID FROM THE PARAMETERS
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please Provide Bank Account ID" });
    }

    // FIND THE BANK ACCOUNT BASED ON THE ID AND UPDATE
    const displayBankAccountDetails = await BankAccount.findById(id);
    if (!displayBankAccountDetails) {
      return res.status(400).json({
        success: false,
        msg: "Bank Account Details could not be display",
      });
    }

    // RETURN SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      msg: "Bank Account details updated",
      displayBankAccountDetails,
    });
  } catch (error) {
    console.log("Error in display Bank Account details", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}

// create bank account for business
export async function createBankAccountForBusiness(req, res) {
  try {
    const {
      accountName,
      bankAccountNumber,
      ifscCode,
      openingBalance,
      bankAndBranchName,
      accountHoldersName,
      upiId,
      asOfDate,
    } = req.body;
    const businessId = req.params?.id;
    const validatedResult = businessBankAccount.safeParse(req.body);
    if (!validatedResult.success) {
      const errors = validatedResult.error.format();
      return res
        .status(400)
        .json({ success: false, msg: "Validation failed", errors });
    }

    const bankAccount = await BusinessBankAccount.create({
      accountName,
      bankAccountNumber,
      IFSCCode: ifscCode,
      openingBalance,
      bankAndBranchName,
      accountHoldersName,
      upiId,
      asOfDate,
      businessId: businessId,
      clientId: req.user?.id,
    });

    return res.status(200).json({
      success: true,
      msg: "Bank account created successfully",
      bankAccount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// get business bank account
export async function getBusinessBankAccounts(req, res) {
  try {
    const id = req.params.id;
    const businessBankAccounts = await BusinessBankAccount.find({
      businessId: id,
      clientId: req.user?.id,
    });
    console.log("BUSINESS BANK ACCOUNTS ", businessBankAccounts);
    if (!businessBankAccounts) {
      return res.status(400).json({ msg: "Business bank accounts not found" });
    }
    return res.status(200).json(businessBankAccounts);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function deleteBusinessBankAccount(req, res) {
  try {
    const id = req.params.id;
    const businessId = req.query?.businessId;
    const deletedBankAccount = await BusinessBankAccount.findByIdAndDelete({
      _id: id,
      businessId,
    });
    if (!deletedBankAccount) {
      return res.status(400).json({ msg: "Bank account not found" });
    }
    return res.status(200).json({ msg: "Bank account removed successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getSinglePartyBankDetails(req, res) {
  try {
    const partyId = new mongoose.Types.ObjectId(req.params.id);
    if (!partyId) {
      return res.status(400).json({ msg: "Please provide party id" });
    }
    const bankAccounts = await BankAccount.find({
      partyId: partyId,
      clientId: req.user?.id,
      businessId: req.query?.businessId,
    });
    if (!bankAccounts) {
      return res.status(400).json({ msg: "Bank account not found" });
    }
    return res.status(200).json(bankAccounts);
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function deletePartyBankAccount(req, res) {
  try {
    const id = req.params.id;
    const deletedBankAccount = await BankAccount.findByIdAndDelete({
      _id: id,
    });
    if (!deletedBankAccount) {
      return res.status(400).json({ msg: "Bank account not found" });
    }
    return res.status(200).json({ msg: "Bank account removed successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function markBusinessBankAccountAsActive(req, res) {
  try {
    const { id } = req.params;
    const { businessId } = req.query;

    if (!id || !businessId) {
      return res.status(400).json({
        success: false,
        msg: "Bank account ID and business ID are required",
      });
    }
    const bankAccount = await BusinessBankAccount.findById(id);
    if (!bankAccount) {
      return res
        .status(404)
        .json({ success: false, msg: "Bank account not found" });
    }

    if (bankAccount.businessId.toString() !== businessId) {
      return res.status(400).json({
        success: false,
        msg: "Bank account does not belong to this business",
      });
    }

    await BusinessBankAccount.updateMany(
      { businessId, _id: { $ne: id } },
      { $set: { isActive: false } }
    );

    bankAccount.isActive = true;
    await bankAccount.save();

    return res.status(200).json({
      success: true,
      msg: "Bank account marked as active",
      bankAccount,
    });
  } catch (error) {
    console.error("Error marking bank account as active:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
}
