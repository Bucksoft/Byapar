import { bankAccountSchema } from "../config/validation.js";
import BankAccount from "../models/bankAccount.schema.js";

export async function createBankAccount(req, res) {
  try {
    // GET THE DATA FROM THE FRONTEND
    const data = req.body;
    if (!data) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide the data" });
    }

    // VALIDATE THE DATA
    const validatedResult = bankAccountSchema.safeParse(data);
    if (!validatedResult.success) {
      const errors = validatedResult.error.format();
      return res
        .status(400)
        .json({ success: true, msg: "Validation failed", errors });
    }

    // CHECK BANK ACCOUNT ALREADY EXISTS OR NOT
    const { bankAccountNumber, accountHolderName, ifscCode } = data;
    const customerExists = await BankAccount.findOne({
      bankAccountNumber,
      accountHolderName,
      ifscCode,
    });

    // IF EXISTS, RETURN FAILURE RESPONSE
    if (customerExists) {
      return res
        .status(400)
        .json({ success: false, msg: "Customer already exists" });
    }

    // CREATE BANK ACCOUNT
    const bankAccount = await BankAccount.create({
      ...validatedResult.data,
      businessId: req?.params?.businessId,
    });
    if (!bankAccount) {
      return res
        .status(400)
        .json({ success: false, msg: "Bank Account could not be created" });
    }

    // RETURN SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      msg: "Bank Account created successfully",
      bankAccount,
    });
  } catch (error) {
    console.log("Error in creating business ", error);
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
    // GET THE BANK ACCOUNT ID FROM THE PARAMETERS
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Please Provide Bank Account ID" });
    }

    // FIND THE BANK ACCOUNT BASED ON THE ID AND UPDATE
    const updateBankAccountDetails = await BankAccount.findByIdAndUpdate(
      id,
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
